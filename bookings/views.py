import datetime
from datetime import timedelta
from django.views.decorators.cache import never_cache
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.exceptions import ValidationError
from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from django.http import JsonResponse
from .models import Room, Booking
from .forms import BookingForm
from .utils import notify_booking

START_HOUR = 0
END_HOUR = 24
SLOTS_PER_HOUR = 2
TOTAL_SLOTS = (END_HOUR - START_HOUR) * SLOTS_PER_HOUR


def _format_hour(h):
    # converts 24h int to 12h label like '2pm'
    h = h % 24
    if h == 0:
        return '12am'
    if h == 12:
        return '12pm'
    return f'{h}am' if h < 12 else f'{h - 12}pm'


def _slot_index(t):
    # maps a time to its 30-min slot index
    return (t.hour - START_HOUR) * SLOTS_PER_HOUR + (1 if t.minute >= 30 else 0)


def _is_ajax(request):
    return request.headers.get('x-requested-with') == 'XMLHttpRequest'


@login_required
def dashboard(request):
    rooms = Room.objects.all()
    today = timezone.localdate()
    stats = {
        'total_rooms': rooms.count(),
        'my_active_bookings': Booking.objects.filter(booked_by=request.user, date__gte=today).count(),
        'bookings_today': Booking.objects.filter(date=today).count(),
    }
    return render(request, 'bookings/dashboard.html', {'rooms': rooms, 'stats': stats})


@login_required
@never_cache
def new_booking(request):
    is_ajax = _is_ajax(request)
    if request.method == 'POST':
        form = BookingForm(request.POST)
        if not form.is_valid():
            if is_ajax:
                return JsonResponse({'success': False, 'message': 'Please check the booking details and try again.'})
            messages.error(request, "Please check the booking details and try again.")
        else:
            booking = form.save(commit=False)
            booking.booked_by = request.user  # attach current user before validating
            try:
                booking.full_clean()  # triggers model clean() validation
                booking.save()
                notify_booking(booking, 'created')  # async email
                if is_ajax:
                    return JsonResponse({'success': True, 'message': f"Booked {booking.room.name} for {booking.date}."})
                messages.success(request, f"Booked {booking.room.name} for {booking.date}.")
                return redirect('bookings')
            except ValidationError as e:
                error_message = e.messages[0] if hasattr(e, 'messages') else str(e)
                if is_ajax:
                    return JsonResponse({'success': False, 'message': error_message})
                messages.error(request, error_message)
                # send user back to the room page with the same date on failure
                if booking.room_id and booking.date:
                    return redirect(f'/dashboard/rooms/{booking.room_id}/?date={booking.date}')
    else:
        initial = {}
        room_id = request.GET.get('room')
        if room_id:
            initial['room'] = room_id
        form = BookingForm(initial=initial)

    rooms = Room.objects.all()
    active_count = Booking.objects.filter(booked_by=request.user, date__gte=timezone.localdate()).count()
    return render(request, 'bookings/new_booking.html', {
        'form': form, 'rooms': rooms, 'at_limit': active_count >= 10, 'active_count': active_count,
    })


@login_required
def go_to_room(request):
    # quick redirect used by dropdown nav
    room_id = request.GET.get('room')
    if room_id:
        return redirect('room_detail', room_id=room_id)
    return redirect('new_booking')


@login_required
@never_cache
def booking_list(request):
    today = timezone.localdate()
    now = timezone.localtime()
    bookings = Booking.objects.filter(booked_by=request.user)

    # optional filters from query params
    room_id = request.GET.get('room')
    date = request.GET.get('date')
    if room_id:
        bookings = bookings.filter(room_id=room_id)
    if date:
        bookings = bookings.filter(date=date)

    today_bookings = list(bookings.filter(date=today))
    upcoming_bookings = list(bookings.filter(date__gt=today))
    past_bookings = bookings.filter(date__lt=today).order_by('-date', '-start_time')

    def attach_lock_flag(items):
        # marks bookings uneditable within 15 min of start or after end
        for b in items:
            start_dt = timezone.make_aware(datetime.datetime.combine(b.date, b.start_time))
            end_dt = timezone.make_aware(datetime.datetime.combine(b.date, b.end_time))
            b.is_locked = now >= end_dt or (start_dt - now < timedelta(minutes=15))

    attach_lock_flag(today_bookings)
    attach_lock_flag(upcoming_bookings)

    # find the single next upcoming booking for the "Next Up" widget
    next_booking = None
    todays_remaining = sorted([b for b in today_bookings if b.start_time >= now.time()], key=lambda b: b.start_time)
    if todays_remaining:
        next_booking = todays_remaining[0]
    elif upcoming_bookings:
        next_booking = sorted(upcoming_bookings, key=lambda b: (b.date, b.start_time))[0]

    return render(request, 'bookings/booking_list.html', {
        'today_bookings': today_bookings, 'upcoming_bookings': upcoming_bookings,
        'past_bookings': past_bookings, 'all_rooms': Room.objects.all(),
        'today': today, 'has_any': bookings.exists(), 'next_booking': next_booking,
    })


@login_required
@never_cache
def edit_booking(request, booking_id):
    # get_object_or_404 enforces ownership via booked_by filter
    booking = get_object_or_404(Booking, id=booking_id, booked_by=request.user)
    now = timezone.localtime()
    start_dt = timezone.make_aware(datetime.datetime.combine(booking.date, booking.start_time))
    end_dt = timezone.make_aware(datetime.datetime.combine(booking.date, booking.end_time))

    if now >= end_dt:
        messages.error(request, "This booking has already finished and can no longer be edited.")
        return redirect('bookings')
    if start_dt - now < timedelta(minutes=15):
        messages.error(request, "Bookings can only be changed at least 15 minutes before they start.")
        return redirect('bookings')

    is_ajax = _is_ajax(request)
    if request.method == 'POST':
        form = BookingForm(request.POST, instance=booking)
        if form.is_valid():
            updated = form.save(commit=False)
            try:
                updated.full_clean()
                updated.save()
                notify_booking(updated, 'modified')
                if is_ajax:
                    return JsonResponse({
                        'success': True, 'message': 'Booking updated.',
                        'start_time': updated.start_time.strftime('%I:%M %p'),
                        'end_time': updated.end_time.strftime('%I:%M %p'),
                    })
                messages.success(request, "Booking updated.")
                return redirect('bookings')
            except ValidationError as e:
                error_message = e.messages[0] if hasattr(e, 'messages') else str(e)
                if is_ajax:
                    return JsonResponse({'success': False, 'message': error_message})
                form.add_error(None, e)
        elif is_ajax:
            return JsonResponse({'success': False, 'message': 'Please check the booking details.'})
    else:
        form = BookingForm(instance=booking)

    # other bookings for the same room/date, used to render blocked slots on the timeline
    other_bookings = Booking.objects.filter(room=booking.room, date=booking.date).exclude(pk=booking.pk)
    existing_bookings = [{
        'start_slot': b.start_time.hour * 2 + (1 if b.start_time.minute >= 30 else 0),
        'end_slot': b.end_time.hour * 2 + (1 if b.end_time.minute >= 30 else 0),
        'label': b.booked_by.get_full_name() or b.booked_by.username,
    } for b in other_bookings]

    current_start_slot = booking.start_time.hour * 2 + (1 if booking.start_time.minute >= 30 else 0)
    current_end_slot = booking.end_time.hour * 2 + (1 if booking.end_time.minute >= 30 else 0)

    return render(request, 'bookings/edit_booking.html', {
        'form': form, 'booking': booking, 'existing_bookings': existing_bookings,
        'current_start_slot': current_start_slot, 'current_end_slot': current_end_slot,
    })


@login_required
def cancel_booking(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id, booked_by=request.user)  # ownership check
    is_ajax = _is_ajax(request)
    now = timezone.localtime()
    start_dt = timezone.make_aware(datetime.datetime.combine(booking.date, booking.start_time))

    if start_dt - now < timedelta(minutes=15):
        message = "Bookings can only be cancelled at least 15 minutes before they start."
        if is_ajax:
            return JsonResponse({'success': False, 'message': message}, status=400)
        messages.error(request, message)
        return redirect('bookings')

    if request.method == 'POST':
        notify_booking(booking, 'cancelled')
        booking.delete()
        if is_ajax:
            return JsonResponse({'success': True, 'message': 'Booking cancelled.'})
        messages.info(request, "Booking cancelled.")
        return redirect('bookings')

    if is_ajax:
        return JsonResponse({'success': False, 'message': 'Invalid request.'}, status=400)
    return render(request, 'bookings/cancel_confirm.html', {'booking': booking})


@login_required
@never_cache
def room_detail(request, room_id):
    room = get_object_or_404(Room, id=room_id)
    form = BookingForm(initial={'room': room.id})
    selected_date = request.GET.get('date') or timezone.localdate().isoformat()
    existing = Booking.objects.filter(room=room, date=selected_date)
    today_value = timezone.localdate().strftime('%Y-%m-%d')
    max_bookable_date = (timezone.localdate() + timedelta(days=90)).isoformat()  # used by date picker min/max

    existing_bookings = [{
        'start_slot': b.start_time.hour * 2 + (1 if b.start_time.minute >= 30 else 0),
        'end_slot': b.end_time.hour * 2 + (1 if b.end_time.minute >= 30 else 0),
        'label': b.booked_by.get_full_name() or b.booked_by.username,
    } for b in existing]

    return render(request, 'bookings/room_detail.html', {
        'room': room, 'form': form, 'selected_date': selected_date,
        'existing_bookings': existing_bookings, 'today': today_value,
        'max_bookable_date': max_bookable_date,
    })


@login_required
def calendar_view(request):
    date_str = request.GET.get('date')
    try:
        selected_date = datetime.date.fromisoformat(date_str) if date_str else timezone.localdate()
    except ValueError:
        selected_date = timezone.localdate()  # fallback on bad date input

    hours = [{'hour': h, 'label': _format_hour(h)} for h in range(START_HOUR, END_HOUR)]
    now = timezone.localtime()
    room_rows = []

    for room in Room.objects.all():
        bookings = Booking.objects.filter(room=room, date=selected_date).order_by('start_time')
        cells = []
        pointer = 0  # tracks how many slots have been filled so far in this row
        for b in bookings:
            start = max(0, _slot_index(b.start_time))
            end = min(TOTAL_SLOTS, _slot_index(b.end_time))
            while pointer < start:
                cells.append({'type': 'blank'})  # fill gap before this booking
                pointer += 1
            if end > start:
                booking_end_dt = timezone.make_aware(datetime.datetime.combine(b.date, b.end_time))
                cells.append({
                    'type': 'booking', 'span': end - start,
                    'label': b.booked_by.get_full_name() or b.booked_by.username,
                    'booking_id': b.id, 'is_mine': b.booked_by_id == request.user.id,
                    'is_past': now >= booking_end_dt,
                })
                pointer = end
        while pointer < TOTAL_SLOTS:
            cells.append({'type': 'blank'})  # fill remaining slots after last booking
            pointer += 1
        room_rows.append({'room': room, 'cells': cells})

    return render(request, 'bookings/calendar.html', {
        'selected_date': selected_date, 'prev_date': selected_date - timedelta(days=1),
        'next_date': selected_date + timedelta(days=1), 'today_date': timezone.localdate(),
        'hours': hours, 'closing_label': _format_hour(END_HOUR), 'room_rows': room_rows,
    })
import logging
import threading
from django.core.mail import send_mail

logger = logging.getLogger(__name__)

SUBJECT_MAP = {
    'created': 'Booking Confirmed',
    'modified': 'Booking Updated',
    'cancelled': 'Booking Cancelled',
}

INTRO_MAP = {
    'created': 'Your room booking is confirmed.',
    'modified': 'Your room booking has been updated.',
    'cancelled': 'Your room booking has been cancelled.',
}


def notify_booking(booking, action):
    recipient = booking.booked_by.email
    if not recipient:
        return  # no email on file, skip

    subject = f"WorkNest — {SUBJECT_MAP[action]}"
    name = booking.booked_by.get_full_name() or booking.booked_by.username

    message = (
        f"Hi {name},\n\n"
        f"{INTRO_MAP[action]}\n\n"
        f"Room:  {booking.room.name}\n"
        f"Date:  {booking.date}\n"
        f"Time:  {booking.start_time.strftime('%I:%M %p')} - {booking.end_time.strftime('%I:%M %p')}\n\n"
        f"You can manage this booking anytime from the Bookings page in WorkNest.\n\n"
        f"— WorkNest\n"
        f"Edgar E-File Solutions"
    )

    def _send_email():
        try:
            send_mail(subject, message, None, [recipient])
        except Exception:
            logger.exception("Failed to send booking email")

    threading.Thread(target=_send_email, daemon=True).start()
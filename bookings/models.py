from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta


class Amenity(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Room(models.Model):
    name = models.CharField(max_length=100)
    capacity = models.PositiveIntegerField()
    amenities = models.ManyToManyField(Amenity, blank=True)
    image = models.ImageField(upload_to='room_images/', blank=True, null=True)

    def __str__(self):
        return self.name


class Booking(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='bookings')
    booked_by = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date', 'start_time']

    def clean(self):
        today = timezone.localdate()
        now = timezone.localtime()

        # end must be after start
        if self.start_time and self.end_time and self.start_time >= self.end_time:
            raise ValidationError("End time must be after start time.")

        # block past dates
        if self.date and self.date < today:
            raise ValidationError("You can't book a room for a past date.")

        # block already-passed slots today
        if self.date == today and self.start_time and self.start_time < now.time():
            raise ValidationError("You can't book a time slot that's already passed today.")

        # prevent double-booking the same room/time
        if self.room_id and self.date and self.start_time and self.end_time:
            overlapping = Booking.objects.filter(
                room=self.room, date=self.date,
                start_time__lt=self.end_time, end_time__gt=self.start_time,
            ).exclude(pk=self.pk)
            if overlapping.exists():
                raise ValidationError("This room is already booked for part of that time slot.")

        # cap active bookings per user (only on create, not edit)
        if self.booked_by_id and not self.pk:
            active_count = Booking.objects.filter(
                booked_by=self.booked_by, date__gte=timezone.localdate(),
            ).count()
            if active_count >= 10:
                raise ValidationError("You've reached the limit of 10 active bookings. Cancel an existing one to book another.")

        # cap how far ahead a booking can be made
        if self.date and self.date > today + timedelta(days=90):
            raise ValidationError("Bookings can only be made up to 90 days in advance.")

    def __str__(self):
        return f"{self.room.name} — {self.date} {self.start_time}-{self.end_time} ({self.booked_by.username})"
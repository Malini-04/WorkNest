from django import forms
from django.utils import timezone
from datetime import timedelta
from .models import Booking


class BookingForm(forms.ModelForm):
    class Meta:
        model = Booking
        fields = ['room', 'date', 'start_time', 'end_time']
        widgets = {
            'room': forms.Select(attrs={'class': 'form-select'}),
            'date': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'start_time': forms.TimeInput(attrs={'type': 'time', 'class': 'form-control'}),
            'end_time': forms.TimeInput(attrs={'type': 'time', 'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # restrict date picker to today..+90 days (UI-level; model.clean() enforces server-side)
        today = timezone.localdate()
        self.fields['date'].widget.attrs['min'] = today.isoformat()
        self.fields['date'].widget.attrs['max'] = (today + timedelta(days=90)).isoformat()
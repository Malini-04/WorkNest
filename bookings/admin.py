from django import forms
from django.contrib import admin
from .models import Room, Booking, Amenity


class RoomAdminForm(forms.ModelForm):
    amenities = forms.ModelMultipleChoiceField(
        queryset=Amenity.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False,
    )

    class Meta:
        model = Room
        fields = '__all__'


class RoomAdmin(admin.ModelAdmin):
    form = RoomAdminForm


admin.site.register(Amenity)
admin.site.register(Room, RoomAdmin)
admin.site.register(Booking)
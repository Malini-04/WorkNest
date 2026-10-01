from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('new-booking/', views.new_booking, name='new_booking'),
    path('go-to-room/', views.go_to_room, name='go_to_room'),
    path('bookings/', views.booking_list, name='bookings'),
    path('bookings/<int:booking_id>/edit/', views.edit_booking, name='edit_booking'),
    path('bookings/<int:booking_id>/cancel/', views.cancel_booking, name='cancel_booking'),
    path('rooms/<int:room_id>/', views.room_detail, name='room_detail'),
    path('calendar/', views.calendar_view, name='calendar'),
]
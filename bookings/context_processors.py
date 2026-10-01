from .models import Room

def nav_rooms(request):
    if request.user.is_authenticated:
        return {'nav_rooms': Room.objects.all()}
    return {}
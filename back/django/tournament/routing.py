from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/tournament/', consumers.TournamentConsumer.as_asgi()),
]
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from django.urls import path
from channels.security.websocket import AllowedHostsOriginValidator
from .consumers import PingPongConsumer

websocket_urlpatterns = [
    path("ws/pingpong/<str:room_name>/", PingPongConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                path("ws/pingpong/<str:room_name>/", PingPongConsumer.as_asgi()),
            ])
        )
    ),
})
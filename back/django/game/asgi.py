import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'game.settings')
django.setup()

from game.routing import websocket_urlpatterns as game_websocket_urlpatterns
from turn.routing import websocket_urlpatterns as turn_websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            game_websocket_urlpatterns +
            turn_websocket_urlpatterns
        )
    ),
})
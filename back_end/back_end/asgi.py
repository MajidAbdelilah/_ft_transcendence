import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack
from django.core.asgi import get_asgi_application
import  chat.routing 
import friend.routing
# from tournament.routing import websocket_urlpatterns
from friend.routing import websocket_urlpatterns
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'game.settings')
django.setup()


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns +  # assuming it's a list or iterable
            chat.routing.websocket_urlpatterns +
            friend.routing.websocket_urlpatterns
        )
    ),
})
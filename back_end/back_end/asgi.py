import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
# from channels.auth import AuthMiddlewareStack
from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack
from django.core.asgi import get_asgi_application
import  chat.routing 
import friend.routing
# from tournament.routing import websocket_urlpatterns
from friend.routing import websocket_urlpatterns
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
import jwt
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'game.settings')
django.setup()

# class UserStatusConsumer(JWTAuthentication):
    
User = get_user_model()

@database_sync_to_async
def get_user_from_jwt_token(token_key):
    try:
        payload = jwt.decode(token_key, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get('user_id')
        return User.objects.get(id=user_id)
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, User.DoesNotExist):
        return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = dict((x.split('=') for x in scope['query_string'].decode().split('&')))
        token_key = query_string.get('token')
        scope['user'] = await get_user_from_jwt_token(token_key) if token_key else AnonymousUser()
        return await super().__call__(scope, receive, send)
   
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddleware(
        URLRouter(
            websocket_urlpatterns +  # assuming it's a list or iterable
            chat.routing.websocket_urlpatterns +
            friend.routing.websocket_urlpatterns
        )
    ),
})
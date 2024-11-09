"""
ASGI config for back_end project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from friend import routing as dashboard_routing #friend
import  chat.routing 

# from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack
from django.urls import re_path,path
from channels.generic.websocket import AsyncWebsocketConsumer
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back_end.settings')

class DefaultConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.close()

application = ProtocolTypeRouter(
    {
        "http":  get_asgi_application(),
        "websocket": 
        # JWTAuthMiddlewareStack(
            URLRouter(
                # [path('ws/default/', DefaultConsumer.as_asgi())],
                chat.routing.websocket_urlpatterns
                # + [re_path(r"^.*$", DefaultConsumer.as_asgi())]
            )
        # ),
    }
)

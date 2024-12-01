from django.urls import re_path

def get_websocket_urlpatterns():
    from .consumers import PingPongGameConsumer
    return [ 
        re_path( r'ws/game/(?P<room_id>\w+)/$', PingPongGameConsumer.as_asgi() ),
    ]

websocket_urlpatterns = get_websocket_urlpatterns()
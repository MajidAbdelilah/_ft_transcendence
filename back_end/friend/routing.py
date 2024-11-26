# from django.urls import re_path
# from . import consumers

# # websocket_urlpatterns = [
# #     re_path(r'ws/friend/(?P<room_name>\w+)/$', consumers.FriendConsumer),
# # ]

# dashboards/routing.py
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # re_path(r'ws/friend', consumers.UserStatusConsumer.as_asgi()),
    #  re_path(r'ws/friend/(?P<room_name>\w+)/$', consumers.friend),
        re_path(r'ws/freind/$', consumers.UserStatusConsumer.as_asgi()),
]

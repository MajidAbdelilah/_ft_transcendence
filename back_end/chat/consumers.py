import json
from asgiref.sync import async_to_sync

from channels.generic.websocket import WebsocketConsumer
from authapp.models import User
from channels.layers import get_channel_layer
from django.db.models import Q
from .models import Messages
from django.conf import settings
import sys

print(User)
class ChatConsumer(WebsocketConsumer):
    def connect(self):
        # if self.scope['user'].is_authenticated:
     self.room_name = self.scope['url_route']['kwargs']['room_name']
     self.room_group_name = f"chat_{self.room_name}"
     async_to_sync(self.channel_layer.group_add)(
         self.room_group_name,
         self.channel_name
     )
     self.accept()
        # else:
        #     self.close()
    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
    # @database_sync_to_async
    # def get_user(self, username):
    #     try:
    #         return User.objects.get(username=username)
    #     except User.DoesNotExist:
    #         return None
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        chat_id = text_data_json["chat_id"]
        message = text_data_json["message"]
        send = text_data_json["send"]
        receive = text_data_json["receive"]
        timestamp = text_data_json["timestamp"]
        print("//////////",receive )
        receive_obj = User.objects.get(username=receive)
        print("+++++ ", receive_obj)
        send_obj = User.objects.get(username=send)

        if len(message) > 512:
            self.send(text_data=json.dumps({
                "error": "Message is too long, must be less than 512 characters."}))
            return
        Messages.objects.create(user_one=send_obj, user_two=receive_obj, message_content=message, message_date=timestamp)

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "send": send,
                "receive": receive,
                "timestamp": timestamp,
                "chat_id": chat_id
            }
        )

    def chat_message(self, event):
        chat_id = event["chat_id"]
        message = event["message"]
        send = event["send"]
        receive = event["receive"]
        timestamp = event["timestamp"]

        self.send(text_data=json.dumps({
            "message": message,
            "send": send,
            "receive": receive,
            "timestamp": timestamp,
            "chat_id": chat_id
        }))
       
# import json
# from asgiref.sync import async_to_sync
# from channels.generic.websocket import WebsocketConsumer
# from authapp.models import User
# from friend.models import Friendship, Notification
# from channels.layers import get_channel_layer
# from django.db.models import Q
# from .models import Messages
# from django.conf import settings
# import sys
# import json
# from asgiref.sync import async_to_sync

# from channels.generic.websocket import WebsocketConsumer
# from authapp.models import User
# from channels.layers import get_channel_layer
# from django.db.models import Q
# from .models import Messages
# from django.conf import settings
# # import sys

# import json
# from asgiref.sync import async_to_sync
# from channels.generic.websocket import WebsocketConsumer
# from authapp.models import User
# from friend.models import Friendship, Notification
# from channels.layers import get_channel_layer
# from django.db.models import Q
# from .models import Messages
# from django.conf import settings
# import sys

# class ChatConsumer(WebsocketConsumer):
#     def connect(self):
#         if self.scope["user"].is_authenticated:
#             self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
#             self.room_group_name = f"chat_{self.room_name}"
#             async_to_sync(self.channel_layer.group_add)(
#                 self.room_group_name, self.channel_name
#             )
#             self.accept()
#         else:
#             self.close()

#     def disconnect(self, close_code):
#         async_to_sync(self.channel_layer.group_discard)(
#             self.room_group_name, self.channel_name
#         )

#     def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         chat_id = text_data_json["chat_id"]
#         message = text_data_json["message"]
#         send = text_data_json["send"]
#         receive = text_data_json["receive"]
#         timestamp = text_data_json["timestamp"]

#         receiver_obj = User.objects.get(username = receiver)
#         sender_obj = User.objects.get(username = sender)

#         if len(message) > 512:
#             self.send(text_data=json.dumps({"error": "Message is too long."}))
#             return

#         FriendshipObj = Friendship.objects.filter(Q(user_from = sender_obj, user_to = receiver_obj) | Q(user_from = receiver_obj, user_to = sender_obj)).first()
        
#         if not FriendshipObj:
#             self.send(text_data=json.dumps({"error": "You are not friends with this user."}))
#             return
        
#         if FriendshipObj.u_one_is_blocked_u_two == True or FriendshipObj.u_two_is_blocked_u_one == True:
#             self.send(text_data=json.dumps({"error": "You are blocked by this user."}))
#             return

#         Messages.objects.create(
#             user_one=sender_obj,
#             user_two=receiver_obj,
#             message_content=message,
#             message_date=timestamp
#         )

#         # notification = Notification.objects.create(
#         #     user=receiver_obj,
#         #     title = "New message !",
#         #     message = f"A new message from {sender_obj.username}: { message[:20] + "..." + if len(message) > 20 else message}",
#         #     image_url=sender_obj.image_url,
#         #      link=f"{settings.FRONTEND_HOST}/chat?username={sender_obj.username}",
#         #     is_chat_notif=True,
#         #     action_by = sender_obj.username,
#         # )

#         # async_to_sync(self.channel_layer.group_send)(
#         #     f"user_{receiver_obj.id}",
#         #     {
#         #         "type": "send_notification",
#         #             "notification_id": notification.notification_id,
#         #             "count": Notification.objects.filter(user = receiver_obj).count(),
#         #             "is_chat_notif": notification.is_chat_notif,
#         #             "is_friend_notif": notification.is_friend_notif,
#         #             "is_tourn_notif": notification.is_tourn_notif,
#         #             "is_match_notif": notification.is_match_notif,
#         #     },
#         # )

#         async_to_sync(self.channel_layer.group_send)(
#             self.room_group_name, {"type": "chat.message", "message": message, "send": sender, "receive": receiver, "timestamp": timestamp, "chat_id": chat_id}
#         )

#     def chat_message(self, event):
#         chat_id = event["chat_id"]
#         message = event["message"]
#         sender = event["send"]
#         receiver = event["receive"]
#         timestamp = event["timestamp"]
#         self.send(text_data=json.dumps({"message": message, "send": sender, "receive": receiver, "timestamp": timestamp, "chat_id": chat_id}))

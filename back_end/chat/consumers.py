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
       
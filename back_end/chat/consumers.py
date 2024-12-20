import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from authapp.models import User
from .models import Messages

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        # Extract user ID from the WebSocket URL
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"  # Group for the user's ID

        # Add the user to their own group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # Remove the user from their group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        chat_id = text_data_json["chat_id"]
        message = text_data_json["message"]
        send = text_data_json["send"]
        receive = text_data_json["receive"]
        timestamp = text_data_json["timestamp"]


        # Check sender and receiver
        try:
            receive_obj = User.objects.get(username=receive)
        except User.DoesNotExist:
            return

        try:
            send_obj = User.objects.get(username=send)
        except User.DoesNotExist:
            return

        if len(message) > 512:
            self.send(text_data=json.dumps({
                "error": "Message is too long, must be less than 512 characters."
            }))
            return

        # Save the message
        Messages.objects.create(
            user_one=send_obj, user_two=receive_obj,
            message_content=message, message_date=timestamp
        )
        # Add the receiver to the group (Sender's group)
        receiver_group = f"chat_{receive_obj.id}"  # Receiver's group based on their user ID
        async_to_sync(self.channel_layer.group_add)(
            receiver_group,  # Add receiver to their group
            self.channel_name  # Same socket for the sender and receiver
        )

        # Broadcast the message to the receiver's group (the group they just joined)
        async_to_sync(self.channel_layer.group_send)(
            receiver_group,  # Broadcast to receiver's group
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

        # Send message to the WebSocket
        self.send(text_data=json.dumps({
            "message": message,
            "send": send,
            "receive": receive,
            "timestamp": timestamp,
            "chat_id": chat_id
        }))
   

    #notify the receiver that the sender about a new message
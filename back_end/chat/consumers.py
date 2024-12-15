


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
        print(f"[CONNECT] User {self.room_name} connected to group: {self.room_group_name}, channel: {self.channel_name}")
        self.accept()

    def disconnect(self, close_code):
        # Remove the user from their group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
        print(f"[DISCONNECT] User {self.room_name} disconnected from group: {self.room_group_name}, channel: {self.channel_name}")

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        chat_id = text_data_json["chat_id"]
        message = text_data_json["message"]
        send = text_data_json["send"]
        receive = text_data_json["receive"]
        timestamp = text_data_json["timestamp"]

        print(f"[RECEIVE] Message received in group: {self.room_group_name}")
        print(f"[RECEIVE] Message details - Sender: {send}, Receiver: {receive}, Message: {message}")

        # Check sender and receiver
        try:
            receive_obj = User.objects.get(username=receive)
            print(f"[RECEIVE] Receiver found: {receive_obj}")
        except User.DoesNotExist:
            print(f"[RECEIVE] Receiver {receive} does not exist in the database.")
            return

        try:
            send_obj = User.objects.get(username=send)
            print(f"[RECEIVE] Sender found: {send_obj}")
        except User.DoesNotExist:
            print(f"[RECEIVE] Sender {send} does not exist in the database.")
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
        print(f"[SAVE MESSAGE] Message saved: {message} from {send_obj} to {receive_obj}")

        # Add the receiver to the group (Sender's group)
        receiver_group = f"chat_{receive_obj.id}"  # Receiver's group based on their user ID
        async_to_sync(self.channel_layer.group_add)(
            receiver_group,  # Add receiver to their group
            self.channel_name  # Same socket for the sender and receiver
        )
        print(f"[GROUP ADD] Receiver {receive} added to group: {receiver_group}")

        # Broadcast the message to the receiver's group (the group they just joined)
        print(f"[BROADCAST] Broadcasting message to group: {receiver_group}")
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
        notification = Notification.objects.create(
            user=receiver_obj,
            title = "New message !",
            message = f"A new message from {send_obj.username}",
            image_url=sender_obj.image_url,
            link=f"/chat/{chat_id}",
            is_chat_notif=True,
            action_by = sender_obj.username,
        )
        async_to_sync(self.channel_layer.group_send)(
                 f"user_{receiver_obj.id}",
                 {
                    "type": "send_notification",
                    "message": message,
                    "send": send,
                    "receive": receive,
                    "timestamp": timestamp,
                    "chat_id": chat_id,
                    "notif": notification.id,
                 },
             )
        async_to_sync send_notification(self, notification.id)
        print(f"[BROADCAST] Message broadcasted to group: {receiver_group}")
           self.send(text_data=json.dumps({
                "message": event["message"],
                "send": event["send"],
                "receive": event["receive"],
                "timestamp": event["timestamp"],
                "chat_id": event["chat_id"]
            })) 
    def chat_message(self, event):
        print(f"[CHAT MESSAGE] Broadcast received in channel: {self.channel_name}")
        print(f"[CHAT MESSAGE] Event details: {event}")

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
        print(f"[CHAT MESSAGE] Message sent to WebSocket: {message}, for user {send} and {receive}")
   

    #notify the receiver that the sender about a new message
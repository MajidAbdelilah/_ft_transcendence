import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from django.contrib.auth.models import AnonymousUser
from django.db.models import F, Q

from authapp.models import User
from friend.models import Friendship
#JWTAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication


@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()

@database_sync_to_async
def update_user_status(user_id, online):
    print(f"Updating user {user_id} status to {'online' if online else 'offline'}")
    try:
        user = User.objects.get(id=user_id)
        user.is_on = 1 if online else 0
        user.save(update_fields=['is_on'])
        print(f"Updated user {user_id} is_on to {user.is_on}")
        return user
    except User.DoesNotExist:
        print(f"User {user_id} not found")
        return None

@database_sync_to_async
def get_friends(user):
    return list(Friendship.objects.filter(Q(user_from=user) | Q(user_to=user)).select_related('user_from', 'user_to'))


class UserStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope["user"].is_authenticated:
            self.user = await get_user(self.scope["user"].id)
            await self.accept()

            self.group_name = f'user_{self.user.id}'
            await self.channel_layer.group_add(self.group_name, self.channel_name)

            await self.update_user_online_status(True)
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.scope["user"].is_authenticated:
            await self.update_user_online_status(False)
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def update_user_online_status(self, is_on):
        if is_on:
            await update_user_status(self.user.id, True)
            await self.notify_friends(True)
        else:
            await update_user_status(self.user.id, False)
            await self.notify_friends(False)

    async def notify_friends(self, is_on):
        friends = await get_friends(self.user)
        for friendship in friends:
            friend = friendship.user_to if friendship.user_from == self.user else friendship.user_from
            group_name = f'user_{friend.id}'
            await self.channel_layer.group_send(
                group_name,
                {
                    'type': 'user_status',
                    'id': self.user.id,
                    'is_on': is_on
                }
            )

    async def user_status(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_status',
            'id': event['id'],
            'is_on': event['is_on']
        }))

    async def send_notification(self, event):
        print("************3", event)
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'notification_id': event['notification_id'],
            'count': event['count']
        }))
        await self.send(text_data=json.dumps({
                    'status': 'success',
                    'message': 'Invitation status updated successfully.',
        }))


@database_sync_to_async
def get_friendship(freindship_id):
    try:
        return Friendship.objects.get(freindship_id=freindship_id)
    except Friendship.DoesNotExist:
        return None
@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None
@database_sync_to_async
def get_user_from(friendship):
    try:
        return User.objects.get(id=friendship.user_from.id)
    except User.DoesNotExist:
        return None
@database_sync_to_async
def get_user_to(friendship):
    try:
        return User.objects.get(id=friendship.user_to.id)
    except User.DoesNotExist:
        return None
@database_sync_to_async
def is_same(user_id, user_id2):
    return user_id == user_id2
@database_sync_to_async
def save_friendship(friendship):
    return friendship.save()
class FriendRequestConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope["user"].is_authenticated:
            print(f"User {self.scope['user'].id} connected")
            self.user = self.scope["user"]
            await self.accept()

            # Create a personal group for the user to receive friend-related notifications
            self.group_name = f'user_{self.user.id}'
            await self.channel_layer.group_add(self.group_name, self.channel_name)

            # Set user as online and notify friends
            await self.update_user_online_status(True)
            print(f"User {self.user.id} set to online")
        else:
            print("Unauthenticated user tried to connect")
            await self.close()

    async def disconnect(self, close_code):
        print(f"Disconnect called with code {close_code}")
        if hasattr(self, 'user') and self.user.is_authenticated:
            print(f"User {self.user.id} disconnected")
            # First leave the group
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            # Then update status and notify friends
            await self.update_user_online_status(False)
            print(f"User {self.user.id} set to offline")
        else:
            print("Disconnect called but no authenticated user found")

    async def update_user_online_status(self, is_on):
        print(f"Updating online status for user {self.user.id} to {'online' if is_on else 'offline'}")
        # Update user status in database
        user = await update_user_status(self.user.id, is_on)
        if user:
            # Get all friends to notify them about status change
            friends = await get_friends(user)
            print(f"Found {len(friends)} friends to notify")
            
            # Notify all friends about the status change
            for friendship in friends:
                friend_id = friendship.user_to.id if friendship.user_from.id == user.id else friendship.user_from.id
                print(f"Notifying friend {friend_id} about status change")
                message = {
                    'type': 'user_status',
                    'id': user.id,
                    'is_on': 0 if not is_on else 1
                }
                print(f"Sending message: {message}")
                await self.channel_layer.group_send(f'user_{friend_id}', message)
                print(f"Sent status update to friend {friend_id}")

    async def user_status(self, event):
        print(f"Sending status update: {event}")
        message = {
            'type': 'user_status',
            'id': event['id'],
            'is_on': event['is_on']
        }
        print(f"Sending WebSocket message: {message}")
        await self.send(text_data=json.dumps(message))
        print("Status update sent")

    async def receive(self, text_data):
        data = json.loads(text_data)
        print("Received WebSocket message:", data)  # Debug log
        
        if data['type'] == 'friends-add':
            await self.handle_friend_add(data)
        elif data['type'] == 'friend-accept':  # Changed from 'friends-accept'
            print("Handling friend accept request")  # Debug log
            await self.handle_friend_accept(data)
        elif data['type'] == 'friends-block':
            await self.handle_friend_block(data)

    @database_sync_to_async
    def create_friend_request(self, to_user_id):
        try:
            to_user = User.objects.get(id=to_user_id)
            friendship = Friendship.objects.create(
                user_from=self.user,
                user_to=to_user,
                status='pending'
            )
            return friendship
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def accept_friend_request(self, freindship_id):
        try:
            friendship = Friendship.objects.get(freindship_id =freindship_id, user_to=self.user)
            friendship.status = 'accepted'
            friendship.save()
            return friendship
        except Friendship.DoesNotExist:
            return None

    async def handle_friend_add(self, data):
        to_user_id = data.get('to_user_id')
        if not to_user_id:
            await self.send(text_data=json.dumps({
                'status': 'error',
                'message': 'Invalid user ID'
            }))
            return

        # Create friend request
        friendship = await self.create_friend_request(to_user_id)
        
        if friendship:
            # Get the target user
            to_user = await get_user(to_user_id)
            
            # Notify the target user about the friend request
            await self.channel_layer.group_send(
                f'user_{to_user_id}',
                {
                    'type': 'friends_add',
                    'freindship_id': friendship.freindship_id,
                    'user': {
                        'username': self.user.username,
                        'image_name': self.user.image_name or ''
                    }
                }
            )
            
            # Send notification to the sender's channel
            await self.send(text_data=json.dumps({
                'type': 'friend_request_sent',
                'freindship_id': friendship.freindship_id,
                'user': {
                    'username': to_user.username,
                    'image_name': to_user.image_name or ''
                },
                'status': 'success',
                'message': 'Friend request sent'
            }))

    async def handle_friend_accept(self, data):
        try:
            print("Received accept request:", data)  # Debug log
            freindship_id = data.get('freindship_id')
            if not freindship_id:
                print("No friendship_id provided")  # Debug log
                await self.send(text_data=json.dumps({
                    'type': 'friends_accept_error',
                    'status': 'error',
                    'message': 'Invalid friendship ID'
                }))
                return

            # Get the friendship
            friendship = await get_friendship(freindship_id)
            if not friendship:
                print("Friendship not found:", freindship_id)  # Debug log
                await self.send(text_data=json.dumps({
                    'type': 'friends_accept_error',
                    'status': 'error',
                    'message': 'Friend request not found'
                }))
                return

            # Get the users
            user_from = await get_user_from(friendship)
            user_to = await get_user_to(friendship)
            print(f"Processing request - from: {user_from.id}, to: {user_to.id}, current user: {self.user.id}")  # Debug log

            # Verify that the current user is the recipient
            if user_to.id != self.user.id:
                print(f"Authorization failed - user_to: {user_to.id}, current user: {self.user.id}")  # Debug log
                await self.send(text_data=json.dumps({
                    'type': 'friends_accept_error',
                    'status': 'error',
                    'message': 'Not authorized to accept this request'
                }))
                return

            # Accept the request
            print("Accepting friendship request")  # Debug log
            friendship.is_accepted = True
            await save_friendship(friendship)

            # Prepare user data for both users
            user_from_data = {
                'username': user_from.username,
                'image_name': user_from.image_name.lstrip('/') if user_from.image_name else '',
                'id': user_from.id,
                'is_on': user_from.is_on
            }
            
            user_to_data = {
                'username': user_to.username,
                'image_name': user_to.image_name.lstrip('/') if user_to.image_name else '',
                'id': user_to.id,
                'is_on': user_to.is_on
            }

            # Send friend list update to both users
            friend_data = {
                'freindship_id': friendship.freindship_id,
                'is_accepted': True,
                'user_from': user_from.id,
                'user_to': user_to.id,
                'user_is_logged_in': user_from.is_on
            }

            # Update sender's friend list
            await self.channel_layer.group_send(
                f'user_{user_from.id}',
                {
                    'type': 'friends_list_update',
                    'action': 'add',
                    'friend': {**friend_data, 'user': user_to_data}
                }
            )

            # Update recipient's friend list
            await self.channel_layer.group_send(
                f'user_{user_to.id}',
                {
                    'type': 'friends_list_update',
                    'action': 'add',
                    'friend': {**friend_data, 'user': user_from_data}
                }
            )

            # Only notify the sender about the acceptance
            await self.channel_layer.group_send(
                f'user_{user_from.id}',
                {
                    'type': 'friends_accept',
                    'freindship_id': friendship.freindship_id,
                    'user': user_to_data,
                    'user_from': user_from.id,
                    'user_to': user_to.id,
                    'user_is_logged_in': user_to.is_on
                }
            )

            # Send a simple success response to the person who accepted the request
            # await self.send(text_data=json.dumps({
            #     'type': 'friends_accept_success',
            #     'status': 'success',
            #     'message': 'Friend request accepted'
            # }))

        except Exception as e:
            print("Error in handle_friend_accept:", str(e))  # Debug log
            await self.send(text_data=json.dumps({
                'type': 'friends_accept_error',
                'status': 'error',
                'message': str(e)
            }))

    async def friends_list_update(self, event):
        """
        Handler for friends_list_update messages
        """
        await self.send(text_data=json.dumps({
            'type': 'friends_list_update',
            'action': event['action'],
            'friend': event['friend']
        }))

    async def handle_friend_block(self, data):
        try: 
            freindship_id = data.get('freindship_id')
            u_one_is_blocked_u_two = data.get('u_one_is_blocked_u_two')
            u_two_is_blocked_u_one = data.get('u_two_is_blocked_u_one')
            if not freindship_id:
                await self.send(text_data=json.dumps({
                    'type': 'friends_block_error',
                    'status': 'error',
                    'message': 'Invalid friendship ID'
                }))
                return
            # Block friend request
            friendship = await get_friendship(freindship_id)
            if not friendship:
                await self.send(text_data=json.dumps({
                    'type': 'friends_block_error',
                    'status': 'error',
                    'message': 'Friend request not found'
                }))
                return
            
            user_from = await get_user_from(friendship)
            user_to = await get_user_to(friendship)
            if friendship:
                same = await is_same(user_to.id, self.user.id)
                if same:
                    if u_one_is_blocked_u_two == "True":
                        friendship.u_one_is_blocked_u_two = True
                        await save_friendship(friendship)
                        user = {
                            'username': user_from.username,
                            'image_name': user_from.image_name or ''
                        }
                        await self.channel_layer.group_send(
                            f'user_{user_to.id}',
                            {
                                'type': 'friends_block',
                                'freindship_id': user_from.id,
                                'user': user
                            }
                        )
                        await self.send(text_data=json.dumps({
                            'type': 'friends_block_success',
                            'status': 'success',
                            'message': 'Friend request blocked',
                            'type': 'friends_block',
                            'freindship_id': user_from.id,
                            'user': user
                        }))
                    else:
                        friendship.delete()
                        await self.send(text_data=json.dumps({
                            'type': 'friends_block_success',
                            'status': 'success',
                            'message': 'Friend request blockd'
                        }))
        except Exception as e:
            print("Error: ", e)
            await self.send(text_data=json.dumps({
                'type': 'friends_block_error',
                'status': 'error',
                'message': 'An error occurred'
            }))

    async def friends_accept(self, event):
        """
        Handler for friends_accept messages from channel layer
        """
        print("Handling friends_accept message:", event)  # Debug log
        await self.send(text_data=json.dumps({
            'type': 'friends_accept',
            'freindship_id': event['freindship_id'],
            'user': event['user'],
            'user_from': event['user_from'],
            'user_to': event['user_to'],
            'user_is_logged_in': event['user_is_logged_in']
        }))
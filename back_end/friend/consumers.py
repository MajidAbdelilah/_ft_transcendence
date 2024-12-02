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

# @database_sync_to_async
# def update_user_status(user_id, online):
#     if online:
#         # print("**************", User.is_on)
#         return User.objects.filter(id=user_id).update(is_on=F('is_on') + 1)
#     else:
#         user = User.objects.get(id=user_id)
#         if user.is_on > 0:
#             return User.objects.filter(id=user_id).update(is_on=F('is_on') - 1)
#         return None

@database_sync_to_async
def get_friends(user):
    return list(Friendship.objects.filter(Q(user_from=user) | Q(user_to=user)).select_related('user_from', 'user_to'))


# class UserStatusConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         if self.scope["user"].is_authenticated:
#             self.user = await get_user(self.scope["user"].id)
#             await self.accept()

#             self.group_name = f'user_{self.user.id}'
#             await self.channel_layer.group_add(self.group_name, self.channel_name)

#             await self.update_user_online_status(True)
#         else:
#             await self.close()
#     async def disconnect(self, close_code):
#         if self.scope["user"].is_authenticated:
#             await self.update_user_online_status(False)

#             await self.channel_layer.group_discard(self.group_name, self.channel_name)

#     async def update_user_online_status(self, is_on):
#         if is_on:
#             await update_user_status(self.user.id, True)
#             await self.notify_friends(True)
#         else:
#             await update_user_status(self.user.id, False)
#             await self.notify_friends(False)

#     async def notify_friends(self, is_on):
#         print("************1", is_on)
#         friends = await get_friends(self.user)
#         for friendship in friends:
#             friend = friendship.user_to if friendship.user_from == self.user else friendship.user_from
#             group_name = f'user_{friend.id}'
#             await self.channel_layer.group_send(
#                 group_name,
#                 {
#                     'type': 'user_status',
#                     'id': self.user.id,
#                     'username': self.user.username,
#                     'is_on': is_on,
#                     'profile_photo': self.user.profile_photo or ''
#                 }
#             )
#             await self.send(text_data=json.dumps({
#                     'status': 'success',
#                     'message': 'notify_friends successfully.',
#                 }))

#     async def user_status(self, event):
#         print("************2", event)
#         await self.send(text_data=json.dumps({
#             'type': 'user_status',
#             'id': event['id'],
#             'username': event['username'],
#             'is_on': event['is_on'],
#             'profile_photo': event['profile_photo']
#         }))
#         await self.send(text_data=json.dumps({
#                     'status': 'success',
#                     'message': 'user_status successfully.',
#         }))

#     async def send_notification(self, event):
#         print("************3", event)
#         await self.send(text_data=json.dumps({
#             'type': 'notification',
#             'notification_id': event['notification_id'],
#             'count': event['count']
#         }))
#         await self.send(text_data=json.dumps({
#                     'status': 'success',
#                     'message': 'Invitation status updated successfully.',
#         }))



class FriendRequestConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope["user"].is_authenticated:
            self.user = self.scope["user"]
            await self.accept()

            # Create a personal group for the user to receive friend-related notifications
            self.group_name = f'user_{self.user.id}'
            await self.channel_layer.group_add(self.group_name, self.channel_name)
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.scope["user"].is_authenticated:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        
        if data['type'] == 'friends-add':
            await self.handle_friend_add(data)
        elif data['type'] == 'friends-accept':
            await self.handle_friend_accept(data)

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
            
            await self.send(text_data=json.dumps({
                'status': 'success',
                'message': 'Friend request sent'
            }))

    async def handle_friend_accept(self, data):
        freindship_id = data.get('freindship_id')
        if not freindship_id:
            await self.send(text_data=json.dumps({
                'status': 'error',
                'message': 'Invalid friendship ID'
            }))
            return

        # Accept friend request
        friendship = await self.accept_friend_request(freindship_id)
        
        if friendship:
            # Notify both users about the accepted friendship
            await self.channel_layer.group_send(
                f'user_{friendship.user_from.id}',
                {
                    'type': 'friends_accept',
                    'freindship_id': friendship.freindship_id,
                    'user': {
                        'username': self.user.username,
                        'profile_photo': self.user.image_name or ''
                    }
                }
            )
            
            await self.send(text_data=json.dumps({
                'status': 'success',
                'message': 'Friend request accepted'
            }))

    async def friends_add(self, event):
        # Sends friend add notification to the target user
        await self.send(text_data=json.dumps({
            'type': 'friends-add',
            'freindship_id': event['freindship_id'],
            'user': event['user']
        }))

    async def friends_accept(self, event):
        # Sends friend accept notification to the original requester
        await self.send(text_data=json.dumps({
            'type': 'friends-accept',
            'freindship_id': event['freindship_id'],
            'user': event['user']
        }))
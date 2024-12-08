
from rest_framework.views import APIView
# from rest_
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializer import (FriendsSerializer,
                         UserSerializer,
                         BlockedFriendsSerializer,
                         FriendsRequestSerializer,
                         FSerializer,
                         BSerializer
                         )
from .models import Friendship
from authapp.models import User
# from friend.models import Notification
from rest_framework import status
from rest_framework.generics import GenericAPIView
from django.db.models import F, Q
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.auth.models import AnonymousUser
from django.conf import settings


class FriendsView(APIView):
    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = FSerializer

    def get(self, request):
            
            friends_1 = Friendship.objects.filter(user_to=request.user, is_accepted=True, u_one_is_blocked_u_two=False, u_two_is_blocked_u_one=False)
            # print("*********   ",friends_1)
            friends_2 = Friendship.objects.filter(user_from=request.user, is_accepted=True, u_one_is_blocked_u_two=False, u_two_is_blocked_u_one=False)
            friends_2 = friends_1.union(friends_2)
            # print("-------->   ",friends_2)
            serializer = FSerializer(friends_2, many=True)
            print(  "////////////->",serializer.data)

            return Response(serializer.data)
        # else:
        #     return Response([])
        # user = request.user
        # serializer = self.serializer_class(instance=user)
        # return Response(serializer.data)

class UserSearchView(APIView):
    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def post(self, request):
        user = request.data['username_search']
        queryset = User.objects.filter(username__startswith=user)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

class RemoveFriendshipView(APIView):
    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = FriendsSerializer

    def post(self, request):
        user_from = request.user
        username = request.data.get('username')

        try:
            user_remove = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'})
        try:
            friendship = Friendship.objects.get(Q(user_from=user_from, user_to=user_remove)|
                                                Q(user_from=user_remove, user_to=user_from))
            if friendship.u_one_is_blocked_u_two == True or friendship.u_two_is_blocked_u_one == True:
                return Response({'error': 'Friendship blocked'})
            friendship.delete()
            return Response({'success': 'Friendship removed'}, status=status.HTTP_200_OK)
        except Friendship.DoesNotExist:
            return Response({'error': 'Friendship does not exist'})

class AcceptFriendshipView(APIView):
    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = FriendsSerializer

    def post(self, request):
        user_from = request.user
        username = request.data.get('username')
        try:
            user_accept = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'})
        try:
            friendship = Friendship.objects.get(Q(user_from=user_from, user_to=user_accept)|
                                                Q(user_from=user_accept, user_to=user_from))
            if friendship.is_accepted == True:
                return Response({'error': 'Friendship already accepted'})
            elif friendship.u_one_is_blocked_u_two == True or friendship.u_two_is_blocked_u_one == True:
                return Response({'error': 'Friendship blocked'})
            friendship.is_accepted = True
            friendship.save()
            return Response({'success': 'Friendship accepted'}, status=status.HTTP_200_OK)
        except Friendship.DoesNotExist:
            return Response({'error': 'Friendship does not exist'})

class AddFriendshipView(APIView):
    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = FriendsSerializer

    def post(self, request):
        user_from = request.user
        username = request.data.get('username')
        try:
            user_add = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'})
        if user_from.id == user_add.id:
            return Response({'error': 'maymkanx t ajouter rasek lah ihdik?'})
        elif Friendship.objects.filter(Q(user_from=user_from, user_to=user_add) |
                                     Q(user_from=user_add, user_to=user_from)).exists():
            return Response({'error': 'Friendship alrady exist'})
        try:

            friendship = Friendship.objects.create(user_from=user_from, user_to=user_add,
                                                   is_accepted = False,user_is_logged_in=user_from.id)
            friendship.save()

            # notification = Notification.objects.create(
            #     user=user_add,
            #     title="New friend !",
            #     message=f"{user_from.username} sent you a friend request.",
            #     # profile_photo=user_from.profile_photo,
            #     link=f"{settings.FRONTEND_URL}/profile/{user_from.username}",
            #     is_friend_notif=True,
            #     action_by=user_from.username,
            # )
            # channel_layer = get_channel_layer()
            # async_to_sync(channel_layer.group_send)(
            #     f"user_{user_add.id}",
            #     {
            #         "type": "send_notification",
            #         "notification_id": notification.notification_id,
            #         "count": Notification.objects.filter(user = user_add).count(),
            #         "is_chat_notif": notification.is_chat_notif,
            #         "is_friend_notif": notification.is_friend_notif,
            #         "is_tourn_notif": notification.is_tourn_notif,
            #         "is_match_notif": notification.is_match_notif,
            #     },
            # )
            return Response({'success': 'Friendship Added'}, status=status.HTTP_200_OK)
        except Friendship.DoesNotExist:
            return Response({'error': 'Friendship does not exist'})

def serialize_user(user):
    if isinstance(user, AnonymousUser):
        return None
    return {
        'id': user.id,
        'username': user.username,
        'image_url': user.image_url,
    }

class BlockFriendshipView(APIView):
    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = FriendsSerializer

    def block_friend(self, friendship, user_from):
        if friendship.user_from == user_from:
            block_flag = 'u_one_is_blocked_u_two'
        else:
            block_flag = 'u_two_is_blocked_u_one'

        if getattr(friendship, block_flag):
            return Response({'error': 'Friend already blocked'})
        else:
            setattr(friendship, block_flag, True)
            friendship.save()
            return Response({'success': 'Friend blocked'}, status=status.HTTP_200_OK)

    def post(self, request):
        user_from = request.user
        username = request.data.get('username')
        try:
            user_accept = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'})
        try:
            friendship = Friendship.objects.get(Q(user_from=user_from, user_to=user_accept)|
                                                Q(user_from=user_accept, user_to=user_from))
            return self.block_friend(friendship, user_from)
        except Friendship.DoesNotExist:
            return Response({'error': 'Friendship does not exist'})

class UnblockFriendshipView(APIView):
    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = FriendsSerializer

    def unblock_friend(self, friendship, user_from):
        if friendship.user_from == user_from:
            block_flag = 'u_one_is_blocked_u_two'
        else:
            block_flag = 'u_two_is_blocked_u_one'

        if not getattr(friendship, block_flag):
            return Response({'error': 'Friend is not blocked'})
        else:
            setattr(friendship, block_flag, False)
            friendship.save()
            return Response({'success': 'Friend unblocked'}, status=status.HTTP_200_OK)

    def post(self, request):
        user_from = request.user
        username = request.data.get('username')
        try:
            user_accept = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'})
        try:
            friendship = Friendship.objects.get(Q(user_from=user_from, user_to=user_accept)|
                                                Q(user_from=user_accept, user_to=user_from))
            return self.unblock_friend(friendship, user_from)
        except Friendship.DoesNotExist:
            return Response({'error': 'Friendship does not exist'})

class BlockedFriendsView(APIView):
    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = BSerializer

    def get(self, request):
            blocked_users = Friendship.objects.filter(user_to=request.user, u_one_is_blocked_u_two=True).union(
                Friendship.objects.filter(user_to=request.user, u_two_is_blocked_u_one=True)).union(
                    Friendship.objects.filter(user_from=request.user, u_two_is_blocked_u_one=True)).union(Friendship.objects.filter(user_from=request.user, u_one_is_blocked_u_two=True))
            serializer =  BSerializer(blocked_users, many=True)
            print("bloooock *********  ",serializer.data)
            return Response(serializer.data)
# class NotificationsView(APIView):
#     # authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]
#     serializer_class = NotificationUserSerializer

#     def get(self, request):
#         user = request.user
#         serializer = self.serializer_class(instance=user)
#         return Response(serializer.data)

# class NotificationDetailView(APIView):
#     # authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]

#     def delete(self, request, notification_id):
#         user = request.user
#         try:
#             notification = Notification.objects.get(notification_id=notification_id)
#             if notification.user != request.user:
#                 return Response({'error': {'You do not have permission to delete this notification'}}, status=status.HTTP_403_FORBIDDEN)
#             notification.delete()
#             channel_layer = get_channel_layer()
#             async_to_sync(channel_layer.group_send)(
#                 f"user_{user.id}",
#                 {
#                     "type": "send_notification",
#                     "notification_id": notification.notification_id,
#                     "count": Notification.objects.filter(user = user).count(),
#                     "is_chat_notif": notification.is_chat_notif,
#                     "is_friend_notif": notification.is_friend_notif,
#                     "is_tourn_notif": notification.is_tourn_notif,
#                     "is_match_notif": notification.is_match_notif,
#                 },
#             )
#             return Response({'success': {'Notification deleted'}}, status=status.HTTP_200_OK)
#         except Notification.DoesNotExist:
#             return Response({'error': {'Notification does not exist'}}, status=status.HTTP_404_NOT_FOUND)


#GET FRIENDS REQUESTS

class FriendsRequestsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendsSerializer
    
    def get(self, request):
        request_users = Friendship.objects.filter(user_to=request.user, is_accepted=False)
        # print ("*********0   ",request_users)
        serializer = FriendsRequestSerializer(request_users, many=True)
        # print ("*********1   ",serializer.data)
        return Response(serializer.data)
        # user = request.user
        # serializer = self.serializer_class(instance=user)
        # print(serializer.data)
        # return Response(serializer.data)

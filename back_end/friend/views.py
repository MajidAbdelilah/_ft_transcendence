from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets
from .models import Friend
from .serializers import FriendSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.db import IntegrityError
from rest_framework.permissions import IsAuthenticated

class FriendViewSet(viewsets.ViewSet):
    def post(self, request):
        authentication_classes = [JWTAuthentication]
        permission_classes = [IsAuthenticated]
        return 
        
class NotificationViewSet(viewsets.ViewSet):
        authentication_classes = [JWTAuthentication]
        permission_classes = [IsAuthenticated]
        serializer_class = NotificationUserSerializer

    def get(self, request):
        user = request.user
        serializer = self.serializer_class(instance=user)
        return Response(serializer.data)

class NotificationsDetailView(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    

    def delete(self, request, notification_id):
        user = request.user

        notification = Notification.objects.get(id=notification_id)
        if notification.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        notification.delete()
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notification_{user.id}',
            {
                'type': 'notification',
                
            }
        )
        return Response(status=status.HTTP_204_NO_CONTENT)
from rest_framework import serializers
from authapp.models import User
from .models import Friend, notification
from drf_spectacular.utils import extend_schema_field

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'profile_photo']

class NotificationSerializer(serializers.ModelSerializer):
    count = serializers.SerializerMethodField()
    class Meta:
        model = notification
        fields = '__all__'

    @extend_schema_field(serializers.IntegerField)
    def get_count(self, obj): -> int:
        return Notification.objects.filter(user=self.context.get('user')).count()



class NotificationUserSerializer(serializers.ModelSerializer):
    notification = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'notification']
    
    @extend_schema_field(NotificationSerializer)
    def get_notification(self, obj)-> list:
        notifications = Notification.objects.filter(user=obj)
        serializer = NotificationSerializer(notifications, many=True, context={'user': obj})
        return serializer.data
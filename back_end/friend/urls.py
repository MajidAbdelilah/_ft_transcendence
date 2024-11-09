from django.urls import path
from .views import NotificationsView, NotificationDetailView

path('notifications', NotificationsView.as_view(), name="notifications"),
path('notification-delete/<int:notification_id>', NotificationDetailView.as_view(), name='notification-delete'),
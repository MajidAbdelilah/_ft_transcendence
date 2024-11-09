from django.db import models

# Create your models here.

class Friend(models.Model):
    user_from = models.ForeignKey('authapp.User', on_delete=models.CASCADE, related_name='user_from') # This is the field that will be used to determine who the friend request is from and who it is to
    user_to = models.ForeignKey('authapp.User', on_delete=models.CASCADE, related_name='user_to') # This is the field that will be used to determine who the friend request is from and who it is to
    is_accepted = models.BooleanField(default=False) # This is the field that will be used to determine if a friend request has been accepted or not
    blocked_u = models.BooleanField(default=False) # This is the field that will be used to determine if a friend request has been blocked or not
    blocked_f = models.BooleanField(default=False) # This is the field that will be used to determine if a friend request has been blocked or not
    class Meta:
        db_table = "friend"
        unique_together = ("user_from", "user_to") # This is to ensure that a user can only send one friend request to another user


class notification(models.Model):
  id_notif = models.AutoField(primary_key=True)
  user_to = models.ForeignKey('authapp.User', on_delete=models.CASCADE, related_name='user_to') # This is the field that will be used to determine who the friend request is from and who it is to
  message = models.CharField(max_length=200)
  notif_date = models.DateTimeField(auto_now_add=True)
  # image_url = models.CharField(max_length=200)
  is_chat = models.BooleanField(default=False)
  is_match = models.BooleanField(default=False)
  is_friend = models.BooleanField(default=False)
  is_tournament = models.BooleanField(default=False)
  action = models.CharField("")

 class Meta:
        db_table = "Notification"
        ordering= ["-notification_date"] # This is to ensure that a user can only send one friend request to another user
  
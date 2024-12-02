# from django.db import models

# # Create your models here.

# class Friend(models.Model):
#     id_friend = models.AutoField(primary_key=True)
#     user_from = models.ForeignKey('authapp.User', on_delete=models.CASCADE, related_name='user_from') # This is the field that will be used to determine who the friend request is from and who it is to
#     user_to = models.ForeignKey('authapp.User', on_delete=models.CASCADE, related_name='user_to') # This is the field that will be used to determine who the friend request is from and who it is to
#     is_accepted = models.BooleanField(default=False) # This is the field that will be used to determine if a friend request has been accepted or not
#     blocked_u = models.BooleanField(default=False) # This is the field that will be used to determine if a friend request has been blocked or not
#     blocked_f = models.BooleanField(default=False) # This is the field that will be used to determine if a friend request has been blocked or not
#     class Meta:
#         db_table = "friend"
#         unique_together = ("user_from", "user_to") # This is to ensure that a user can only send one friend request to another user


# class notification(models.Model):
#   id_notif = models.AutoField(primary_key=True)
#   user_to = models.ForeignKey('authapp.User', on_delete=models.CASCADE, related_name='user_to') # This is the field that will be used to determine who the friend request is from and who it is to
#   message = models.CharField(max_length=200)
#   notif_date = models.DateTimeField(auto_now_add=True)
#   # image_url = models.CharField(max_length=200)
#   is_chat = models.BooleanField(default=False)
#   is_match = models.BooleanField(default=False)
#   is_friend = models.BooleanField(default=False)
#   is_tournament = models.BooleanField(default=False)
#   action = models.CharField(default="none", max_length=200)
#  title = models.CharField(max_length=200)
#  class Meta:
#         db_table = "Notification"
#         ordering= ["-notification_date"] # This is to ensure that a user can only send one friend request to another user
  
from django.db import models

class Friendship(models.Model):
    freindship_id = models.AutoField(primary_key=True)
    user_from = models.ForeignKey(
        "authapp.User", models.DO_NOTHING, db_column="user_from"
    )
    user_to = models.ForeignKey(
        "authapp.User",
        models.DO_NOTHING,
        db_column="user_to",
        related_name="user_to_set",
    )
    is_accepted = models.BooleanField(default=False)
    u_one_is_blocked_u_two = models.BooleanField(default=False)
    u_two_is_blocked_u_one = models.BooleanField(default=False)
    status = models.CharField(max_length=50, default="pending")

    class Meta:
        db_table = "Friendship"
        unique_together = (("user_from", "user_to"),)


class Notification(models.Model):
    notification_id = models.AutoField(primary_key=True)
    user = models.ForeignKey("authapp.User", models.DO_NOTHING, db_column="user")
    image_url = models.CharField(max_length=200)
    message = models.CharField(max_length=200)
    title = models.CharField(max_length=50)
    link = models.CharField(max_length=200)
    is_chat_notif = models.BooleanField(default=False)
    is_friend_notif = models.BooleanField(default=False)
    is_tourn_notif = models.BooleanField(default=False)
    is_match_notif = models.BooleanField(default=False)
    action_by = models.CharField(default="")
    notification_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "Notification"
        ordering = ["-notification_date"]

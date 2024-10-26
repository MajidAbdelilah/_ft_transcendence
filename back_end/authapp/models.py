from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.base_user import BaseUserManager
    

class UserManager(BaseUserManager):
    def create_user(self, email,username,password, **extra_fields):
        if not id:
            raise ValueError(_("The id must be set "))
        if not email:
            raise ValueError(_("The Email must be set "))
        if not username:
            raise ValueError(_("The username must be set "))
        if not password:
            raise ValueError(_("The password must be set "))
        email = self.normalize_email(email)
        user = self.model (email=email,username=username,**extra_fields)
        user.set_password (password)
        user.save() 
        return (user)
    
  
class User(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    password = models.CharField()
    username = models.CharField(max_length=20, unique=True)
    fullname = models.CharField(max_length=40, blank=True)
    email = models.EmailField(unique=True)
    profile_photo = models.ImageField(default= "profilepng.png")
    is_2fa = models.BooleanField(default=True)
    _2fa_code =  models.CharField(max_length=6, default="")
    first_name = None
    last_name = None
    date_joined = None
    is_superuser = None
    is_staff = None
    last_login=None
    USERNAME_FIELD ='email'
    # EMAIL_FIELD = 'email'
    objects = UserManager()




# class User(AbstractBaseUser):
#     id = models.AutoField(primary_key=True)
#     password = models.CharField()
#     username = models.CharField(max_length=20, unique=True)
#     email = models.EmailField(unique=True)
#     first_name = None
#     last_name = None
#     date_joined = None
#     is_superuser = None
#     is_staff = None
#     last_login=None
#     USERNAME_FIELD ='email'
#     # EMAIL_FIELD = 'email'
#     objects = UserManager()
    
# class Profile(models.Model):
#     id = models.AutoField(primary_key=True)
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     profile_photo = models.ImageField(default= "profilepng.png")
#     _2fa_enabled = models.BooleanField(default=True)
#     _2fa_secret =  models.CharField(max_length=6, default="")
#     last_login =  models.DateTimeField(default=timezone.now)


# class RelationShip(models.Model):
#     id = models.AutoField(primary_key=True)
#     type = models.CharField(max_length=20 , choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('friend','friend'), ('blocked', 'blocked')])
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True, auto_now_add=False)
#     source_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
#     target_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receiver")


# class DirectMessage(models.Model):
#     id = models.AutoField(primary_key=True)
#     message_content = models.CharField( max_length=3000)
#     created_at = models.DateTimeField(auto_now_add=True)
#     receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="Msgreceiver")
#     sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="Msgsender")
    
    
# class GameMatch(models.Model):
#     id = models.AutoField(primary_key=True)
#     first_player = models.ForeignKey(User, on_delete=models.CASCADE, related_name="first_player")
#     second_player = models.ForeignKey(User, on_delete=models.CASCADE, related_name="second_player")
#     winner = models.IntegerField()
#     duration = models.TimeField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     score = models.IntegerField(default=0)

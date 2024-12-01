from django.db import models

class Tournament(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    winner = models.CharField(max_length=100, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

class MatchRoom(models.Model):
    room_identifier = models.CharField(max_length=100, unique=True)  # Add this line
    player1 = models.CharField(max_length=100)
    player2 = models.CharField(max_length=100)
    player1_alias = models.CharField(max_length=100, null=True, blank=True)
    player2_alias = models.CharField(max_length=100, null=True, blank=True)
    score1 = models.IntegerField(default=0)
    score2 = models.IntegerField(default=0)
    winner = models.CharField(max_length=100, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    ball_x = models.FloatField(default=400)
    ball_y = models.FloatField(default=300)
    ball_velocity_x = models.FloatField(default=0)
    ball_velocity_y = models.FloatField(default=0)
    player1_position = models.FloatField(default=0)
    player2_position = models.FloatField(default=0)
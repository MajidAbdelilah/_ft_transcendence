from django.db import models
from django.contrib.auth.models import User

class Match(models.Model):
    player1 = models.CharField(max_length=100)
    player2 = models.CharField(max_length=100)
    player1_alias = models.CharField(max_length=100)
    player2_alias = models.CharField(max_length=100)
    score1 = models.IntegerField()
    score2 = models.IntegerField()
    winner = models.CharField(max_length=100)
    date = models.DateTimeField()

    def __str__(self):
        return f"{self.player1} vs {self.player2}"

class Tournament(models.Model):
    matches = models.ManyToManyField(Match)
    winner = models.CharField(max_length=100)
    date = models.DateTimeField()

    def __str__(self):
        return f"Tournament on {self.date}"

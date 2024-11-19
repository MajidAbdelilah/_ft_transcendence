from django.db import models

class Player(models.Model):
    username = models.CharField(max_length=255, unique=True)
    state = models.CharField(max_length=255)

class Match(models.Model):
    player1 = models.ForeignKey(Player, related_name='player1_matches', on_delete=models.CASCADE)
    player2 = models.ForeignKey(Player, related_name='player2_matches', on_delete=models.CASCADE)
    player1_score = models.IntegerField()
    player2_score = models.IntegerField()
    winner = models.ForeignKey(Player, related_name='won_matches', on_delete=models.CASCADE, null=True)

class Tournament(models.Model):
    matches = models.ManyToManyField(Match)
    winner = models.ForeignKey(Player, related_name='won_tournaments', on_delete=models.CASCADE)
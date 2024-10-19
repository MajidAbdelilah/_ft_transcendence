from django.db import models

class MatchHistory(models.Model):
    player1_username = models.CharField(max_length=100)
    player2_username = models.CharField(max_length=100)
    player1_score = models.IntegerField()
    player2_score = models.IntegerField()
    game_start_time = models.DateTimeField(auto_now_add=True)
    winner = models.CharField(max_length=100, null=True, blank=True)  # New field for the winner

    def __str__(self):
        return f"{self.player1_username} vs {self.player2_username} on {self.game_start_time} - Winner: {self.winner}"
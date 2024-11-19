from django.urls import path
from .views import PlayerListCreate, MatchListCreate, TournamentListCreate

urlpatterns = [
    path('players/', PlayerListCreate.as_view(), name='player-list-create'),
    path('matches_turnement/', MatchListCreate.as_view(), name='match-list-create'),
    path('tournaments/', TournamentListCreate.as_view(), name='tournament-list-create'),
]
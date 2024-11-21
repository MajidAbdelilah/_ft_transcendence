from django.urls import path
from .views import TournamentView

urlpatterns = [
    path('tournament_get/', TournamentView.as_view(), name='get'),
    path('tournaments_post/', TournamentView.as_view(), name='post'),
    path('tournaments/player/<str:username>/', TournamentView.get_tournament_by_player, name='get_tournament_by_player'),

]
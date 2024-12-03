from django.urls import path
from . import views

urlpatterns = [
    path('tournaments/<str:username>/', views.get_tournaments_by_player, name='get_tournaments_by_player'),
    path('matches/<str:username>/', views.get_match_by_player, name='get_match_by_player'),
]
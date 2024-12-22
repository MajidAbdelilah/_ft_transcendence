from django.urls import path
from . import views

urlpatterns = [
    path('available/', views.get_available_tournaments, name='get_available_tournaments'),
    path('tournaments/<str:username>/', views.get_tournaments_by_player, name='get_tournaments_by_player'),
    path('matches/<str:username>/', views.get_match_by_player, name='get_match_by_player'),
    # get the bracket updates fron the redis cache using the spicific room_name
    path('bracket/<str:room_name>/', views.get_bracket, name='get_bracket'),
]
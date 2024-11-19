from rest_framework import generics
from authapp.models import User
from .models import  Match, Tournament
from .serializers import PlayerSerializer, MatchSerializer, TournamentSerializer

class PlayerListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = PlayerSerializer

class MatchListCreate(generics.ListCreateAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer

class TournamentListCreate(generics.ListCreateAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
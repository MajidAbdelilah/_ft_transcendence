from rest_framework import serializers
from authapp.models import User
from .models import  Match, Tournament

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'

class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = '__all__'
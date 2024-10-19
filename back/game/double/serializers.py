# back/game/double/serializers.py
from rest_framework import serializers
from .models import MatchHistory

class MatchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchHistory
        fields = '__all__'
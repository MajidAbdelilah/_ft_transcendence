from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework import generics
from .models import MatchHistory
from .serializers import MatchHistorySerializer

@method_decorator(csrf_exempt, name='dispatch')
class MatchHistoryView(APIView):
    def post(self, request):
        data = request.data
        player1_score = data.get('player1_score')
        player2_score = data.get('player2_score')
        winner = data.get('winner')
        
        if player1_score is None or player2_score is None or winner is None:
            return JsonResponse({'error': 'Missing fields'}, status=400)
        
        # Process the data...
        return JsonResponse({'success': True})

class MatchHistoryByUsernameView(generics.ListAPIView):
    serializer_class = MatchHistorySerializer

    def get_queryset(self):
        username = self.kwargs['username']
        return MatchHistory.objects.filter(player1_username=username) | MatchHistory.objects.filter(player2_username=username)
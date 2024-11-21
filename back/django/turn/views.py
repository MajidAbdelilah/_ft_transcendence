from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from .models import Match, Tournament
import json
from datetime import datetime
from django.utils.decorators import method_decorator
from django.contrib.auth.models import User
from .models import Tournament
from django.utils import timezone

@method_decorator(csrf_exempt, name='dispatch')
class TournamentView(View):
    def post(self, request, *args, **kwargs):
        body = json.loads(request.body)
        matches_data = body.get('matches', [])
        winner_username = body.get('winner')
        
        current_date = timezone.now()  # Use timezone-aware datetime
        tournament = Tournament.objects.create(
            winner=winner_username,
            date=current_date
        )

        for match_data in matches_data:
            print(match_data)
            player1 = match_data['player1']
            player2 = match_data['player2']
            player1_alias = match_data['player1_alias']
            player2_alias = match_data['player2_alias']
            match_winner = match_data['winner']

            match = Match.objects.create(
                player1=player1,
                player2=player2,
                player1_alias=player1_alias,
                player2_alias=player2_alias,
                score1=match_data['score1'],
                score2=match_data['score2'],
                winner=match_winner,
                date=current_date
            )
            tournament.matches.add(match)

        tournament.save()
        return JsonResponse({'id': tournament.id})

    def get(self, request, *args, **kwargs):
        tournament_id = kwargs.get('id')
        tournament = get_object_or_404(Tournament, id=tournament_id)
        matches = tournament.matches.all()
        matches_data = [
            {
                'player1': match.player1,
                'player2': match.player2,
                'player1_alias': match.player1_alias,
                'player2_alias': match.player2_alias,
                'score1': match.score1,
                'score2': match.score2,
                'winner': match.winner,
                'date': match.date
            }
            for match in matches
        ]
        response_data = {
            'id': tournament.id,
            'winner': tournament.winner,
            'date': tournament.date,
            'matches': matches_data
        }
        return JsonResponse(response_data)
    def get_tournament_by_player(request, username):
        tournaments = Tournament.objects.filter(matches__player1=username) | Tournament.objects.filter(matches__player2=username)
        tournament_data = list(tournaments.values())
        matches_data = []
        for tournament in tournaments:
            matches = tournament.matches.all()
            for match in matches:
                if(match.player1 == username or match.player2 == username):
                    match_data = {
                        'player1': match.player1,
                        'player2': match.player2,
                        'player1_alias': match.player1_alias,
                        'player2_alias': match.player2_alias,
                        'score1': match.score1,
                        'score2': match.score2,
                        'winner': match.winner,
                        'date': match.date
                    }
                    matches_data.append(match_data)
        response_data = {
            'tournaments': tournament_data,
            'matches': matches_data
        }
        return JsonResponse(response_data, safe=False)
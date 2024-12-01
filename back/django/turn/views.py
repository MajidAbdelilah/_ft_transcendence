from django.shortcuts import get_object_or_404
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from .models import MatchRoom, Tournament
import json
from django.utils import timezone
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class TournamentView(View):
    def post(self, request, *args, **kwargs):
        try:
            if not request.body:
                return HttpResponseBadRequest(json.dumps({
                    'error': 'Empty request body',
                    'message': 'Request body cannot be empty'
                }), content_type='application/json')

            try:
                body = json.loads(request.body)
            except json.JSONDecodeError:
                return HttpResponseBadRequest(json.dumps({
                    'error': 'Invalid JSON',
                    'message': 'Request body must be valid JSON'
                }), content_type='application/json')

            matches_data = body.get('matches', [])
            winner_username = body.get('winner')

            if not matches_data or not winner_username:
                return HttpResponseBadRequest(json.dumps({
                    'error': 'Missing required fields',
                    'message': 'Both matches and winner are required'
                }), content_type='application/json')

            current_date = timezone.now()
            tournament = Tournament.objects.create(
                winner=winner_username,
                date=current_date
            )

            for match_data in matches_data:
                if not self.create_match(match_data, tournament.id, current_date):
                    return HttpResponseBadRequest(json.dumps({
                        'error': 'Invalid match data',
                        'message': 'Each match must have player1, player2, and winner'
                    }), content_type='application/json')

            return JsonResponse({
                'id': tournament.id, 
                'status': 'success', 
                'message': 'Tournament created successfully'
            })

        except Exception as e:
            return HttpResponseBadRequest(json.dumps({
                'error': 'Server error',
                'message': str(e)
            }), content_type='application/json')

    def create_match(self, match_data, tournament_id, current_date):
        if not all(key in match_data for key in ['player1', 'player2', 'winner']):
            return False

        MatchRoom.objects.create(
            player1=match_data['player1'],
            player2=match_data['player2'],
            player1_alias=match_data.get('player1_alias', ''),
            player2_alias=match_data.get('player2_alias', ''),
            score1=match_data.get('score1', 0),
            score2=match_data.get('score2', 0),
            winner=match_data['winner'],
            date=current_date,
            room_identifier=f"tournament_{tournament_id}_{match_data['player1']}_{match_data['player2']}"
        )
        return True

    def get(self, request, *args, **kwargs):
        tournament_id = kwargs.get('id')
        tournament = get_object_or_404(Tournament, id=tournament_id)
        matches = MatchRoom.objects.filter(date=tournament.date)
        
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
        tournaments = Tournament.objects.filter(
            id__in=MatchRoom.objects.filter(
                player1=username
            ).values_list('date', flat=True)
        ) | Tournament.objects.filter(
            id__in=MatchRoom.objects.filter(
                player2=username
            ).values_list('date', flat=True)
        )

        tournament_data = list(tournaments.values())
        
        matches_data = MatchRoom.objects.filter(
            player1=username
        ) | MatchRoom.objects.filter(
            player2=username
        )

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
            for match in matches_data
        ]

        response_data = {
            'tournaments': tournament_data,
            'matches': matches_data
        }
        return JsonResponse(response_data, safe=False)
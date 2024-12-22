# views.py

from django.shortcuts import render
from django.http import JsonResponse
from .models import Tournament, Match, ActiveTournament
import redis
import json

def get_bracket(request, room_name):
    r = redis.Redis(host='localhost', port=6379, db=0)
    bracket = r.get(room_name)
    if bracket:
        bracket = bracket.decode('utf-8')
        # Convert bracket string to a json data
        json_obkject = json.loads(bracket)
        return JsonResponse(json_obkject, safe=False)
    else:
        return JsonResponse({}, safe=False)


def get_tournaments_by_player(request, username): 
    tournaments = Tournament.objects.all()
    
    data = []
    for tournament in tournaments:
        matches = tournament.matches  # Already a Python dict
        
        # Iterate over match entries only (exclude ball entries)
        for key, match in matches.items():
            if isinstance(match, dict) and ('p1_username' in match or 'p2_username' in match):
                if match.get('p1_username') == username or match.get('p2_username') == username:
                    data.append({
                        'winner': tournament.winner,
                        'date': tournament.date,
                        'matches': matches,
                    })
                    break  # Avoid duplicate entries
    
    return JsonResponse(data, safe=False)


def get_match_by_player(request, username):
    matches = Match.objects.filter(player1_username=username) | Match.objects.filter(player2_username=username)
    matches = matches.distinct()
    
    data = []
    for match in matches:
        data.append({
            'player1_username': match.player1_username,
            'player2_username': match.player2_username,
            'player1_score': match.player1_score,
            'player2_score': match.player2_score,
            'winner': match.winner,
            'date': match.date,
        })
    
    return JsonResponse(data, safe=False)

def get_available_tournaments(request):
    tournaments = ActiveTournament.objects.filter(
        is_tournament=True,
        end_tournament=False,
        num_players__lt=4
    )

    data = []
    for tournament in tournaments:
        players = tournament.players
        player_usernames = [player['username'] for player in players.values() if player.get('full')]
        data.append({
            'room_name': tournament.room_name,
            'num_players': tournament.num_players,
            'players': player_usernames,
        })

    return JsonResponse(data, safe=False)
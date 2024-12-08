from django.shortcuts import render
from django.http import JsonResponse
from .models import Tournament, Match

# filter tournaments by player in the matches json field
def get_tournaments_by_player(request, username):
    tournaments = Tournament.objects.filter(matches__contains=username)
    
    data = []
    for tournament in tournaments:
        data.append({
            'winner': tournament.winner,
            'date': tournament.date,
            'matches': tournament.matches,
        })
    
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
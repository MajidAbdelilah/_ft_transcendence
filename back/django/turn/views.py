from django.shortcuts import render
from django.http import JsonResponse
from .models import Tournament

def get_tournaments_by_player(request, username):
    tournaments = Tournament.objects.filter(matches__player1_username=username) | Tournament.objects.filter(matches__player2_username=username)
    tournaments = tournaments.distinct()
    
    data = []
    for tournament in tournaments:
        matches = tournament.matches.filter(player1_username=username) | tournament.matches.filter(player2_username=username)
        matches = matches.distinct()
        match_data = []
        for match in matches:
            match_data.append({
                'player1_username': match.player1_username,
                'player2_username': match.player2_username,
                'player1_score': match.player1_score,
                'player2_score': match.player2_score,
                'winner': match.winner,
                'date': match.date,
            })
        data.append({
            'winner': tournament.winner,
            'date': tournament.date,
            'matches': match_data,
        })
    
    return JsonResponse(data, safe=False)


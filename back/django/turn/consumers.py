import json
from time import sleep
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
from .models import Match, Tournament  # Import the Match model
from django.utils import timezone
from channels.db import database_sync_to_async

class PingPongConsumer(AsyncWebsocketConsumer):
    room_var = {}

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'pingpong_{self.room_name}'
        self.tournament_room_name = self.scope['url_route']['kwargs'].get('tournament_room_name', None)
        self.tournament_group_name = f'tournament_{self.tournament_room_name}' if self.tournament_room_name else None

        if self.tournament_room_name:
            self.room_name = self.tournament_room_name
            self.room_group_name = f'pingpong_{self.room_name}'

        self.width = 1000
        self.height = 600


        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        if self.tournament_group_name:
            await self.channel_layer.group_add(
                self.tournament_group_name,
                self.channel_name
            )

        await self.accept()


        if self.room_name not in self.room_var and not self.tournament_room_name:
            self.room_var[self.room_name] = {
                'players': {
                    'player1': {'y': self.height/2 - 25, 'height': 100, 'x': 0, 'width': 10, 'direction': None, 'score': 0, 'full': False, 'username': '', 'game_start': False, 'current_match': 'match1'},
                    'player2': {'y': self.height/2 - 25, 'height': 100, 'x': self.width - 10, 'width': 10, 'direction': None, 'score': 0, 'full': False, 'username': '', 'game_start': False, 'current_match': 'match1'},
                },
                'ball': {'x': self.width / 2, 'y': self.height / 2, 'radius': 5, 'vx': 5, 'vy': 5},
                'game_start': True,
                'is_tournament': False
            }
            asyncio.create_task(self.game_loop())
        
        if self.tournament_room_name:
            if self.room_name not in self.room_var:
                self.room_var[self.room_name] = {
                    'players': {
                        'player1': {'y': self.height/2 - 25, 'height': 100, 'x': 0, 'width': 10, 'direction': None, 'score': 0, 'full': False, 'username': '', 'game_start': False, 'current_match': 'match1'},
                        'player2': {'y': self.height/2 - 25, 'height': 100, 'x': self.width - 10, 'width': 10, 'direction': None, 'score': 0, 'full': False, 'username': '', 'game_start': False, 'current_match': 'match1'},
                        'player3': {'y': self.height/2 - 25, 'height': 100, 'x': 0, 'width': 10, 'direction': None, 'score': 0, 'full': False, 'username': '', 'game_start': False, 'current_match': 'match2'},
                        'player4': {'y': self.height/2 - 25, 'height': 100, 'x': self.width - 10, 'width': 10, 'direction': None, 'score': 0, 'full': False, 'username': '', 'game_start': False, 'current_match': 'match2'},
                    },
                    'matches': {
                        'match1': {'player1': None, 'p1_username': None, 'player2': None, 'p2_username': None, 'winner': None, 'game_start': False},
                        'ball1': {'x': self.width / 2, 'y': self.height / 2, 'radius': 5, 'vx': 5, 'vy': 5},
                        'match2': {'player1': None, 'p1_username': None, 'player2': None, 'p2_username': None, 'winner': None, 'game_start': False},
                        'ball2': {'x': self.width / 2, 'y': self.height / 2, 'radius': 5, 'vx': 5, 'vy': 5},
                        'final': {'player1': None, 'p1_username': None, 'player2': None, 'p2_username': None, 'winner': None, 'game_start': False},
                        'ball_final': {'x': self.width / 2, 'y': self.height / 2, 'radius': 5, 'vx': 5, 'vy': 5},
                    },
                'is_tournament': True,
                'end_tournament': False
            }
            asyncio.create_task(self.game_loop())

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        if self.tournament_group_name:
            await self.channel_layer.group_discard(
                self.tournament_group_name,
                self.channel_name
            )

    def assign_player(self, username):
        players = self.room_var[self.room_name]['players']
        print("player: ", username)
        for player_key, player_data in players.items():
            if(player_data['username'] == username):
                return player_key
            match_name = self.room_var[self.room_name]['players'][player_key]['current_match']
            match = self.room_var[self.room_name]['matches'][match_name]
            if not player_data['full']:
                if(player_key == 'player1'):
                    match['player1'] = "player1"
                    match['p1_username'] = username
                elif(player_key == 'player2'):
                    match['player2'] = "player2"
                    match['p2_username'] = username
                elif(player_key == 'player3'):
                    match['player1'] = "player3"
                    match['p1_username'] = username
                elif(player_key == 'player4'):
                    match['player2'] = "player4"
                    match['p2_username'] = username
                player_data['username'] = username
                player_data['full'] = True

                print("player_key: ", player_key)
                print("match: ", match, match_name)
                return player_key
        return None
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        direction = data.get('direction')
        username = data.get('username')
        player = data.get('player')
    
        if not player:
            player = self.assign_player(username)
    
        if player:
            players = self.room_var[self.room_name]['players']
            if direction is not None:
                players[player]['direction'] = direction
    
            if 'gameStarted' in data:
                players[player]['ready'] = data['gameStarted']
    
                # Check if both players in the match are ready
                if self.room_var[self.room_name]['is_tournament']:
                    current_match = players[player]['current_match']
                    match_players = [p for p, pdata in players.items() if pdata['current_match'] == current_match]
                    if all(players[p].get('ready') for p in match_players):
                        self.room_var[self.room_name]['matches'][current_match]['game_start'] = True
            

    async def game_loop(self):
        while True:
            try:
                if self.room_name not in self.room_var:
                    print(f"Room {self.room_name} no longer exists")
                    break
    
                if not self.room_var[self.room_name]['is_tournament']:
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'game_update',
                            'ball': self.room_var[self.room_name]['ball'],
                            'players': self.room_var[self.room_name]['players'],
                            'width': self.width,
                            'height': self.height,
                            'start_game': self.room_var[self.room_name]['game_start'],
                            'is_tournament': self.room_var[self.room_name]['is_tournament']
                        }
                    )
                else:
                    await self.channel_layer.group_send(
                        self.tournament_group_name,
                        {
                            'type': 'game_update',
                            'matches': self.room_var[self.room_name]['matches'],
                            'players': self.room_var[self.room_name]['players'],
                            'width': self.width,
                            'height': self.height,
                            # Do not include 'start_game' here
                            'is_tournament': self.room_var[self.room_name]['is_tournament']
                        }
                    )
    
                # Update game state
                if self.room_var[self.room_name]['is_tournament']:
                    matches = self.room_var[self.room_name]['matches']
                    # Check if all matches have ended
                    if(matches['match1']['winner'] and matches['match2']['winner'] and matches['final']['winner']):
                        await self.disconnect(1000)
                        del self.room_var[self.room_name]
                        break
                    else:
                        await self.update_game_state_tournament()
                else:
                    players = self.room_var[self.room_name]['players']
                    if not players['player1']['game_start'] or not players['player2']['game_start']:
                        await asyncio.sleep(1/60)
                        continue
                    if not self.room_var[self.room_name]['game_start']:
                        await self.disconnect(1000)
                        del self.room_var[self.room_name]
                        break
                    await self.update_game_state()
    
                await asyncio.sleep(1/60)
            except Exception as e:
                print(f"Error in game loop: {e}")
                break

    async def game_update(self, event):
        if self.room_name not in self.room_var:
            return
        if not self.room_var[self.room_name]['is_tournament']:
            await self.send(text_data=json.dumps({
                'ball': event['ball'],
                'players': event['players'],
                'width': event['width'],
                'height': event['height'],
                'start_game': self.room_var[self.room_name]['game_start'],  # Non-tournament mode
                'is_tournament': self.room_var[self.room_name]['is_tournament']
            }))
        else:
            await self.send(text_data=json.dumps({
                'matches': event['matches'],
                'players': event['players'],
                'width': event['width'],
                'height': event['height'],
                # Remove 'start_game' from tournament mode
                'is_tournament':  event['is_tournament']
            }))

    async def update_game_state_tournament(self):
        if self.room_name not in self.room_var:
            return
        ball1 = self.room_var[self.room_name]['matches']['ball1']
        ball2 = self.room_var[self.room_name]['matches']['ball2']
        ball_final = self.room_var[self.room_name]['matches']['ball_final']
        matches = self.room_var[self.room_name]['matches']

        players = self.room_var[self.room_name]['players']
        # Update ball positions if match hase no winner
        if matches['match1']['game_start'] and not matches['match1']['winner']:
            ball1['x'] += ball1['vx']
            ball1['y'] += ball1['vy']
        if matches['match2']['game_start'] and not matches['match2']['winner']:
            ball2['x'] += ball2['vx']
            ball2['y'] += ball2['vy']
        # Start final match when ready
        if matches['match1']['winner'] and matches['match2']['winner']:
            if not matches['final']['game_start']:
                # Check if both finalists are ready
                finalist_players = [p for p, pdata in players.items() if pdata['current_match'] == 'final']
                if all(players[p].get('ready') for p in finalist_players):
                    matches['final']['game_start'] = True

        if matches['final']['game_start'] and matches['match1']['winner'] and matches['match2']['winner'] and not matches['final']['winner']:
            ball_final['x'] += ball_final['vx']
            ball_final['y'] += ball_final['vy']
        # Update player positions
        for player in players:
            if(players[player]['current_match'] == None):
                continue
            if players[player]['direction'] == 'up' and players[player]['y'] > 0:
                players[player]['y'] -= 10
            elif players[player]['direction'] == 'down' and players[player]['y'] < self.height - players[player]['height']:
                players[player]['y'] += 10
        # Ball collision with player paddles
        if (ball1['x'] - ball1['radius'] <= players['player1']['x'] + players['player1']['width'] and
            players['player1']['y'] <= ball1['y'] <= players['player1']['y'] + players['player1']['height']):
            ball1['vx'] *= -1
        elif (ball1['x'] + ball1['radius'] >= players['player2']['x'] and
              players['player2']['y'] <= ball1['y'] <= players['player2']['y'] + players['player2']['height']):
            ball1['vx'] *= -1
        if (ball2['x'] - ball2['radius'] <= players['player3']['x'] + players['player3']['width'] and
            players['player3']['y'] <= ball2['y'] <= players['player3']['y'] + players['player3']['height']):
            ball2['vx'] *= -1
        elif (ball2['x'] + ball2['radius'] >= players['player4']['x'] and
              players['player4']['y'] <= ball2['y'] <= players['player4']['y'] + players['player4']['height']):
            ball2['vx'] *= -1
        if(matches['match1']['winner'] and matches['match2']['winner']):
            if (ball_final['x'] - ball_final['radius'] <= players[matches['final']['player1']]['x'] + players[matches['final']['player1']]['width'] and
                players[matches['final']['player1']]['y'] <= ball_final['y'] <= players[matches['final']['player1']]['y'] + players[matches['final']['player1']]['height']):
                ball_final['vx'] *= -1
            elif (ball_final['x'] + ball_final['radius'] >= players[matches['final']['player2']]['x'] and
                players[matches['final']['player2']]['y'] <= ball_final['y'] <= players[matches['final']['player2']]['y'] + players[matches['final']['player2']]['height']):
                ball_final['vx'] *= -1

        # Check for goals
        if ball1['x'] - ball1['radius'] <= 0:
            await self.update_score('player2')
            self.reset_ball_tournament(ball1)
        elif ball1['x'] + ball1['radius'] >= self.width:
            await self.update_score('player1')
            self.reset_ball_tournament(ball1)
        if ball2['x'] - ball2['radius'] <= 0:
            await self.update_score('player4')
            self.reset_ball_tournament(ball2)
        elif ball2['x'] + ball2['radius'] >= self.width:
            await self.update_score('player3')
            self.reset_ball_tournament(ball2)
        if(matches['match1']['winner'] and matches['match2']['winner']):
            if ball_final['x'] - ball_final['radius'] <= 0:
                await self.update_score(matches['final']['player2'])
                self.reset_ball_tournament(ball_final)
            elif ball_final['x'] + ball_final['radius'] >= self.width:
                await self.update_score(matches['final']['player1'])
                self.reset_ball_tournament(ball_final)
        # Ball collision with top and bottom walls
        if ball1['y'] - ball1['radius'] <= 0 or ball1['y'] + ball1['radius'] >= self.height:
            ball1['vy'] *= -1
        if ball2['y'] - ball2['radius'] <= 0 or ball2['y'] + ball2['radius'] >= self.height:
            ball2['vy'] *= -1
        if ball_final['y'] - ball_final['radius'] <= 0 or ball_final['y'] + ball_final['radius'] >= self.height:
            ball_final['vy'] *= -1

    async def update_game_state(self):
        if self.room_name not in self.room_var:
            return
        ball = self.room_var[self.room_name]['ball']
        players = self.room_var[self.room_name]['players']
        ball['x'] += ball['vx']
        ball['y'] += ball['vy']
        # Update player positions
        for player in players:
            if players[player]['direction'] == 'up' and players[player]['y'] > 0:
                players[player]['y'] -= 10
            elif players[player]['direction'] == 'down' and players[player]['y'] < self.height - players[player]['height']:
                players[player]['y'] += 10
        # Ball collision with player paddles
        if (ball['x'] - ball['radius'] <= players['player1']['x'] + players['player1']['width'] and
            players['player1']['y'] <= ball['y'] <= players['player1']['y'] + players['player1']['height']):
            ball['vx'] *= -1
        elif (ball['x'] + ball['radius'] >= players['player2']['x'] and
              players['player2']['y'] <= ball['y'] <= players['player2']['y'] + players['player2']['height']):
            ball['vx'] *= -1
        # Check for goals
        if ball['x'] - ball['radius'] <= 0:
            if(self.room_var[self.room_name]['is_tournament']):
                await self.update_score('player2')
            else:
                self.room_var[self.room_name]['players']['player2']['score'] += 1
            self.reset_ball()
        elif ball['x'] + ball['radius'] >= self.width:
            if(self.room_var[self.room_name]['is_tournament']):
                await self.update_score('player1')
            else:
                self.room_var[self.room_name]['players']['player1']['score'] += 1
            self.reset_ball()
        # Ball collision with top and bottom walls
        if ball['y'] - ball['radius'] <= 0 or ball['y'] + ball['radius'] >= self.height:
            ball['vy'] *= -1
        # # Check for winning condition
        if(not self.room_var[self.room_name]['is_tournament']):
            if players['player1']['score'] >= 5:
                asyncio.create_task(self.save_game_data('player1'))
            elif players['player2']['score'] >= 5:
                asyncio.create_task(self.save_game_data('player2'))

    async def update_score(self, player):
        print(player)
        self.room_var[self.room_name]['players'][player]['score'] += 1
        print(self.room_var[self.room_name]['players'][player]['score'])
        if self.room_var[self.room_name]['players'][player]['score'] >= 10:  # Assuming 10 points to win
            await self.end_match(player)

    def end_tournament(self, winner):
        self.room_var[self.room_name]['players']['player1']['score'] = 0
        self.room_var[self.room_name]['players']['player2']['score'] = 0
        self.room_var[self.room_name]['players']['player3']['score'] = 0
        self.room_var[self.room_name]['players']['player4']['score'] = 0
        self.room_var[self.room_name]['players']['player1']['full'] = False
        self.room_var[self.room_name]['players']['player2']['full'] = False
        self.room_var[self.room_name]['players']['player3']['full'] = False
        self.room_var[self.room_name]['players']['player4']['full'] = False
        self.room_var[self.room_name]['game_start'] = False
        self.room_var[self.room_name]['end_tournement'] = True
        print("Tournament ended")
        


    async def end_match(self, winner):
        current_match = self.room_var[self.room_name]['players'][winner]['current_match']
        print("current_match: ", current_match)
        self.room_var[self.room_name]['matches'][current_match]['winner'] = winner
        if current_match == 'match1':
            self.room_var[self.room_name]['players']['player1']['current_match'] = 'match2'
            self.room_var[self.room_name]['players']['player2']['current_match'] = 'match2'
            self.room_var[self.room_name]['matches']['ball1'] = {'x': self.width / 2, 'y': self.height / 2, 'radius': 5, 'vx': 5, 'vy': 5}
        elif current_match == 'match2':
            self.room_var[self.room_name]['players']['player3']['current_match'] = 'final'
            self.room_var[self.room_name]['players']['player4']['current_match'] = 'final'
            self.room_var[self.room_name]['matches']['ball2'] = {'x': self.width / 2, 'y': self.height / 2, 'radius': 5, 'vx': 5, 'vy': 5}
        elif current_match == 'final':
            self.room_var[self.room_name]['matches']['final']['winner'] = winner
        
        match = self.room_var[self.room_name]['matches'][current_match];
        print(match, current_match, winner)
        await self.save_match_data(match['player1'], 
        self.room_var[self.room_name]['players'][match['player1']]['score'], 
        match['player2'], 
        self.room_var[self.room_name]['players'][match['player2']]['score'],
         winner)
        # Save the tournament data if final match is completed
        if self.room_var[self.room_name]['matches']['final']['winner']:
            tournament = Tournament(
                winner=self.room_var[self.room_name]['matches']['final']['winner'],
                date=timezone.now(),
                matches=self.room_var[self.room_name]['matches']  # Include matches data
            )
            await database_sync_to_async(tournament.save)()
            self.end_tournament(winner)

        # Reset the game state
        if self.room_var[self.room_name]['matches']['match1']['winner'] and self.room_var[self.room_name]['matches']['match2']['winner']:
            self.room_var[self.room_name]['matches']['final']['player1'] = self.room_var[self.room_name]['matches']['match1']['winner']
            self.room_var[self.room_name]['matches']['final']['player2'] = self.room_var[self.room_name]['matches']['match2']['winner']
            await self.start_final_match()
        # else:
        #     self.room_var[self.room_name]['game_start'] = False



  
    async def save_match_data(self, player1, score1, player2, score2, winner):
        match = Match(
            player1_username=player1,
            player2_username=player2,
            player1_score=score1,
            player2_score=score2,
            winner=winner,
            date=timezone.now()
        )
        await database_sync_to_async(match.save)()

    async def start_final_match(self):
        self.room_var[self.room_name]['matches']['final']['player1'] = self.room_var[self.room_name]['matches']['match1']['winner']
        self.room_var[self.room_name]['matches']['final']['player2'] = self.room_var[self.room_name]['matches']['match2']['winner']
        self.room_var[self.room_name]['matches']['final']['p1_username'] = self.room_var[self.room_name]['players'][self.room_var[self.room_name]['matches']['final']['player1']]['username']
        self.room_var[self.room_name]['matches']['final']['p2_username'] = self.room_var[self.room_name]['players'][self.room_var[self.room_name]['matches']['final']['player2']]['username']
        self.room_var[self.room_name]['matches']['final']['winner'] = None
        self.room_var[self.room_name]['matches']['ball_final'] = {'x': self.width / 2, 'y': self.height / 2, 'radius': 5, 'vx': 5, 'vy': 5}
        # reset the scores of the players
        self.room_var[self.room_name]['players']['player1']['score'] = 0
        self.room_var[self.room_name]['players']['player2']['score'] = 0
        self.room_var[self.room_name]['players']['player3']['score'] = 0
        self.room_var[self.room_name]['players']['player4']['score'] = 0
        # reset players positions
        self.room_var[self.room_name]['players'][self.room_var[self.room_name]['matches']['final']['player1']]['x'] = 0
        self.room_var[self.room_name]['players'][self.room_var[self.room_name]['matches']['final']['player1']]['y'] = self.height/2 - 25
        self.room_var[self.room_name]['players'][self.room_var[self.room_name]['matches']['final']['player2']]['x'] = self.width - 10
        self.room_var[self.room_name]['players'][self.room_var[self.room_name]['matches']['final']['player2']]['y'] = self.height/2 - 25
        

        if(self.room_var[self.room_name]['matches']['match1']['winner'] == 'player1'):
            self.room_var[self.room_name]['players']['player2']['match'] = None
        elif(self.room_var[self.room_name]['matches']['match1']['winner'] == 'player2'):
            self.room_var[self.room_name]['players']['player1']['match'] = None
        if(self.room_var[self.room_name]['matches']['match2']['winner'] == 'player3'):
            self.room_var[self.room_name]['players']['player4']['match'] = None
        elif(self.room_var[self.room_name]['matches']['match2']['winner'] == 'player4'):
            self.room_var[self.room_name]['players']['player3']['match'] = None
        
        # set winners match final
        self.room_var[self.room_name]['players'][self.room_var[self.room_name]['matches']['final']['player1']]['current_match'] = 'final'
        self.room_var[self.room_name]['players'][self.room_var[self.room_name]['matches']['final']['player2']]['current_match'] = 'final'
        
        self.room_var[self.room_name]['game_start'] = True


    def reset_ball_tournament(self, ball):
        ball['x'] = self.width / 2
        ball['y'] = self.height / 2
        ball['vx'] *= -1

    def reset_ball(self):
        ball = self.room_var[self.room_name]['ball']
        ball['x'] = self.width / 2
        ball['y'] = self.height / 2
        ball['vx'] *= -1

    @database_sync_to_async
    def save_game_data(self, winner):
        players = self.room_var[self.room_name]['players']
        player1_score = players['player1']['score']
        player2_score = players['player2']['score']
        player1_username = players['player1']['username']
        player2_username = players['player2']['username']
        # Save the game data to the database
        match = Match(
            player1_username=player1_username,
            player2_username=player2_username,
            player1_score=player1_score,
            player2_score=player2_score,
            winner=winner,
            date=timezone.now()
        )
        match.save()
        # Save the tournament data if final match
        if self.room_var[self.room_name]['matches']['final']['winner']:
            tournament = Tournament(
                player1_username=self.room_var[self.room_name]['matches']['final']['player1'],
                player2_username=self.room_var[self.room_name]['matches']['final']['player2'],
                winner=self.room_var[self.room_name]['matches']['final']['winner'],
                date=timezone.now(),
                matches=self.room_var[self.room_name]['matches']  # Include matches data
            )
            tournament.save()
        # Reset the game state
        players['player1']['score'] = 0
        players['player2']['score'] = 0
        self.reset_ball()
        self.room_var[self.room_name]['game_start'] = False
            # disconnect the players
        
import json
from time import sleep
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
from .models import Match  # Import the Match model
from django.utils import timezone
from channels.db import database_sync_to_async

class PingPongConsumer(AsyncWebsocketConsumer):
    room_var = {}

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'pingpong_{self.room_name}'
        self.tournament_room_name = self.scope['url_route']['kwargs'].get('tournament_room_name', None)
        self.tournament_group_name = f'tournament_{self.tournament_room_name}' if self.tournament_room_name else None

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

        if self.room_name not in self.room_var:
            self.room_var[self.room_name] = {
                'players': {
                    'player1': {'y': self.height/2 - 25, 'height': 100, 'x': 0, 'width': 10, 'direction': None, 'score': 0, 'full': False, 'username': '', 'game_start': False},
                    'player2': {'y': self.height/2 - 25, 'height': 100, 'x': self.width - 10, 'width': 10, 'direction': None, 'score': 0, 'full': False, 'username': '', 'game_start': False}
                },
                'ball': {'x': self.width / 2, 'y': self.height / 2, 'radius': 5, 'vx': 5, 'vy': 5},
                'game_start': True
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
        for player_key, player_data in players.items():
            if(player_data['username'] == username):
                return player_key
            if not player_data['full']:
                player_data['username'] = username
                player_data['full'] = True
                return player_key
        return None

    async def receive(self, text_data):
        data = json.loads(text_data)
        direction = data['direction']
        username = data.get('username', None)
        player = data['player']
        if(not player):
            player = self.assign_player(username)
        if player:
            self.room_var[self.room_name]['players'][player]['direction'] = direction
            self.room_var[self.room_name]['players'][player]['game_start'] = data.get('gameStarted')
            # print(data.get('gameStarted'))
            # print(self.room_var[self.room_name]['players'][player]['game_start'])
            

    async def game_loop(self):
        while True:
            if self.room_name not in self.room_var:
                break
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_update',
                    'ball': self.room_var[self.room_name]['ball'],
                    'players': self.room_var[self.room_name]['players'],
                    'width': self.width,
                    'height': self.height,
                    'start_game': self.room_var[self.room_name]['game_start']
                }
            )
            if(not self.room_var[self.room_name]['players']['player1']['game_start'] or not self.room_var[self.room_name]['players']['player2']['game_start']):
                await asyncio.sleep(1/60)
                continue
            self.update_game_state()
            if not self.room_var[self.room_name]['game_start']:
                self.disconnect(1000)
                del self.room_var[self.room_name]
                break
            await asyncio.sleep(1/60)

    async def game_update(self, event):
        if self.room_name not in self.room_var:
            return
        await self.send(text_data=json.dumps({
            'ball': event['ball'],
            'players': event['players'],
            'width': event['width'],
            'height': event['height'],
            'start_game': self.room_var[self.room_name]['game_start']
        }))

    def update_game_state(self):
        if self.room_name not in self.room_var:
            return
        ball = self.room_var[self.room_name]['ball']
        players = self.room_var[self.room_name]['players']
        ball['x'] += ball['vx']
        ball['y'] += ball['vy']
        # Ball collision with top and bottom walls
        if ball['y'] - ball['radius'] <= 0 or ball['y'] + ball['radius'] >= self.height:
            ball['vy'] *= -1
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
            players['player2']['score'] += 1
            self.reset_ball()
        elif ball['x'] + ball['radius'] >= self.width:
            players['player1']['score'] += 1
            self.reset_ball()
        # Check for winning condition
        if players['player1']['score'] >= 5:
            asyncio.create_task(self.save_game_data('player1'))
        elif players['player2']['score'] >= 5:
            asyncio.create_task(self.save_game_data('player2'))
            


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
        player1_username = players['player1']['username'] # Replace with actual player 1 username
        player2_username = players['player2']['username']  # Replace with actual player 2 username
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
        # Reset the game state
        players['player1']['score'] = 0
        players['player2']['score'] = 0
        self.reset_ball()
        self.room_var[self.room_name]['game_start'] = False
        # disconnect the players
        
import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio

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
                    'player1': {'y': self.height/2 - 25, 'height': 100, 'x': 0, 'width': 10, 'direction': None, 'score': 0, 'full': False},
                    'player2': {'y': self.height/2 - 25, 'height': 100, 'x': self.width - 10, 'width': 10, 'direction': None, 'score': 0, 'full': False}
                },
                'ball': {'x': self.width / 2, 'y': self.height / 2, 'radius': 5, 'vx': 5, 'vy': 5}
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

    async def receive(self, text_data):
        data = json.loads(text_data)
        player = data['player']
        direction = data['direction']

        if player in self.room_var[self.room_name]['players']:
            self.room_var[self.room_name]['players'][player]['full'] = True
            self.room_var[self.room_name]['players'][player]['direction'] = direction

    async def game_loop(self):
        while True:
            self.update_game_state()
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_update',
                    'ball': self.room_var[self.room_name]['ball'],
                    'players': self.room_var[self.room_name]['players'],
                    'width': self.width,
                    'height': self.height
                }
            )
            await asyncio.sleep(1/60)

    def update_game_state(self):
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

    def reset_ball(self):
        ball = self.room_var[self.room_name]['ball']
        ball.update({'x': self.width / 2, 'y': self.height / 2, 'radius': 5, 'vx': ball['vx'] * -1, 'vy': 5})

    async def game_update(self, event):
        await self.send(text_data=json.dumps({
            'ball': event['ball'],
            'players': event['players'],
            'width': event['width'],
            'height': event['height']
        }))
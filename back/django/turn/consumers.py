import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio

class PingPongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'pingpong_{self.room_name}'
        self.width = 100
        self.height = 100
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        self.players = {
            'player1': {'y': 50, 'h', 'x' : 10, 'width' : 10, 'direction': None},
            'player2': {'y': 50, 'direction': None}
        }
        self.ball = {'x': 50, 'y': 50, 'vx': 1, 'vy': 1}

        asyncio.create_task(self.game_loop())

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        player = data['player']
        direction = data['direction']

        if player in self.players:
            self.players[player]['direction'] = direction

    async def game_loop(self):
        while True:
            self.update_game_state()
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_update',
                    'ball': self.ball,
                    'players': self.players,
                    'width': self.width,
                    'height': self.height
                }
            )
            await asyncio.sleep(1/60)

    def update_game_state(self):
        self.ball['x'] += self.ball['vx']
        self.ball['y'] += self.ball['vy']

        # Ball collision with top and bottom walls
        if self.ball['y'] <= 0 or self.ball['y'] >= self.height:
            self.ball['vy'] *= -1

        # Update player positions
        for player in self.players:
            if self.players[player]['direction'] == 'up' and self.players[player]['y'] > 0:
                self.players[player]['y'] -= 1
            elif self.players[player]['direction'] == 'down' and self.players[player]['y'] < self.height:
                self.players[player]['y'] += 1

        # Ball collision with player paddles
        if self.ball['x'] <= 0 and self.players['player1']['y'] - 10 <= self.ball['y'] <= self.players['player1']['y'] + 10:
            self.ball['vx'] *= -1
        elif self.ball['x'] >= self.width and self.players['player2']['y'] - 10 <= self.ball['y'] <= self.players['player2']['y'] + 10:
            self.ball['vx'] *= -1

    async def game_update(self, event):
        await self.send(text_data=json.dumps({
            'ball': event['ball'],
            'players': event['players'],
            'width': event['width'],
            'height': event['height']
        }))
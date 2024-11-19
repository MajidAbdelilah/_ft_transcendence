import json
from channels.generic.websocket import AsyncWebsocketConsumer
from authapp.models import User
from .models import  Match, Tournament
import json

class TournamentConsumer(AsyncWebsocketConsumer):
    MAX_PLAYERS = 10  # Maximum number of players in a tournament

    room_name = 'tournament'
    room_group_name = 'tournament_group'
    players = {}  # Dictionary to store player states
    matches = {}  # Dictionary to store match states
    waiting_players = []  # List to store players waiting to be matched
    round_winners = []  # List to store winners of each round

    async def broadcast_game_state(self):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game_update',
                'message': [self.players, self.matches, self.waiting_players, self.round_winners, self.room_name, self.room_group_name, self.channel_name, self.MAX_PLAYERS, self.round_winners, self.players]
            }
        )

    async def connect(self):
        

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        username = data.get('username')
        # print (data)
        print(data)
        if message_type == 'join':
            if len(self.players) < self.MAX_PLAYERS:
                self.players[username] = {'state': 'joined'}
                print(len(self.players))
                self.waiting_players.append(username)
                await self.try_to_create_match()
                await self.broadcast_game_state()

                if len(self.players) == self.MAX_PLAYERS:
                    await self.start_tournament()
            else:
                await self.send(text_data=json.dumps({
                    'error': 'Tournament is full'
                }))
        elif message_type == 'leave':
            if username in self.players:
                del self.players[username]
            if username in self.waiting_players:
                self.waiting_players.remove(username)
            await self.broadcast_game_state()
        elif message_type == 'action':
            # Handle game actions here
            action = data.get('action')
            if username in self.players:
                self.players[username]['action'] = action
            await self.broadcast_game_state()
        elif message_type == 'match_winner':
            match_id = data.get('match_id')
            winner = data.get('winner')
            self.matches[match_id]['winner'] = winner
            if winner == self.matches[match_id]['player1']:
                self.matches[match_id]['player1_score'] += 1
            else:
                self.matches[match_id]['player2_score'] += 1
            await self.handle_match_winner(match_id, winner)
        

    async def try_to_create_match(self):
        if len(self.waiting_players) >= 2:
            player1 = self.waiting_players.pop(0)
            player2 = self.waiting_players.pop(0)
            match_id = f"{player1}_vs_{player2}"
            self.matches[match_id] = {
                'player1': player1,
                'player2': player2,
                'player1_score': 0,
                'player2_score': 0,
                'winner': None
            }
            await self.broadcast_match_state(match_id)
        print("Match created", len(self.waiting_players))

    async def broadcast_match_state(self, match_id):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'match_update',
                'message': self.matches[match_id]
            }
        )

    async def game_update(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def match_update(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def start_tournament(self):
        # Logic to start the tournament
        await self.send(text_data=json.dumps({
            'message': 'Tournament has started!'
        }))

    async def handle_match_winner(self, match_id, winner):
        self.round_winners.append(winner)
        if len(self.round_winners) == 2:
            await self.create_second_round_matches()
        elif len(self.round_winners) == 4:
            await self.create_final_match()

    async def create_second_round_matches(self):
        self.waiting_players = self.round_winners
        self.round_winners = []
        while len(self.waiting_players) >= 2:
            await self.try_to_create_match()

    async def create_final_match(self):
        if len(self.round_winners) == 2:
            player1 = self.round_winners.pop(0)
            player2 = self.round_winners.pop(0)
            match_id = f"final_{player1}_vs_{player2}"
            self.matches[match_id] = {
                'player1': player1,
                'player2': player2,
                'player1_score': 0,
                'player2_score': 0,
                'winner': None
            }
            await self.broadcast_match_state(match_id)
            await self.send(text_data=json.dumps({
                'message': 'Final match has started!'
            }))
            await self.save_tournament_data()

    async def save_tournament_data(self):
        # Save users
        user_objects = {}
        for username, data in self.players.items():
            user, created = Player.objects.get_or_create(username=username, defaults={'state': data['state']})
            user_objects[username] = user

        # Save matches
        match_objects = []
        for match_id, match_data in self.matches.items():
            match = Match.objects.create(
                player1=user_objects[match_data['player1']],
                player2=user_objects[match_data['player2']],
                player1_score=match_data['player1_score'],
                player2_score=match_data['player2_score'],
                winner=user_objects.get(match_data['winner'])
            )
            match_objects.append(match)

        # Save tournament
        tournament = Tournament.objects.create(winner=user_objects[self.round_winners[0]])
        tournament.matches.set(match_objects)
        tournament.save()
    
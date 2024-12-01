import json
import random
import asyncio
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import MatchRoom

logger = logging.getLogger(__name__)

class PingPongGameConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for managing ping pong game logic
    """
    
    # Game Constants
    COURT_WIDTH = 800
    COURT_HEIGHT = 600
    PADDLE_WIDTH = 20
    PADDLE_HEIGHT = 100
    BALL_RADIUS = 10
    
    async def connect(self):
        """
        Handle new WebSocket connection
        """
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'game_{self.room_id}'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Attempt to register player
        try:
            registration_result = await self.register_player()
            if registration_result is False:
                # If registration failed (room is full), close the connection
                await self.close()
        except Exception as e:
            logger.error(f"Player registration error: {e}")
            await self.close()
    
    @database_sync_to_async
    def register_player(self):
        """
        Register player in the match room
        """
        # Extract username from WebSocket scope
        username = self.scope['user'].username if hasattr(self.scope['user'], 'username') else 'anonymous'
        
        # Find or create match room
        try:
            match_room = MatchRoom.objects.get(room_identifier=self.room_id)
            
            # If room already exists and is not full, add second player
            if not match_room.player2 and match_room.player1 != username:
                match_room.player2 = username
                match_room.save()
            elif match_room.player1 == username or match_room.player2 == username:
                # Player is already in the room
                return True
            else:
                # Room is full
                return False
        except MatchRoom.DoesNotExist:
            # Create a new match room if it doesn't exist
            MatchRoom.objects.create(
                room_identifier=self.room_id,
                player1=username,
                player2=''
            )
        
        return True
    
    async def start_game(self):
        """
        Initialize game state and start game loop
        """
        await self.reset_ball()
        await self.game_loop()
    
    async def game_loop(self):
        """
        Main game physics and update loop
        """
        while True:
            await self.update_ball_physics()
            await asyncio.sleep(0.05)  # 20 FPS
    
    async def update_ball_physics(self):
        """
        Calculate advanced ball physics with realistic bouncing
        """
        match_room = await self.get_match_room()
        
        # Initialize game state fields if they don't exist
        if not hasattr(match_room, 'ball_x'):
            match_room.ball_x = self.COURT_WIDTH // 2
            match_room.ball_y = self.COURT_HEIGHT // 2
            match_room.ball_velocity_x = random.choice([-5, 5])
            match_room.ball_velocity_y = random.choice([-5, 5])
            match_room.player1_position = 0
            match_room.player2_position = 0
            match_room.score1 = 0
            match_room.score2 = 0
        
        # Update ball position
        match_room.ball_x += match_room.ball_velocity_x
        match_room.ball_y += match_room.ball_velocity_y
        
        # Wall collision detection (vertical)
        if (match_room.ball_y <= 0 or 
            match_room.ball_y >= self.COURT_HEIGHT):
            match_room.ball_velocity_y *= -1
        
        # Paddle collision detection
        if (match_room.ball_x <= self.PADDLE_WIDTH and 
            match_room.player1_position <= match_room.ball_y <= 
            match_room.player1_position + self.PADDLE_HEIGHT):
            match_room.ball_velocity_x = abs(match_room.ball_velocity_x)
            
        if (match_room.ball_x >= self.COURT_WIDTH - self.PADDLE_WIDTH and 
            match_room.player2_position <= match_room.ball_y <= 
            match_room.player2_position + self.PADDLE_HEIGHT):
            match_room.ball_velocity_x = -abs(match_room.ball_velocity_x)
        
        # Scoring logic
        if match_room.ball_x < 0:
            match_room.score2 += 1
            await self.reset_ball()
        
        if match_room.ball_x > self.COURT_WIDTH:
            match_room.score1 += 1
            await self.reset_ball()
        
        await self.save_match_room(match_room)
        
        # Broadcast game state
        asyncio.create_task(self.broadcast_game_state())
    
    @database_sync_to_async
    def get_match_room(self):
        """
        Retrieve match room from database
        """
        return MatchRoom.objects.get(room_identifier=self.room_id)
    
    @database_sync_to_async
    def save_match_room(self, match_room):
        """
        Save match room to database
        """
        match_room.save()
    
    @database_sync_to_async
    def reset_ball(self):
        """
        Reset ball to center with randomized velocity
        """
        match_room = MatchRoom.objects.get(room_identifier=self.room_id)
        match_room.ball_x = self.COURT_WIDTH // 2
        match_room.ball_y = self.COURT_HEIGHT // 2
        match_room.ball_velocity_x = random.choice([-5, 5])
        match_room.ball_velocity_y = random.choice([-5, 5])
        match_room.save()
    
    async def broadcast_game_state(self):
        """
        Broadcast current game state to all players in room
        """
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game_state',
                'game_state': await self.get_game_state()
            }
        )
    
    @database_sync_to_async
    def get_game_state(self):
        """
        Retrieve current game state from database
        """
        match_room = MatchRoom.objects.get(room_identifier=self.room_id)
        return {
            'ball_x': match_room.ball_x,
            'ball_y': match_room.ball_y,
            'player1_position': match_room.player1_position,
            'player2_position': match_room.player2_position,
            'player1_score': match_room.score1,
            'player2_score': match_room.score2,
            'player1': match_room.player1,
            'player2': match_room.player2
        }
    
    async def receive(self, text_data):
        """
        Handle incoming WebSocket messages
        """
        data = json.loads(text_data)
        action = data.get('action')
        
        if action == 'move_paddle':
            await self.update_paddle_position(data)
    
    @database_sync_to_async
    def update_paddle_position(self, data):
        """
        Update player paddle position
        """
        username = self.scope['user'].username if hasattr(self.scope['user'], 'username') else 'anonymous'
        match_room = MatchRoom.objects.get(room_identifier=self.room_id)
        
        # Determine which player's paddle to move
        if username == match_room.player1:
            match_room.player1_position = data['position']
        elif username == match_room.player2:
            match_room.player2_position = data['position']
        
        match_room.save()
    
    async def disconnect(self, close_code):
        """
        Handle player disconnection
        """
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
        # Optional: Mark match as abandoned or handle player exit
        await self.mark_player_disconnected()
    
    @database_sync_to_async
    def mark_player_disconnected(self):
        """
        Update match room status on player disconnect
        """
        try:
            match_room = MatchRoom.objects.get(room_identifier=self.room_id)
            username = self.scope['user'].username if hasattr(self.scope['user'], 'username') else 'anonymous'
            
            # Remove the disconnected player
            if match_room.player1 == username:
                match_room.player1 = ''
            elif match_room.player2 == username:
                match_room.player2 = ''
            
            # If both players are gone, you might want to delete or mark the room
            if not match_room.player1 and not match_room.player2:
                match_room.delete()
            else:
                match_room.save()
        except MatchRoom.DoesNotExist:
            logger.error(f"MatchRoom with identifier {self.room_id} not found.")

    # Additional method for handling game state updates
    async def game_state(self, event):
        """
        Send game state to WebSocket
        """
        game_state = event['game_state']
        await self.send(text_data=json.dumps(game_state))
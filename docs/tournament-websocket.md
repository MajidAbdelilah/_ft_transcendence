# Tournament WebSocket Protocol Documentation

## WebSocket Endpoint
```
ws://10.11.6.4:8001/ws/tournament/tour/PLAY/
```

## Message Protocol

### 1. Join Tournament Request
When a player wants to join a tournament, the frontend sends:

```javascript
{
  "type": "join_tournament",
  "data": {
    "userId": number,      // Player's unique identifier
    "username": string,    // Player's username
    "mapType": string     // Type of map for the tournament
  }
}
```

### 2. Join Tournament Response
The backend should respond with one of these messages:

Success Response:
```javascript
{
  "type": "join_tournament_response",
  "success": true,
  "tournamentId": string,    // Unique identifier for the tournament
  "message": string         // Optional success message
}
```

Error Response:
```javascript
{
  "type": "join_tournament_response",
  "success": false,
  "error": string          // Error message explaining what went wrong
}
```

### 3. Tournament Updates
The backend should send tournament updates in this format:

```javascript
{
  "matches": Array,         // Array of match information
  "players": Array,         // Array of players in the tournament
  "width": number,         // Width of the tournament bracket
  "height": number,        // Height of the tournament bracket
  "is_tournament": boolean // Should be true for tournament updates
}
```

### 4. Game Start Notification
When a game is ready to start, the backend should send:

```javascript
{
  "type": "game_start",
  "gameId": string        // Unique identifier for the game session
}
```

## Implementation Requirements

### Backend Requirements
1. Must validate the join tournament request data
2. Should send immediate acknowledgment of join request
3. Must maintain tournament state and broadcast updates
4. Should handle disconnections gracefully

### Error Scenarios
Backend should handle and respond appropriately to:
1. Invalid user data
2. Tournament full/closed
3. Player already in tournament
4. Invalid map type
5. Server errors

### Example Error Responses
```javascript
// Tournament full
{
  "type": "join_tournament_response",
  "success": false,
  "error": "Tournament is already full"
}

// Invalid map type
{
  "type": "join_tournament_response",
  "success": false,
  "error": "Invalid map type specified"
}

// Player already in tournament
{
  "type": "join_tournament_response",
  "success": false,
  "error": "Player already in active tournament"
}
```

## Connection Lifecycle

1. **Initial Connection**
   - Frontend establishes WebSocket connection
   - Backend acknowledges connection

2. **Join Tournament**
   - Frontend sends join request
   - Backend validates and responds
   - If successful, adds player to tournament

3. **Tournament Updates**
   - Backend broadcasts tournament state changes
   - All connected clients receive updates

4. **Game Start**
   - Backend determines match pairing
   - Sends game start notification to relevant players

5. **Disconnection**
   - Frontend sends close frame
   - Backend cleans up player resources

## Testing Requirements

Backend should be tested for:
1. Correct message format handling
2. Proper error responses
3. Tournament state management
4. Concurrent player connections
5. Disconnection handling

## Rate Limiting
Consider implementing:
- Max connections per IP
- Join request rate limits
- Message frequency limits

## WebSocket Utility Functions

### setupBracketListener
Sets up a listener for all tournament-related WebSocket messages.

```typescript
function setupBracketListener(
  tournamentId: string, 
  onUpdate: (data: any) => void
): () => void
```

#### Parameters
- `tournamentId`: Unique identifier for the tournament
- `onUpdate`: Callback function that will be called with parsed message data for any tournament update

#### Returns
- Cleanup function that removes the event listener when called

#### Example Usage
```javascript
const cleanup = gameService.setupBracketListener(
  'tournament123',
  (data) => {
    // Handle any tournament update
    console.log('Tournament update:', data);
    updateBracketUI(data);
  }
);

// When component unmounts or listener is no longer needed
cleanup();
```

### getWebSocket
Returns the current WebSocket instance.

```typescript
function getWebSocket(): WebSocket | null
```

#### Returns
- Active WebSocket instance or null if no connection exists

#### Example Usage
```javascript
const ws = gameService.getWebSocket();
if (ws && ws.readyState === WebSocket.OPEN) {
  // WebSocket is available and connected
}
```

### disconnect
Closes the current WebSocket connection and cleans up resources.

```typescript
function disconnect(): void
```

#### Behavior
1. Checks if WebSocket instance exists
2. Closes the connection if it exists
3. Sets the WebSocket instance to null
4. Frees up resources

#### Example Usage
```javascript
// When leaving tournament page or cleaning up application
gameService.disconnect();
```

## Best Practices for Utility Functions

### Event Listener Management
```javascript
// In React component
useEffect(() => {
  const cleanup = gameService.setupBracketListener(tournamentId, handleUpdate);
  return cleanup;
}, [tournamentId]);
```

### Connection Management
```javascript
// Check connection before operations
const ws = gameService.getWebSocket();
if (!ws || ws.readyState !== WebSocket.OPEN) {
  console.error('No active connection');
  return;
}

// Clean up on component unmount
useEffect(() => {
  return () => {
    gameService.disconnect();
  };
}, []);
```

### Implementation Notes
1. All tournament messages trigger onUpdate callback without filtering
2. Event listeners are properly cleaned up to prevent memory leaks
3. WebSocket connections are properly closed when disconnecting
4. Always check WebSocket states:
   - `WebSocket.CONNECTING` (0)
   - `WebSocket.OPEN` (1)
   - `WebSocket.CLOSING` (2)
   - `WebSocket.CLOSED` (3)

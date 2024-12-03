# Tournament System Documentation

## Overview
This document explains the tournament system's flow, from initialization to completion, including all components and their interactions.

## Components

### 1. ChooseGame Component
Main component handling tournament setup and player selection.

#### State Management:
```javascript
// Tournament creator info from localStorage
const tournamentCreator = JSON.parse(localStorage.getItem('user')) || {
  id: 1,
  username: "Tournament Creator"
};

// Other important states
const [invitedPlayers, setInvitedPlayers] = useState([]);
const [tournamentId, setTournamentId] = useState(null);
const [tournamentData, setTournamentData] = useState(null);
```

#### Key Functions:
```javascript
handleStartTournament()
- Purpose: Initiates a new tournament
- Flow:
  1. Gets creator info from localStorage
  2. Combines creator with invited players
  3. Sends to backend via gameService
  4. Shows tournament bracket on success
- Parameters: None
- Returns: None
```

### 2. Game Service
Handles all API communications for tournament management.

#### Endpoints:
```javascript
startTournament(players, mapType)
- Purpose: Starts new tournament
- Endpoint: POST /tournament/start
- Parameters:
  {
    players: Array<{id: string, username: string}>,
    mapType: string
  }
- Returns: { success: boolean, tournamentId: string }
```

```javascript
getTournamentData(tournamentId)
- Purpose: Gets current tournament state
- Endpoint: GET /tournament/{tournamentId}
- Returns: Tournament state including matches and results
```

### 3. Tournament Bracket Component
Visual representation of the tournament.

#### Auto-Updates:
```javascript
useEffect(() => {
  if (!tournamentId) return;
  
  // Poll for updates every 3 seconds
  const interval = setInterval(async () => {
    const result = await gameService.getTournamentData(tournamentId);
    if (result.success) {
      setTournamentData(result.data);
    }
  }, 3000);
  
  return () => clearInterval(interval);
}, [tournamentId]);
```

## Frontend Bracket Display

### 1. Bracket Structure
The tournament bracket is displayed in a tree-like structure:
```
Semi-Finals                Finals
[Player1]─┐
         ├─[Winner1]─┐
[Player2]─┘         ├─[Champion]
                    │
[Player3]─┐         │
         ├─[Winner2]─┘
[Player4]─┘
```

### 2. Visual States
Each match box shows:
- Player names
- Match status
- Winner (if determined)

Status Colors:
- Gray: Waiting to start
- Blue: Match in progress
- Green: Match completed
- Gold: Winner highlight

### 3. Data Updates
- Bracket polls backend every 3 seconds
- Updates are automatic, no manual refresh needed
- Changes trigger smooth animations
- Winners progress visually through the bracket

### 4. Component Structure
```jsx
<TournamentBracket>
  <Round1>
    <Match position="top">
      <Player1 />
      <Player2 />
    </Match>
    <Match position="bottom">
      <Player3 />
      <Player4 />
    </Match>
  </Round1>
  <Round2>
    <FinalMatch>
      <Winner1 />
      <Winner2 />
    </FinalMatch>
  </Round2>
</TournamentBracket>
```


## Tournament Bracket Logic

### 1. Bracket Structure
```javascript
// Tournament data structure
{
  rounds: [
    {
      round: 1,
      matches: [
        {
          id: "match1",
          players: [player1, player2],
          winner: null,
          status: "pending" // pending, in_progress, completed
        },
        {
          id: "match2",
          players: [player3, player4],
          winner: null,
          status: "pending"
        }
      ]
    },
    {
      round: 2,
      matches: [
        {
          id: "final",
          players: [], // Will be filled with winners from round 1
          winner: null,
          status: "pending"
        }
      ]
    }
  ],
  currentRound: 1,
  isComplete: false
}
```

### 2. Match Flow
1. **Initial Setup**:
   - First round matches are created automatically
   - Players are paired: [1 vs 2] and [3 vs 4]
   - Match status starts as "pending"

2. **During Tournament**:
   - Active match status changes to "in_progress"
   - When game ends, winner is recorded
   - Match status changes to "completed"
   - Winners advance to next round

3. **Round Progression**:
   - When all matches in a round complete
   - Winners are paired for next round
   - Tournament updates currentRound


## Complete Flow
1. Tournament Creation:
   - Creator info loaded from localStorage
   - Up to 3 players can be invited
   - Map type selected
   - Tournament started via backend

2. Tournament Progress:
   - Automatic updates every 3 seconds
   - Players participate in matches
   - Winners advance automatically
   - Final winner displayed

3. Tournament Completion:
   - Winner highlighted
   - Tournament modal can be closed
   - Ready for new tournament

## Usage Example for Game Developer

```javascript
// 1. Start Tournament
const startGame = async () => {
  const tournamentData = {
    players: selectedPlayers,
    mapType: 'map1',
  };
  await gameService.startTournament(tournamentData);
};

// 2. Get Tournament Data
const getTournamentData = async () => {
  const result = await gameService.getTournamentData(tournamentId);
  if (result.success) {
    setTournamentData(result.data);
  }
};
```

## State Management

### Tournament States:
1. **Not Started**
   - No active tournament
   - Can select players

2. **In Progress**
   - Tournament bracket visible
   - Matches can be updated
   - Shows current progress

3. **Complete**
   - All matches finished
   - Winner displayed
   - Can start new tournament

### Match Results Structure:
```javascript
{
  matches: [
    {
      id: string,
      players: [Player, Player],
      winner: Player
    }
  ],
  winner: Player
}
```

## Error Handling
- Failed tournament start: Shows error message
- Match update failure: Retries or shows error
- Connection issues: Implements retry mechanism

## Security Considerations
- Validates player data
- Verifies match results
- Authenticates API calls
- Prevents unauthorized updates

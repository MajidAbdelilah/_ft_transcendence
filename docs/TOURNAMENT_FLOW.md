# Tournament System Documentation

## Overview
This document explains the tournament system's flow, from initialization to completion, including all components and their interactions.

## Components

### 1. ChooseGame Component
Main component handling tournament setup and player selection.

#### Key Functions:
```javascript
startTournament()
- Purpose: Initiates a new tournament
- Flow:
  1. Collects player data
  2. Sends to backend via gameService
  3. Shows tournament bracket on success
- Parameters: None
- Returns: None
```

```javascript
updateMatchResults(round, matchId, winner)
- Purpose: Updates tournament bracket with match results
- Flow:
  1. Updates local state with match winner
  2. Triggers bracket re-render
- Parameters:
  - round: 'semifinals' | 'finals'
  - matchId: 'left' | 'right' (for semifinals)
  - winner: Player object
```

### 2. Game Service
Handles all API communications for tournament management.

#### Endpoints:
```javascript
startTournament(tournamentData)
- Purpose: Starts new tournament
- Endpoint: POST /tournament/start
- Parameters:
  {
    players: Array<{id: string, username: string}>,
    gameType: string,
    tournamentId: number
  }
- Returns: { success: boolean, tournamentId: string }
```

```javascript
updateMatchResult(matchData)
- Purpose: Updates match outcome
- Endpoint: POST /tournament/match/update
- Parameters:
  {
    tournamentId: string,
    matchId: string,
    winner: Player
  }
```

```javascript
getTournamentStatus(tournamentId)
- Purpose: Gets current tournament state
- Endpoint: GET /tournament/{tournamentId}/status
- Returns: {
    matchResults: {
      semifinals: { left: Player, right: Player },
      final: Player
    },
    isComplete: boolean
  }
```

```javascript
endTournament(tournamentId)
- Purpose: Ends tournament
- Endpoint: POST /tournament/{tournamentId}/end
```

### 3. Tournament Bracket Component
Visual representation of the tournament.

#### Props:
```javascript
{
  players: Array<Player>,
  onClose: () => void,
  matchResults: {
    semifinals: {
      left: Player | null,
      right: Player | null
    },
    final: Player | null
  }
}
```

## Complete Flow

1. **Tournament Initialization**
   ```
   User -> ChooseGame -> startTournament() -> gameService.startTournament()
                                                      |
   Backend creates tournament <------------------------|
                |
   Success response -------------------------> Tournament bracket displays
   ```

2. **Match Updates**
   ```
   Game Developer -> gameService.updateMatchResult() -> Backend
                                                          |
   Tournament bracket updates <-- ChooseGame <-- Status --|
   ```

3. **Tournament Completion**
   ```
   Final Match -> gameService.endTournament() -> Backend
                                                   |
   Tournament closes <-- ChooseGame <-- Response --|
   ```

## Usage Example for Game Developer

```javascript
// 1. Start Tournament
const startGame = async () => {
  const tournamentData = {
    players: selectedPlayers,
    gameType: 'pong',
    tournamentId: Date.now()
  };
  await gameService.startTournament(tournamentData);
};

// 2. Update Match Results
const matchCompleted = async (winner) => {
  await gameService.updateMatchResult({
    tournamentId: currentTournamentId,
    matchId: 'semifinals-left',
    winner: winner
  });
};

// 3. End Tournament
const endTournament = async () => {
  await gameService.endTournament(tournamentId);
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
  semifinals: {
    left: {
      winner: Player,
      players: [Player, Player]
    },
    right: {
      winner: Player,
      players: [Player, Player]
    }
  },
  finals: {
    players: [Player, Player],
    winner: Player
  }
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

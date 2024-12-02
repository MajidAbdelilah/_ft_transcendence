# Game Developer's Guide - Tournament Integration

## Overview
This guide explains how to integrate your game with the tournament system. The tournament bracket UI and player management are already implemented - you just need to add your game logic and update the tournament state.

## What's Already Implemented
1. Tournament bracket UI
2. Player selection and invitation
3. Match tracking system
4. Winner display functionality

## Your Integration Points

### 1. Starting the Game
When a tournament starts, you'll receive the player data in `ChooseGame.jsx`:

```javascript
// In ChooseGame.jsx, find this function:
const startTournament = async () => {
  // This is where you'll receive player data
  const tournamentData = {
    players: allPlayers,  // Array of 4 players
    gameType: selectedMap,
    tournamentId: Date.now()
  };
  
  // TODO: Add your game initialization here
  // Example:
  initializeGame(tournamentData.players);
}
```

### 2. Updating Match Results
After each match completes, update the tournament bracket:

```javascript
// Use the gameService to update match results
import { gameService } from '../../services/gameService';

// After a semifinal match:
const onSemifinalComplete = async (matchId, winner) => {
  await gameService.updateMatchResult({
    matchId, // 'left' or 'right'
    winner,  // winning player object
    round: 'semifinals'
  });
};

// After the final match:
const onFinalComplete = async (winner) => {
  await gameService.updateMatchResult({
    winner,
    round: 'finals'
  });
};
```

## Required Implementation

### 1. Game Logic
Add your game code in ChooseGame.jsx:
```javascript
// Add these functions:

const initializeGame = (players) => {
  // Your game initialization logic
  // Example: Create game canvas, load assets, etc.
};

const startMatch = (player1, player2) => {
  // Start a match between two players
  // Example: Reset game state, position players, etc.
};

const handleGameComplete = (winner) => {
  // Called when a match ends
  // Update the tournament bracket with the winner
};
```

### 2. Match Flow
For each match:
1. Get the two players for the current match
2. Initialize your game
3. Run the match
4. When match ends, update the tournament:
   ```javascript
   // Example match flow
   const runMatch = async (player1, player2) => {
     // 1. Start the game
     startMatch(player1, player2);
     
     // 2. Wait for match to complete
     const winner = await waitForMatchComplete();
     
     // 3. Update tournament
     if (currentRound === 'semifinals') {
       await onSemifinalComplete(matchId, winner);
     } else {
       await onFinalComplete(winner);
     }
   };
   ```

### 3. Tournament States
The tournament has these states you need to handle:
- `semifinals`: Two matches (left and right brackets)
- `finals`: Final match between semifinal winners
- `complete`: Tournament finished

## Example Integration

```javascript
// In your game code:

class GameManager {
  constructor(tournamentData) {
    this.players = tournamentData.players;
    this.currentMatch = null;
  }

  async runSemifinals() {
    // Run left bracket
    await this.runMatch(
      this.players[0], 
      this.players[1], 
      'left'
    );
    
    // Run right bracket
    await this.runMatch(
      this.players[2], 
      this.players[3], 
      'right'
    );
  }

  async runFinals(leftWinner, rightWinner) {
    await this.runMatch(leftWinner, rightWinner, 'final');
  }

  async runMatch(player1, player2, matchId) {
    // Your game logic here
    const winner = await this.playGame(player1, player2);
    
    // Update tournament
    if (matchId === 'final') {
      await onFinalComplete(winner);
    } else {
      await onSemifinalComplete(matchId, winner);
    }
  }
}
```

## API Reference

### gameService Methods
```javascript
// Start tournament
startTournament(tournamentData: {
  players: Player[],
  gameType: string,
  tournamentId: string
})

// Update match result
updateMatchResult(matchData: {
  matchId: string,
  winner: Player,
  round: 'semifinals' | 'finals'
})

// Get tournament status
getTournamentStatus(tournamentId: string)
```

### Player Object Structure
```javascript
type Player = {
  id: string,
  username: string,
  profiles_photo: string
}
```

## Testing Your Integration
1. Start with 4 players
2. Run semifinal matches
3. Run final match
4. Verify bracket updates correctly
5. Test error cases (disconnections, etc.)

## Next Steps
1. Add your game initialization code in ChooseGame.jsx
2. Implement match logic
3. Add winner determination
4. Connect to tournament update system
5. Test the complete flow

Need help? Check the existing implementation in:
- `/src/app/(Home)/Game/ChooseGame.jsx`
- `/src/app/components/TournamentBracket.jsx`
- `/src/app/services/gameService.js`

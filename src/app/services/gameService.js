import customAxios from '../customAxios';

// WebSocket connection for bracket updates
let ws = null;

const initializeBracketWebSocket = (tournamentId) => {
  if (!ws || ws.readyState === WebSocket.CLOSED) {
    ws = new WebSocket(`ws://your-backend-url/tournament/${tournamentId}/bracket`);
    
    ws.onopen = () => {
      console.log('Bracket WebSocket Connected');
    };

    ws.onerror = (error) => {
      console.error('Bracket WebSocket Error:', error);
    };

    ws.onclose = () => {
      console.log('Bracket WebSocket Disconnected');
    };
  }
  return ws;
};

export const gameService = {
  // Join tournament matchmaking queue (HTTP)
  joinTournament: async (userData, mapType) => {
    try {
      const response = await customAxios.post('/tournament/join', {
        userId: userData.id,
        username: userData.username,
        mapType
      });
      return {
        success: true,
        tournamentId: response.data.tournamentId,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error joining tournament:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Leave matchmaking queue (HTTP)
  leaveMatchmaking: async (userId) => {
    try {
      await customAxios.post('/tournament/leave-queue', {
        userId
      });
      return {
        success: true
      };
    } catch (error) {
      console.error('Error leaving matchmaking:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Start a new tournament (HTTP)
  startTournament: async (players, mapType) => {
    try {
      const response = await customAxios.post('/tournament/start', {
        players,
        mapType
      });
      return {
        success: true,
        tournamentId: response.data.tournamentId
      };
    } catch (error) {
      console.error('Error starting tournament:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get initial tournament data (HTTP)
  getTournamentData: async (tournamentId) => {
    try {
      const response = await customAxios.get(`/tournament/${tournamentId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching tournament data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Setup WebSocket listener for bracket updates
  setupBracketListener: (tournamentId, onUpdate) => {
    const ws = initializeBracketWebSocket(tournamentId);
    
    ws.onmessage = (event) => {
      const bracketData = JSON.parse(event.data);
      onUpdate(bracketData);
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }
};

export default gameService;

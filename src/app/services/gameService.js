import customAxios from '../customAxios';

// WebSocket connection for bracket updates
let ws = null;

const initializeBracketWebSocket = () => {
  if (!ws || ws.readyState === WebSocket.CLOSED) {
    ws = new WebSocket(`ws://10.11.6.4:8001/ws/tournament/tour/PLAY/`);
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('WebSocket connection timeout'));
    }, 5000);

    const originalOnOpen = ws.onopen;
    ws.onopen = (event) => {
      console.log('Bracket WebSocket Connected');
      clearTimeout(timeout);
      if (originalOnOpen) originalOnOpen(event);
      resolve(ws);
    };

    // Add general message handler for all tournament updates
    const originalOnMessage = ws.onmessage;
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received tournament data:', data);
      if (originalOnMessage) originalOnMessage(event);
    };

    ws.onerror = (error) => {
      console.error('Bracket WebSocket Error:', error);
      clearTimeout(timeout);
      reject(error);
    };

    ws.onclose = () => {
      console.log('Bracket WebSocket connection closed');
    };

    // If already open, resolve immediately
    if (ws.readyState === WebSocket.OPEN) {
      clearTimeout(timeout);
      resolve(ws);
    }
  });
};

export const gameService = {
  // Initialize WebSocket connection
  initializeBracketWebSocket,

  // Join tournament via WebSocket
  joinTournament: async (userData, mapType) => {
    try {
      // Ensure WebSocket is connected
      const socket = await gameService.initializeBracketWebSocket();
      
      return new Promise((resolve, reject) => {
        try {
          // Send join tournament message
          socket.send(JSON.stringify({
            type: 'join_tournament',
            data: {
              userId: userData.id,
              username: userData.username,
              mapType
            }
          }));

          // Set up one-time message handler for join response
          const handleJoinResponse = (event) => {
            const response = JSON.parse(event.data);
            if (response.type === 'join_tournament_response') {
              socket.removeEventListener('message', handleJoinResponse);
              if (response.success) {
                resolve({
                  success: true,
                  tournamentId: response.tournamentId,
                  message: response.message
                });
              } else {
                reject({
                  success: false,
                  error: response.error
                });
              }
            }
          };

          socket.addEventListener('message', handleJoinResponse);
        } catch (error) {
          reject({
            success: false,
            error: error.message
          });
        }
      });
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to connect to tournament server'
      };
    }
  },

  // Setup WebSocket listener for bracket updates
  setupBracketListener: (tournamentId, onUpdate) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error('No active WebSocket connection');
      return;
    }

    // Create handler for all tournament updates
    const bracketHandler = (event) => {
      const data = JSON.parse(event.data);
      onUpdate(data);
    };

    // Add the handler to WebSocket
    ws.addEventListener('message', bracketHandler);

    // Return cleanup function
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.removeEventListener('message', bracketHandler);
      }
    };
  },

  // Get WebSocket instance
  getWebSocket: () => {
    return ws;
  },

  // Close WebSocket connection
  disconnect: () => {
    if (ws) {
      ws.close();
      ws = null;
    }
  }
};

export default gameService;

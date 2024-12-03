import customAxios from '../customAxios';

export const gameService = {
  // Start a new tournament
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

  // Get tournament data including matches and results
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
  }
};

export default gameService;

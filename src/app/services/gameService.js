import customAxios from '../customAxios';

export const gameService = {
  // Start a new tournament
  startTournament: async (tournamentData) => {
    const response = await customAxios.post('/tournament/start', tournamentData);
    return response.data;
  },

  // Update match result
  updateMatchResult: async (matchData) => {
    const response = await customAxios.post('/tournament/match/update', matchData);
    return response.data;
  },

  // Get tournament status
  getTournamentStatus: async (tournamentId) => {
    const response = await customAxios.get(`/tournament/${tournamentId}/status`);
    return response.data;
  },

  // End tournament
  endTournament: async (tournamentId) => {
    const response = await customAxios.post(`/tournament/${tournamentId}/end`);
    return response.data;
  }
};

export default gameService;

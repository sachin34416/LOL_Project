import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Game API
export const gameAPI = {
  getAllGames: () => api.get('/games'),
  getGameById: (id) => api.get(`/games/${id}`),
  getGamesByCategory: (category) => api.get(`/games/category/${category}`),
  getDefaultTemplates: () => api.get('/games/default-templates'),
  createGame: (gameData) => api.post('/games', gameData),
  updateGame: (id, gameData) => api.put(`/games/${id}`, gameData),
  deleteGame: (id) => api.delete(`/games/${id}`),
};

// Player API
export const playerAPI = {
  getAllPlayers: () => api.get('/players'),
  getPlayerById: (id) => api.get(`/players/${id}`),
  getPlayerStats: (id) => api.get(`/players/${id}/stats`),
  registerPlayer: (playerData) => api.post('/players', playerData),
  updatePlayer: (id, playerData) => api.put(`/players/${id}`, playerData),
  deletePlayer: (id) => api.delete(`/players/${id}`),
  getLeaderboard: (limit = 10, gameId) => 
    api.get(`/players/leaderboard?limit=${limit}${gameId ? `&gameId=${gameId}` : ''}`),
  updatePlayerStats: (id, statsData) => api.put(`/players/${id}/stats`, statsData),
};

// Tournament API
export const tournamentAPI = {
  getAllTournaments: () => api.get('/tournaments'),
  getTournamentById: (id) => api.get(`/tournaments/${id}`),
  getTournamentStandings: (id) => api.get(`/tournaments/${id}/standings`),
  createTournament: (tournamentData) => api.post('/tournaments', tournamentData),
  updateTournament: (id, tournamentData) => api.put(`/tournaments/${id}`, tournamentData),
  deleteTournament: (id) => api.delete(`/tournaments/${id}`),
  registerPlayerToTournament: (id, playerData) => 
    api.post(`/tournaments/${id}/register-player`, playerData),
  removePlayerFromTournament: (id, playerData) => 
    api.post(`/tournaments/${id}/remove-player`, playerData),
  updateStandings: (id, standings) => api.put(`/tournaments/${id}/standings`, standings),
};

// Match API
export const matchAPI = {
  getAllMatches: () => api.get('/matches'),
  getMatchById: (id) => api.get(`/matches/${id}`),
  getMatchesByTournament: (tournamentId) => api.get(`/matches/tournament/${tournamentId}`),
  getUpcomingMatches: () => api.get('/matches/upcoming'),
  getTodaysMatches: () => api.get('/matches/today'),
  createMatch: (matchData) => api.post('/matches', matchData),
  updateMatch: (id, matchData) => api.put(`/matches/${id}`, matchData),
  startMatch: (id) => api.put(`/matches/${id}/start`),
  endMatch: (id, winnerData) => api.put(`/matches/${id}/end`, winnerData),
  scheduleMatches: (tournamentId, schedule) => 
    api.post(`/matches/tournament/${tournamentId}/schedule`, schedule),
};

// Score API
export const scoreAPI = {
  getMatchScores: (matchId) => api.get(`/scores/match/${matchId}`),
  getPlayerMatchScore: (matchId, playerId) => 
    api.get(`/scores/match/${matchId}/player/${playerId}`),
  getPlayerGameStats: (playerId, gameId) => 
    api.get(`/scores/player/${playerId}/game/${gameId}`),
  getTournamentLeaderboard: (tournamentId) => 
    api.get(`/scores/tournament/${tournamentId}/leaderboard`),
  getScoreHistory: (playerId, gameId, limit) => 
    api.get(`/scores/history/${playerId}?${gameId ? `gameId=${gameId}&` : ''}limit=${limit || 10}`),
  updateScore: (scoreData) => api.post('/scores', scoreData),
  initializeScoreSheet: (scoreSheetData) => api.post('/scores/initialize', scoreSheetData),
  addSetScore: (matchId, playerId, setData) => 
    api.post(`/scores/match/${matchId}/player/${playerId}/set`, setData),
  finalizeMatchScore: (matchId, winnerData) => 
    api.post(`/scores/match/${matchId}/finalize`, winnerData),
};

export default api;

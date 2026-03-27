import create from 'zustand';
import { playerAPI } from '../services/api';

export const usePlayerStore = create((set) => ({
  players: [],
  selectedPlayer: null,
  loading: false,
  error: null,

  setPlayers: (players) => set({ players }),
  setSelectedPlayer: (player) => set({ selectedPlayer: player }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchAllPlayers: async () => {
    set({ loading: true });
    try {
      const response = await playerAPI.getAllPlayers();
      set({ players: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addPlayer: (player) => set((state) => ({
    players: [...state.players, player],
  })),

  updatePlayer: (id, updatedPlayer) => set((state) => ({
    players: state.players.map(p => p._id === id ? { ...p, ...updatedPlayer } : p),
  })),

  removePlayer: (id) => set((state) => ({
    players: state.players.filter(p => p._id !== id),
  })),
}));

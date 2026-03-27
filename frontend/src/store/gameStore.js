import create from 'zustand';
import { gameAPI } from '../services/api';

export const useGameStore = create((set) => ({
  games: [],
  selectedGame: null,
  loading: false,
  error: null,

  setGames: (games) => set({ games }),
  setSelectedGame: (game) => set({ selectedGame: game }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchAllGames: async () => {
    set({ loading: true });
    try {
      const response = await gameAPI.getAllGames();
      set({ games: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchGamesByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await gameAPI.getGamesByCategory(category);
      set({ games: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchDefaultTemplates: async () => {
    set({ loading: true });
    try {
      const response = await gameAPI.getDefaultTemplates();
      set({ games: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addGame: (game) => set((state) => ({
    games: [...state.games, game],
  })),

  updateGame: (id, updatedGame) => set((state) => ({
    games: state.games.map(g => g._id === id ? { ...g, ...updatedGame } : g),
  })),

  removeGame: (id) => set((state) => ({
    games: state.games.filter(g => g._id !== id),
  })),
}));

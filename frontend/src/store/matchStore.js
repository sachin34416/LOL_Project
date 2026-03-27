import create from 'zustand';
import { matchAPI } from '../services/api';

export const useMatchStore = create((set) => ({
  matches: [],
  selectedMatch: null,
  upcomingMatches: [],
  todaysMatches: [],
  loading: false,
  error: null,

  setMatches: (matches) => set({ matches }),
  setSelectedMatch: (match) => set({ selectedMatch: match }),
  setUpcomingMatches: (matches) => set({ upcomingMatches: matches }),
  setTodaysMatches: (matches) => set({ todaysMatches: matches }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchAllMatches: async () => {
    set({ loading: true });
    try {
      const response = await matchAPI.getAllMatches();
      set({ matches: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchUpcomingMatches: async () => {
    set({ loading: true });
    try {
      const response = await matchAPI.getUpcomingMatches();
      set({ upcomingMatches: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTodaysMatches: async () => {
    set({ loading: true });
    try {
      const response = await matchAPI.getTodaysMatches();
      set({ todaysMatches: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addMatch: (match) => set((state) => ({
    matches: [...state.matches, match],
  })),

  updateMatch: (id, updatedMatch) => set((state) => ({
    matches: state.matches.map(m => m._id === id ? { ...m, ...updatedMatch } : m),
  })),

  removeMatch: (id) => set((state) => ({
    matches: state.matches.filter(m => m._id !== id),
  })),
}));

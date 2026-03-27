import create from 'zustand';
import { tournamentAPI } from '../services/api';

export const useTournamentStore = create((set) => ({
  tournaments: [],
  selectedTournament: null,
  loading: false,
  error: null,

  setTournaments: (tournaments) => set({ tournaments }),
  setSelectedTournament: (tournament) => set({ selectedTournament: tournament }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchAllTournaments: async () => {
    set({ loading: true });
    try {
      const response = await tournamentAPI.getAllTournaments();
      set({ tournaments: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addTournament: (tournament) => set((state) => ({
    tournaments: [...state.tournaments, tournament],
  })),

  updateTournament: (id, updatedTournament) => set((state) => ({
    tournaments: state.tournaments.map(t => t._id === id ? { ...t, ...updatedTournament } : t),
  })),

  removeTournament: (id) => set((state) => ({
    tournaments: state.tournaments.filter(t => t._id !== id),
  })),
}));

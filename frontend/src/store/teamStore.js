import create from 'zustand';
import { teamAPI } from '../services/api';

export const useTeamStore = create((set) => ({
  teams: [],
  currentTeam: null,
  loading: false,
  error: null,

  // Fetch all teams
  fetchAllTeams: async () => {
    set({ loading: true, error: null });
    try {
      const response = await teamAPI.getAllTeams();
      set({ teams: response.data.data, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Fetch team by ID
  fetchTeamById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await teamAPI.getTeamById(id);
      set({ currentTeam: response.data.data, loading: false });
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Create team
  createTeam: async (teamData) => {
    set({ loading: true, error: null });
    try {
      const response = await teamAPI.createTeam(teamData);
      set((state) => ({
        teams: [...state.teams, response.data.data],
        loading: false,
      }));
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Update team
  updateTeam: async (id, teamData) => {
    set({ loading: true, error: null });
    try {
      const response = await teamAPI.updateTeam(id, teamData);
      set((state) => ({
        teams: state.teams.map((t) => (t._id === id ? response.data.data : t)),
        currentTeam: state.currentTeam?._id === id ? response.data.data : state.currentTeam,
        loading: false,
      }));
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Add player to team
  addPlayerToTeam: async (teamId, playerId) => {
    set({ loading: true, error: null });
    try {
      const response = await teamAPI.addPlayerToTeam(teamId, playerId);
      set((state) => ({
        teams: state.teams.map((t) => (t._id === teamId ? response.data.data : t)),
        currentTeam: state.currentTeam?._id === teamId ? response.data.data : state.currentTeam,
        loading: false,
      }));
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Remove player from team
  removePlayerFromTeam: async (teamId, playerId) => {
    set({ loading: true, error: null });
    try {
      const response = await teamAPI.removePlayerFromTeam(teamId, playerId);
      set((state) => ({
        teams: state.teams.map((t) => (t._id === teamId ? response.data.data : t)),
        currentTeam: state.currentTeam?._id === teamId ? response.data.data : state.currentTeam,
        loading: false,
      }));
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Delete team
  deleteTeam: async (id) => {
    set({ loading: true, error: null });
    try {
      await teamAPI.deleteTeam(id);
      set((state) => ({
        teams: state.teams.filter((t) => t._id !== id),
        currentTeam: state.currentTeam?._id === id ? null : state.currentTeam,
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

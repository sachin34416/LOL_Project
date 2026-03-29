import create from 'zustand';
import { apiClient } from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  loading: false,
  error: null,

  // Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { user, token } = response.data.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ 
        user, 
        token, 
        isAuthenticated: true,
        loading: false 
      });
      
      return { success: true, message: 'Login successful' };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Register
  register: async (name, email, password, confirmPassword) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post('/auth/register', { 
        name, 
        email, 
        password, 
        confirmPassword 
      });
      const { user, token } = response.data.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ 
        user, 
        token, 
        isAuthenticated: true,
        loading: false 
      });
      
      return { success: true, message: 'Registration successful' };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Get Current User
  getCurrentUser: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    set({ loading: true });
    try {
      const response = await apiClient.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: response.data.data, loading: false });
    } catch (error) {
      set({ loading: false, isAuthenticated: false });
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Logout
  logout: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await apiClient.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false, error: null });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Set user from localStorage
  initializeAuth: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      set({ 
        user: JSON.parse(user), 
        token, 
        isAuthenticated: true 
      });
    }
  },
}));

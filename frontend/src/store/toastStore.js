import { create } from 'zustand';

const useToastStore = create((set) => ({
  toasts: [],

  addToast: (message, type = 'success', duration = 4000) => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));
    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  success: (message) => {
    return useToastStore.getState().addToast(message, 'success', 4000);
  },

  error: (message) => {
    return useToastStore.getState().addToast(message, 'error', 4000);
  },

  warning: (message) => {
    return useToastStore.getState().addToast(message, 'warning', 4000);
  },

  info: (message) => {
    return useToastStore.getState().addToast(message, 'info', 4000);
  },
}));

export default useToastStore;

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isGuest: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

const USER_KEY = 'secure_user';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        isGuest: false,
      };

      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user: User = {
        id: '1',
        email,
        name,
        isGuest: false,
      };

      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loginAsGuest: async () => {
    const user: User = {
      id: 'guest',
      email: 'guest@fittrack.com',
      name: 'Guest User',
      isGuest: true,
    };

    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(USER_KEY);
    set({ user: null, isAuthenticated: false });
  },

  loadUser: async () => {
    try {
      const userData = await SecureStore.getItemAsync(USER_KEY);
      if (userData) {
        const user = JSON.parse(userData);
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  },
}));
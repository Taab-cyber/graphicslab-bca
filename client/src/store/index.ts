import { create } from 'zustand';
import type { User, Score, ActivityLog } from '../types';
import { api } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, avatar: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  addXP: (xp: number, source: string, program: string) => Promise<{ leveledUp: boolean }>;
}

interface AppState {
  scores: Score[];
  activities: ActivityLog[];
  soundEnabled: boolean;
  animationsEnabled: boolean;
  darkMode: boolean;
  sidebarOpen: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setScores: (scores: Score[]) => void;
  setActivities: (activities: ActivityLog[]) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('graphicslab_token'),
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('graphicslab_token', res.token);
    set({ user: res.user, token: res.token, isAuthenticated: true });
  },

  signup: async (name, email, password, avatar) => {
    const res = await api.signup({ name, email, password, avatar });
    localStorage.setItem('graphicslab_token', res.token);
    set({ user: res.user, token: res.token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('graphicslab_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    try {
      const token = localStorage.getItem('graphicslab_token');
      if (!token) {
        set({ isLoading: false });
        return;
      }
      const res = await api.getMe();
      set({ user: res.user, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('graphicslab_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser: (updates) => {
    const current = get().user;
    if (current) {
      set({ user: { ...current, ...updates } });
    }
  },

  addXP: async (xp, source, program) => {
    try {
      const res = await api.addXP({ xp, source, program });
      const current = get().user;
      if (current) {
        set({
          user: {
            ...current,
            xp: res.user.xp,
            level: res.user.level,
            badges: res.user.badges,
          },
        });
      }
      return { leveledUp: res.leveledUp };
    } catch {
      return { leveledUp: false };
    }
  },
}));

export const useAppStore = create<AppState>((set) => ({
  scores: [],
  activities: [],
  soundEnabled: localStorage.getItem('graphicslab_sound') !== 'false',
  animationsEnabled: localStorage.getItem('graphicslab_animations') !== 'false',
  darkMode: localStorage.getItem('graphicslab_darkmode') !== 'false',
  sidebarOpen: true,

  setSoundEnabled: (enabled) => {
    localStorage.setItem('graphicslab_sound', String(enabled));
    set({ soundEnabled: enabled });
  },
  setAnimationsEnabled: (enabled) => {
    localStorage.setItem('graphicslab_animations', String(enabled));
    set({ animationsEnabled: enabled });
  },
  setDarkMode: (enabled) => {
    localStorage.setItem('graphicslab_darkmode', String(enabled));
    set({ darkMode: enabled });
  },
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setScores: (scores) => set({ scores }),
  setActivities: (activities) => set({ activities }),
}));

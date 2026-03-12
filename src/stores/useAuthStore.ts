import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    set => ({
      user: null,
      isLoading: false,
      isInitialized: false,
      setUser: user => set({ user }),
      setLoading: isLoading => set({ isLoading }),
      setInitialized: isInitialized => set({ isInitialized }),
      clearAuth: () => set({ user: null, isLoading: false }),
    }),
    { name: 'auth-store' },
  ),
);

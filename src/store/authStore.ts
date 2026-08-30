import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthResult } from '@t/index';
import { queryClient } from '@utils/queryClient';

interface AuthState {
  user: Pick<User, 'id' | 'name' | 'email' | 'role'> | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (result: AuthResult) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: ({ user, accessToken, refreshToken }) => {
        // Limpia el cache de React Query al cambiar de identidad: sin esto,
        // queries no aisladas por usuario (ej. ['profile']) siguen mostrando
        // los datos de la sesión anterior hasta que vuelvan a hacer fetch.
        queryClient.clear();
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      },
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      logout: () => {
        queryClient.clear();
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    { name: 'dd-auth', partialize: (s) => ({ user: s.user, accessToken: s.accessToken, refreshToken: s.refreshToken, isAuthenticated: s.isAuthenticated }) }
  )
);

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import * as Sentry from "@sentry/react";
import type { User } from "../../core/modules/auth/domain/models/User";

interface AuthState {
  user: User | null;
  token: string | null;
  restaurantId: string | null;
  branchId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setRestaurantId: (restaurantId: string) => void;
  setBranchId: (branchId: string) => void;
  setAuth: (user: User, token: string, restaurantId?: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;
}

export type AuthContext = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  token: null,
  restaurantId: null,
  branchId: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthContext = create<AuthContext>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setUser: (user) =>
          set({
            user,
            isAuthenticated: true,
          }),

        setToken: (token) =>
          set({
            token,
          }),

        setRestaurantId: (restaurantId) =>
          set({
            restaurantId,
          }),

        setBranchId: (branchId) =>
          set({
            branchId,
          }),

        setAuth: (user, token, restaurantId) => {
          const branchId = user.branchId || null;
          const effectiveRestaurantId =
            restaurantId || user.restaurantId || null;

          // Contexto para Sentry: quién es y de qué local/rol (para filtrar/alertar).
          Sentry.setUser({ id: user.id, email: user.email });
          Sentry.setTag("role", user.role);
          Sentry.setTag("restaurantId", effectiveRestaurantId ?? undefined);
          Sentry.setTag("branchId", branchId ?? undefined);

          set({
            user,
            token,
            restaurantId: restaurantId || null,
            // El empleado viene con su sucursal en el user; el owner no tiene.
            branchId,
            isAuthenticated: true,
            error: null,
          });
        },

        setLoading: (isLoading) =>
          set({
            isLoading,
          }),

        setError: (error) =>
          set({
            error,
            isLoading: false,
          }),

        logout: () => {
          Sentry.setUser(null);
          set({
            ...initialState,
          });
        },

        clearError: () =>
          set({
            error: null,
          }),
      }),
      {
        name: "AuthContext", // Nombre de la key en sessionStorage
        storage: createJSONStorage(() => sessionStorage), // Usar sessionStorage en lugar de localStorage
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          restaurantId: state.restaurantId,
          branchId: state.branchId,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    {
      name: "AuthContext",
    },
  ),
);

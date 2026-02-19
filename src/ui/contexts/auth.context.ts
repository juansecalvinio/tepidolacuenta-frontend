import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
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

        setAuth: (user, token, restaurantId) =>
          set({
            user,
            token,
            restaurantId: restaurantId || null,
            isAuthenticated: true,
            error: null,
          }),

        setLoading: (isLoading) =>
          set({
            isLoading,
          }),

        setError: (error) =>
          set({
            error,
            isLoading: false,
          }),

        logout: () =>
          set({
            ...initialState,
          }),

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
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    {
      name: "AuthContext",
    },
  ),
);

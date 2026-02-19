import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import type {
  Branch,
  Restaurant,
} from "../../core/modules/restaurant/domain/models/Restaurant";

interface RestaurantContext {
  restaurant: Restaurant | null;
  activeBranch: Branch | null;
  isLoading: boolean;
  hasError: boolean;
  error: string | null;
  isRequested: boolean;
  setRestaurant: (restaurant: Restaurant | null) => void;
  setActiveBranch: (branch: Branch | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setHasError: (hasError: boolean) => void;
  setError: (error: string | null) => void;
  setIsRequested: (isRequested: boolean) => void;
}

export const useRestaurantContext = create<RestaurantContext>()(
  devtools(
    persist(
      (set) => ({
        restaurant: null,
        activeBranch: null,
        isLoading: false,
        hasError: false,
        error: null,
        isRequested: false,

        setRestaurant: (restaurant) =>
          set({
            restaurant,
          }),
        setActiveBranch: (branch) =>
          set({
            activeBranch: branch,
          }),
        setIsLoading: (isLoading) =>
          set({
            isLoading,
          }),
        setHasError: (hasError) =>
          set({
            hasError,
          }),
        setError: (error) =>
          set({
            error,
          }),
        setIsRequested: (isRequested) =>
          set({
            isRequested,
          }),
      }),
      {
        name: "RestaurantContext",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    {
      name: "RestaurantContext",
    },
  ),
);

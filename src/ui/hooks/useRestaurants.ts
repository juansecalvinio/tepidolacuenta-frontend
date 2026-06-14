import { useShallow } from "zustand/react/shallow";
import { useRestaurantContext } from "../contexts/restaurant.context";

export const useRestaurants = () =>
  useRestaurantContext(
    useShallow((s) => ({
      restaurant: s.restaurant,
      activeBranch: s.activeBranch,
      branches: s.branches,
      isLoading: s.isLoading,
      setActiveBranch: s.setActiveBranch,
    })),
  );

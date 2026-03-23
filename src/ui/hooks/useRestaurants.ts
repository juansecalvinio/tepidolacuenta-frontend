import { useRestaurantContext } from "../contexts/restaurant.context";

export const useRestaurants = () => {
  const { restaurant, activeBranch, branches, isLoading, setActiveBranch } =
    useRestaurantContext();
  return { restaurant, activeBranch, branches, isLoading, setActiveBranch };
};

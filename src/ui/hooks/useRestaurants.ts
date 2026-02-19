import { useRestaurantContext } from "../contexts/restaurant.context";

export const useRestaurants = () => {
  const { restaurant, activeBranch } = useRestaurantContext();
  return { restaurant, activeBranch };
};

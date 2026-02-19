import { useCallback } from "react";
import { getRestaurantRepository } from "../../core/modules/restaurant/infrastructure/repositories/RestaurantRepositoryFactory";
import { useRestaurantContext } from "../contexts/restaurant.context";
import { GetBranchesByRestaurant } from "../../core/modules/restaurant/use-cases/GetBranchesByRestaurant";
import type { Branch } from "../../core/modules/restaurant/domain/models/Restaurant";

export const useFetchBranches = () => {
  const {
    setRestaurant,
    setActiveBranch,
    setIsLoading,
    setError,
    setHasError,
  } = useRestaurantContext();
  const repository = getRestaurantRepository();

  const fetchBranchesByRestaurant = useCallback(
    async (restaurantId: string) => {
      setIsLoading(true);
      setHasError(false);
      setError("");

      try {
        const getBranches = GetBranchesByRestaurant(repository);
        const response = await getBranches(restaurantId);

        if (response.success) {
          let activeBranch: Branch | null = null;

          if (response.data.length > 0) {
            activeBranch =
              response.data.find((branch) => branch.isActive) || null;
          }
          setActiveBranch(activeBranch);

          return { success: true, data: response.data, activeBranch };
        } else {
          const errorMessage =
            "Error al obtener las sucursales del restaurante";
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al crear el restaurante";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [repository, setRestaurant, setIsLoading, setError],
  );

  return {
    fetchBranchesByRestaurant,
  };
};

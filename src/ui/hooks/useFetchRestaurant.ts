import { useCallback } from "react";
import { useAuthContext } from "../contexts/auth.context";
import { getRestaurantRepository } from "../../core/modules/restaurant/infrastructure/repositories/RestaurantRepositoryFactory";
import type { CreateRestaurantRequest } from "../../core/modules/restaurant/domain/models/Restaurant";
import { CreateRestaurant } from "../../core/modules/restaurant/use-cases/CreateRestaurant";

export const useFetchRestaurant = () => {
  const { setRestaurantId, setLoading, setError, clearError } =
    useAuthContext();
  const repository = getRestaurantRepository();

  const createRestaurant = useCallback(
    async (request: CreateRestaurantRequest) => {
      setLoading(true);
      clearError();

      try {
        const createRestaurantUseCase = CreateRestaurant(repository);
        const response = await createRestaurantUseCase(request);

        if (response.success) {
          // Save restaurantId to auth context
          setRestaurantId(response.data.id);
          return { success: true, data: response.data };
        } else {
          const errorMessage = "Error al crear el restaurante";
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al crear el restaurante";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [repository, setRestaurantId, setLoading, setError, clearError]
  );

  return {
    createRestaurant,
  };
};

import { useCallback } from "react";
import { useAuthContext } from "../contexts/auth.context";
import { getRestaurantRepository } from "../../core/modules/restaurant/infrastructure/repositories/RestaurantRepositoryFactory";
import type { CreateRestaurantRequest } from "../../core/modules/restaurant/domain/models/Restaurant";
import { CreateRestaurant } from "../../core/modules/restaurant/use-cases/CreateRestaurant";
import { useTablesContext } from "../contexts/tables.context";
import { useRestaurantContext } from "../contexts/restaurant.context";
import { GetRestaurantById } from "../../core/modules/restaurant/use-cases/GetRestaurantById";
import { getErrorMessage } from "../../core/utils/error-messages";

export const useFetchRestaurant = () => {
  const { setRestaurantId, setBranchId } = useAuthContext();
  const {
    setRestaurant,
    setActiveBranch,
    setIsLoading,
    setError,
    setHasError,
  } = useRestaurantContext();
  const { setTables } = useTablesContext();
  const repository = getRestaurantRepository();

  const createRestaurant = useCallback(
    async (request: CreateRestaurantRequest) => {
      setIsLoading(true);
      setHasError(false);
      setError("");

      try {
        const createRestaurantUseCase = CreateRestaurant(repository);
        const response = await createRestaurantUseCase(request);

        if (response.success) {
          // Save restaurantId to auth context
          setRestaurantId(response.data.restaurant.id);
          setRestaurant(response.data.restaurant);
          setBranchId(response.data.branch.id);
          setActiveBranch(response.data.branch);
          setTables(response.data.tables);
          return { success: true, data: response.data };
        } else {
          const errorMessage = getErrorMessage(null, "createRestaurant");
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }
      } catch (err) {
        const errorMessage = getErrorMessage(err, "createRestaurant");
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [repository, setRestaurantId, setIsLoading, setError, setHasError],
  );

  const fetchRestaurant = useCallback(
    async (restaurantId: string) => {
      setIsLoading(true);
      setHasError(false);
      setError("");

      try {
        const getRestaurantByIdUseCase = GetRestaurantById(repository);
        const response = await getRestaurantByIdUseCase(restaurantId);

        if (response.success) {
          const restaurant = response.data; // Assuming user has only one restaurant
          setRestaurant(restaurant);
          return { success: true, data: restaurant };
        } else {
          const errorMessage = getErrorMessage(null, "fetchRestaurant");
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }
      } catch (err) {
        const errorMessage = getErrorMessage(err, "fetchRestaurant");
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [repository, setRestaurant, setIsLoading, setError, setHasError],
  );

  return {
    createRestaurant,
    fetchRestaurant,
  };
};

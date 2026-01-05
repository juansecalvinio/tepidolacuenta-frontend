import { useCallback } from "react";
import { useTablesContext } from "../contexts/tables.context";
import { useAuth } from "./useAuth";
import { getTableRepository } from "../../core/modules/tables/infrastructure/repositories/TableRepositoryFactory";
import { GetTables } from "../../core/modules/tables/use-cases/GetTables";
import { CreateTables } from "../../core/modules/tables/use-cases/CreateTables";

export const useFetchTables = () => {
  const { setTables, setLoading, setError, clearError } = useTablesContext();
  const { restaurantId } = useAuth();
  const repository = getTableRepository();

  const fetchTables = useCallback(async () => {
    if (!restaurantId) {
      setError("No se encontró el ID del restaurante");
      return { success: false, error: "No se encontró el ID del restaurante" };
    }

    setLoading(true);
    clearError();

    try {
      const getTablesUseCase = GetTables(repository);
      const response = await getTablesUseCase(restaurantId);
      setTables(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar las mesas";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [restaurantId, repository, setTables, setLoading, setError, clearError]);

  const createTables = useCallback(
    async (count: number, providedRestaurantId?: string) => {
      // Use provided restaurantId or fall back to the one from context
      const effectiveRestaurantId = providedRestaurantId || restaurantId;

      if (!effectiveRestaurantId) {
        setError("No se encontró el ID del restaurante");
        return {
          success: false,
          error: "No se encontró el ID del restaurante",
        };
      }

      setLoading(true);
      clearError();

      try {
        const createTablesUseCase = CreateTables(repository);
        const response = await createTablesUseCase({
          restaurantId: effectiveRestaurantId,
          count,
        });
        setTables(response.data);
        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al crear las mesas";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [restaurantId, repository, setTables, setLoading, setError, clearError]
  );

  return {
    fetchTables,
    createTables,
  };
};

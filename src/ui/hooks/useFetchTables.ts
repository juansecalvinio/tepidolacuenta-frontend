import { useCallback } from "react";
import { useTablesContext } from "../contexts/tables.context";
import { getTableRepository } from "../../core/modules/tables/infrastructure/repositories/TableRepositoryFactory";
import { GetTables } from "../../core/modules/tables/use-cases/GetTables";
import { CreateTables } from "../../core/modules/tables/use-cases/CreateTables";
import { useRestaurantContext } from "../contexts/restaurant.context";

export const useFetchTables = () => {
  const { setTables, setLoading, setError, clearError } = useTablesContext();
  const { activeBranch } = useRestaurantContext();
  const repository = getTableRepository();

  const fetchTables = useCallback(async () => {
    if (!activeBranch?.id) {
      setError("No se encontró el ID de la sucursal");
      return { success: false, error: "No se encontró el ID de la sucursal" };
    }

    setLoading(true);
    clearError();

    try {
      const getTablesUseCase = GetTables(repository);
      const response = await getTablesUseCase(activeBranch.id);
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
  }, [activeBranch, repository, setTables, setLoading, setError, clearError]);

  const createTables = useCallback(
    async (count: number, providedBranchId?: string) => {
      // Use provided branchId or fall back to the one from context
      const effectiveBranchId = providedBranchId || activeBranch?.id;

      if (!effectiveBranchId) {
        setError("No se encontró el ID de la sucursal");
        return {
          success: false,
          error: "No se encontró el ID de la sucursal",
        };
      }

      setLoading(true);
      clearError();

      try {
        const createTablesUseCase = CreateTables(repository);
        const response = await createTablesUseCase({
          branchId: effectiveBranchId,
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
    [activeBranch, repository, setTables, setLoading, setError, clearError],
  );

  return {
    fetchTables,
    createTables,
  };
};

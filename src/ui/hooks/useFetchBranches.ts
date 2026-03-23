import { useCallback } from "react";
import { getRestaurantRepository } from "../../core/modules/restaurant/infrastructure/repositories/RestaurantRepositoryFactory";
import { useRestaurantContext } from "../contexts/restaurant.context";
import { GetBranchesByRestaurant } from "../../core/modules/restaurant/use-cases/GetBranchesByRestaurant";
import type { CreateBranchRequest, UpdateBranchRequest } from "../../core/modules/restaurant/domain/models/Restaurant";
import { getErrorMessage } from "../../core/utils/error-messages";
import { CreateBranch } from "../../core/modules/restaurant/use-cases/CreateBranch";
import { UpdateBranch } from "../../core/modules/restaurant/use-cases/UpdateBranch";
import { DeleteBranch } from "../../core/modules/restaurant/use-cases/DeleteBranch";

export const useFetchBranches = () => {
  const {
    activeBranch: currentActiveBranch,
    branches: currentBranches,
    setActiveBranch,
    setBranches,
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
          setBranches(response.data);

          const isCurrentSelectionValid =
            currentActiveBranch !== null &&
            response.data.some((b) => b.id === currentActiveBranch.id);

          if (!isCurrentSelectionValid) {
            const defaultBranch =
              response.data.find((b) => b.isActive) ?? response.data[0] ?? null;
            setActiveBranch(defaultBranch);
            return { success: true, data: response.data, activeBranch: defaultBranch };
          }

          return { success: true, data: response.data, activeBranch: currentActiveBranch };
        } else {
          const errorMessage = getErrorMessage(null, "fetchBranches");
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }
      } catch (err) {
        const errorMessage = getErrorMessage(err, "fetchBranches");
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [repository, currentActiveBranch, setBranches, setActiveBranch, setIsLoading, setHasError, setError],
  );

  const createBranch = useCallback(
    async (body: CreateBranchRequest) => {
      setIsLoading(true);
      setHasError(false);
      setError("");

      try {
        const createBranchUseCase = CreateBranch(repository);
        const response = await createBranchUseCase(body);

        if (response.success) {
          return { success: true, data: response.data };
        } else {
          const errorMessage = getErrorMessage(null, "fetchBranches");
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error, "fetchBranches");
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [repository, setIsLoading, setHasError, setError],
  );

  const updateBranch = useCallback(
    async (branchId: string, body: UpdateBranchRequest) => {
      setIsLoading(true);
      setHasError(false);
      setError("");

      try {
        const updateBranchUseCase = UpdateBranch(repository);
        const response = await updateBranchUseCase(branchId, body);

        if (response.success) {
          const updated = currentBranches?.map((b) =>
            b.id === branchId ? response.data : b,
          ) ?? [];
          setBranches(updated);
          if (currentActiveBranch?.id === branchId) {
            setActiveBranch(response.data);
          }
          return { success: true, data: response.data };
        } else {
          const errorMessage = getErrorMessage(null, "updateBranch");
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }
      } catch (err) {
        const errorMessage = getErrorMessage(err, "updateBranch");
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [repository, currentBranches, currentActiveBranch, setBranches, setActiveBranch, setIsLoading, setHasError, setError],
  );

  const deleteBranch = useCallback(
    async (branchId: string) => {
      setIsLoading(true);
      setHasError(false);
      setError("");

      try {
        const deleteBranchUseCase = DeleteBranch(repository);
        const response = await deleteBranchUseCase(branchId);

        if (response.success) {
          const remaining = currentBranches?.filter((b) => b.id !== branchId) ?? [];
          setBranches(remaining);
          if (currentActiveBranch?.id === branchId) {
            setActiveBranch(remaining[0] ?? null);
          }
          return { success: true };
        } else {
          const errorMessage = getErrorMessage(null, "deleteBranch");
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }
      } catch (err) {
        const errorMessage = getErrorMessage(err, "deleteBranch");
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [repository, currentBranches, currentActiveBranch, setBranches, setActiveBranch, setIsLoading, setHasError, setError],
  );

  return {
    fetchBranchesByRestaurant,
    createBranch,
    updateBranch,
    deleteBranch,
  };
};

import type {
  UpdateBranchRequest,
  UpdateBranchResponse,
} from "../domain/models/Restaurant";
import type { RestaurantRepository } from "../domain/repositories/RestaurantRepository";

export const UpdateBranch = (repository: RestaurantRepository) => {
  return async (
    branchId: string,
    request: UpdateBranchRequest,
  ): Promise<UpdateBranchResponse> => {
    return await repository.updateBranch(branchId, request);
  };
};

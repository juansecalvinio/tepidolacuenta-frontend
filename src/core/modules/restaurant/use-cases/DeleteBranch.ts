import type { DeleteBranchResponse } from "../domain/models/Restaurant";
import type { RestaurantRepository } from "../domain/repositories/RestaurantRepository";

export const DeleteBranch = (repository: RestaurantRepository) => {
  return async (branchId: string): Promise<DeleteBranchResponse> => {
    return await repository.deleteBranch(branchId);
  };
};

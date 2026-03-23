import type {
  CreateBranchRequest,
  CreateBranchResponse,
} from "../domain/models/Restaurant";
import type { RestaurantRepository } from "../domain/repositories/RestaurantRepository";

export const CreateBranch = (repository: RestaurantRepository) => {
  return async (
    request: CreateBranchRequest,
  ): Promise<CreateBranchResponse> => {
    return await repository.createBranch(request);
  };
};

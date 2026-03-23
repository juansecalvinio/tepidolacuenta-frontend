import type {
  CreateBranchRequest,
  CreateBranchResponse,
  CreateRestaurantRequest,
  CreateRestaurantResponse,
  DeleteBranchResponse,
  GetBranchesByRestaurantResponse,
  GetRestaurantByIdResponse,
  GetRestaurantsResponse,
  UpdateBranchRequest,
  UpdateBranchResponse,
} from "../models/Restaurant";

export interface RestaurantRepository {
  createRestaurant(
    request: CreateRestaurantRequest,
  ): Promise<CreateRestaurantResponse>;
  createBranch(request: CreateBranchRequest): Promise<CreateBranchResponse>;
  updateBranch(branchId: string, request: UpdateBranchRequest): Promise<UpdateBranchResponse>;
  deleteBranch(branchId: string): Promise<DeleteBranchResponse>;
  getRestaurants(): Promise<GetRestaurantsResponse>;
  getRestaurantById(restaurantId: string): Promise<GetRestaurantByIdResponse>;
  getBranchesByRestaurant(
    restaurantId: string,
  ): Promise<GetBranchesByRestaurantResponse>;
}

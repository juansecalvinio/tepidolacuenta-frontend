import { api } from "../../../../api/http-client";
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
} from "../../domain/models/Restaurant";
import type { RestaurantRepository } from "../../domain/repositories/RestaurantRepository";

export class ApiRestaurantRepository implements RestaurantRepository {
  async createRestaurant(
    request: CreateRestaurantRequest,
  ): Promise<CreateRestaurantResponse> {
    return await api.post<CreateRestaurantResponse>(
      "/api/v1/setup/restaurant",
      request,
    );
  }

  async createBranch(
    request: CreateBranchRequest,
  ): Promise<CreateBranchResponse> {
    return await api.post<CreateBranchResponse>("/api/v1/branches", request);
  }

  async updateBranch(
    branchId: string,
    request: UpdateBranchRequest,
  ): Promise<UpdateBranchResponse> {
    return await api.put<UpdateBranchResponse>(
      `/api/v1/branches/${branchId}`,
      request,
    );
  }

  async deleteBranch(branchId: string): Promise<DeleteBranchResponse> {
    return await api.delete<DeleteBranchResponse>(
      `/api/v1/branches/${branchId}`,
    );
  }

  async getRestaurants(): Promise<GetRestaurantsResponse> {
    return await api.get<GetRestaurantsResponse>("/api/v1/restaurants");
  }

  async getRestaurantById(
    restaurantId: string,
  ): Promise<GetRestaurantByIdResponse> {
    return await api.get<GetRestaurantByIdResponse>(
      `/api/v1/restaurants/${restaurantId}`,
    );
  }

  async getBranchesByRestaurant(
    restaurantId: string,
  ): Promise<GetBranchesByRestaurantResponse> {
    return await api.get<GetBranchesByRestaurantResponse>(
      `/api/v1/branches/restaurant/${restaurantId}`,
    );
  }
}

import type { Table } from "../../../tables/domain/models/Table";

export interface Restaurant {
  id: string;
  userId: string;
  name: string;
  address: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  restaurantId: string;
  address: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRestaurantRequest {
  name: string;
  cuit: string;
  address: string;
  tableCount: number;
}

export interface CreateRestaurantResponse {
  success: boolean;
  message: string;
  data: CreateRestaurantResponseData;
}

export interface CreateRestaurantResponseData {
  restaurant: Restaurant;
  branch: Branch;
  tables: Table[];
}

export interface GetRestaurantsResponse {
  success: boolean;
  message: string;
  data: Restaurant[];
}

export interface GetRestaurantByIdResponse {
  success: boolean;
  message: string;
  data: Restaurant | null;
}

export interface GetBranchesByRestaurantResponse {
  success: boolean;
  message: string;
  data: Branch[];
}

export interface Restaurant {
  id: string;
  userId: string;
  name: string;
  address: string;
  phone: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRestaurantRequest {
  name: string;
  address?: string;
  phone?: string;
  description?: string;
}

export interface CreateRestaurantResponse {
  success: boolean;
  message: string;
  data: Restaurant;
}

export interface GetRestaurantsResponse {
  success: boolean;
  message: string;
  data: Restaurant[];
}

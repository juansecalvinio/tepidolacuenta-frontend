import type { RestaurantRepository } from "../../domain/repositories/RestaurantRepository";
import { ApiRestaurantRepository } from "./ApiRestaurantRepository";

let instance: RestaurantRepository | null = null;

export const getRestaurantRepository = (): RestaurantRepository => {
  instance ??= new ApiRestaurantRepository();
  return instance;
};

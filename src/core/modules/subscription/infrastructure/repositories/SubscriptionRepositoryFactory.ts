import type { SubscriptionRepository } from "../../domain/repositories/SubscriptionRepository";
import { ApiSubscriptionRepository } from "./ApiSubscriptionRepository";

let instance: SubscriptionRepository | null = null;

export const getSubscriptionRepository = (): SubscriptionRepository => {
  instance ??= new ApiSubscriptionRepository();
  return instance;
};

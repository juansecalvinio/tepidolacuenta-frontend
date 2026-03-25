import type { SubscriptionRepository } from "../../domain/repositories/SubscriptionRepository";
import { ApiSubscriptionRepository } from "./ApiSubscriptionRepository";

export const getSubscriptionRepository = (): SubscriptionRepository => {
  return new ApiSubscriptionRepository();
};

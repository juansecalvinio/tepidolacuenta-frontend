import type {
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  GetPlanByIdResponse,
  GetPlansResponse,
  GetSubscriptionByIdResponse,
  GetSubscriptionByRestaurantResponse,
  GetSubscriptionsResponse,
  UpdateSubscriptionRequest,
  UpdateSubscriptionResponse,
} from "../models/Subscription";

export interface SubscriptionRepository {
  getPlans(): Promise<GetPlansResponse>;
  getPlanById(planId: string): Promise<GetPlanByIdResponse>;
  getSubscriptions(): Promise<GetSubscriptionsResponse>;
  getSubscriptionById(subscriptionId: string): Promise<GetSubscriptionByIdResponse>;
  getSubscriptionByRestaurant(restaurantId: string): Promise<GetSubscriptionByRestaurantResponse>;
  createSubscription(request: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse>;
  updateSubscription(subscriptionId: string, request: UpdateSubscriptionRequest): Promise<UpdateSubscriptionResponse>;
  cancelSubscription(subscriptionId: string): Promise<void>;
}

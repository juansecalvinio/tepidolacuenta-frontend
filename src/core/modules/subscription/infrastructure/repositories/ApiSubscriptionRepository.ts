import { api } from "../../../../api/http-client";
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
} from "../../domain/models/Subscription";
import type { SubscriptionRepository } from "../../domain/repositories/SubscriptionRepository";

export class ApiSubscriptionRepository implements SubscriptionRepository {
  async getPlans(): Promise<GetPlansResponse> {
    return await api.get<GetPlansResponse>("/api/v1/public/plans");
  }

  async getPlanById(planId: string): Promise<GetPlanByIdResponse> {
    return await api.get<GetPlanByIdResponse>(`/api/v1/public/plans/${planId}`);
  }

  async getSubscriptions(): Promise<GetSubscriptionsResponse> {
    return await api.get<GetSubscriptionsResponse>("/api/v1/subscriptions");
  }

  async getSubscriptionById(subscriptionId: string): Promise<GetSubscriptionByIdResponse> {
    return await api.get<GetSubscriptionByIdResponse>(`/api/v1/subscriptions/${subscriptionId}`);
  }

  async getSubscriptionByRestaurant(restaurantId: string): Promise<GetSubscriptionByRestaurantResponse> {
    return await api.get<GetSubscriptionByRestaurantResponse>(
      `/api/v1/subscriptions/restaurant/${restaurantId}`,
    );
  }

  async createSubscription(request: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> {
    return await api.post<CreateSubscriptionResponse>("/api/v1/subscriptions", request);
  }

  async updateSubscription(
    subscriptionId: string,
    request: UpdateSubscriptionRequest,
  ): Promise<UpdateSubscriptionResponse> {
    return await api.put<UpdateSubscriptionResponse>(
      `/api/v1/subscriptions/${subscriptionId}`,
      request,
    );
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    return await api.delete<void>(`/api/v1/subscriptions/${subscriptionId}`);
  }
}

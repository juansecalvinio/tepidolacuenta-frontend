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

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export class ApiSubscriptionRepository implements SubscriptionRepository {
  async getPlans(): Promise<GetPlansResponse> {
    return await api.get<GetPlansResponse>("/api/v1/public/plans");
  }

  async getPlanById(planId: string): Promise<GetPlanByIdResponse> {
    return await api.get<GetPlanByIdResponse>(`/api/v1/public/plans/${planId}`);
  }

  async getSubscriptions(): Promise<GetSubscriptionsResponse> {
    const response = await api.get<ApiEnvelope<GetSubscriptionsResponse>>(
      "/api/v1/subscriptions",
    );
    return response.data;
  }

  async getSubscriptionById(
    subscriptionId: string,
  ): Promise<GetSubscriptionByIdResponse> {
    const response = await api.get<ApiEnvelope<GetSubscriptionByIdResponse>>(
      `/api/v1/subscriptions/${subscriptionId}`,
    );
    return response.data;
  }

  async getSubscriptionByRestaurant(
    restaurantId: string,
  ): Promise<GetSubscriptionByRestaurantResponse> {
    const response = await api.get<
      ApiEnvelope<GetSubscriptionByRestaurantResponse>
    >(`/api/v1/subscriptions/restaurant/${restaurantId}`);
    return response.data;
  }

  async createSubscription(
    request: CreateSubscriptionRequest,
  ): Promise<CreateSubscriptionResponse> {
    const response = await api.post<ApiEnvelope<CreateSubscriptionResponse>>(
      "/api/v1/subscriptions",
      request,
    );
    return response.data;
  }

  async updateSubscription(
    subscriptionId: string,
    request: UpdateSubscriptionRequest,
  ): Promise<UpdateSubscriptionResponse> {
    const response = await api.put<ApiEnvelope<UpdateSubscriptionResponse>>(
      `/api/v1/subscriptions/${subscriptionId}`,
      request,
    );
    return response.data;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    return await api.delete<void>(`/api/v1/subscriptions/${subscriptionId}`);
  }
}

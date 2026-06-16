import { api } from "../../../../api/http-client";
import { unwrap, unwrapMaybe, type ApiEnvelope } from "../../../../api/envelope";
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
    // /public/plans puede venir directo o envuelto → normalizamos a Plan[]
    const response = await api.get<GetPlansResponse | ApiEnvelope<GetPlansResponse>>(
      "/api/v1/public/plans",
    );
    return unwrapMaybe(response);
  }

  async getPlanById(planId: string): Promise<GetPlanByIdResponse> {
    const response = await api.get<
      GetPlanByIdResponse | ApiEnvelope<GetPlanByIdResponse>
    >(`/api/v1/public/plans/${planId}`);
    return unwrapMaybe(response);
  }

  async getSubscriptions(): Promise<GetSubscriptionsResponse> {
    const response = await api.get<ApiEnvelope<GetSubscriptionsResponse>>(
      "/api/v1/subscriptions",
    );
    return unwrap(response);
  }

  async getSubscriptionById(
    subscriptionId: string,
  ): Promise<GetSubscriptionByIdResponse> {
    const response = await api.get<ApiEnvelope<GetSubscriptionByIdResponse>>(
      `/api/v1/subscriptions/${subscriptionId}`,
    );
    return unwrap(response);
  }

  async getSubscriptionByRestaurant(
    restaurantId: string,
  ): Promise<GetSubscriptionByRestaurantResponse> {
    const response = await api.get<
      ApiEnvelope<GetSubscriptionByRestaurantResponse>
    >(`/api/v1/subscriptions/restaurant/${restaurantId}`);
    return unwrap(response);
  }

  async createSubscription(
    request: CreateSubscriptionRequest,
  ): Promise<CreateSubscriptionResponse> {
    const response = await api.post<ApiEnvelope<CreateSubscriptionResponse>>(
      "/api/v1/subscriptions",
      request,
    );
    return unwrap(response);
  }

  async updateSubscription(
    subscriptionId: string,
    request: UpdateSubscriptionRequest,
  ): Promise<UpdateSubscriptionResponse> {
    const response = await api.put<ApiEnvelope<UpdateSubscriptionResponse>>(
      `/api/v1/subscriptions/${subscriptionId}`,
      request,
    );
    return unwrap(response);
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    return await api.delete<void>(`/api/v1/subscriptions/${subscriptionId}`);
  }
}

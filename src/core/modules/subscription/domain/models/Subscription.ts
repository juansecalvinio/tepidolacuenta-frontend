export type ReportsTier = "none" | "included" | "advanced" | "consolidated";

export interface Plan {
  id: string;
  name: string;
  price: number; // ARS mensual
  priceAnnual: number; // ARS anual
  priceUsd: number; // ancla USD mensual
  extraBranchPrice: number; // ARS por sucursal extra; 0 = sin add-on
  extraBranchPriceUsd: number; // ancla USD por sucursal extra
  maxTables: number;
  includedBranches: number;
  maxBranches: number;
  trialDays: number;
  reportsTier: ReportsTier;
}

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "canceled"
  | "expired"
  | "past_due";

export interface Subscription {
  id: string;
  userId: string;
  restaurantId: string;
  planId: string;
  purchasedBranches: number;
  plan?: Plan;
  status: SubscriptionStatus;
  trialStartedAt: string | null;
  trialEndsAt: string | null;
  paymentSubscriptionId: string | null;
}

// Plans
export type GetPlansResponse = Plan[];

export type GetPlanByIdResponse = Plan;

// Subscriptions
export type GetSubscriptionsResponse = Subscription[];

export type GetSubscriptionByIdResponse = Subscription;

export type GetSubscriptionByRestaurantResponse = Subscription;

export interface CreateSubscriptionRequest {
  restaurantId: string;
  planId: string;
  startTrial: boolean;
  paymentSubscriptionId?: string;
}

export type CreateSubscriptionResponse = Subscription;

export interface UpdateSubscriptionRequest {
  planId?: string;
  status?: SubscriptionStatus;
  paymentSubscriptionId?: string;
}

export type UpdateSubscriptionResponse = Subscription;

import { create } from "zustand";
import type { Plan, Subscription } from "../../core/modules/subscription/domain/models/Subscription";

interface SubscriptionContext {
  plans: Plan[];
  subscription: Subscription | null;
  currentPlan: Plan | null;
  isLoading: boolean;
  error: string | null;

  setPlans: (plans: Plan[]) => void;
  setSubscription: (subscription: Subscription | null) => void;
  updateSubscription: (updates: Partial<Subscription>) => void;
  setCurrentPlan: (plan: Plan | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useSubscriptionContext = create<SubscriptionContext>((set) => ({
  plans: [],
  subscription: null,
  currentPlan: null,
  isLoading: false,
  error: null,

  setPlans: (plans) => set({ plans }),
  setSubscription: (subscription) => set({ subscription }),
  updateSubscription: (updates) =>
    set((state) => ({
      subscription: state.subscription ? { ...state.subscription, ...updates } : null,
    })),
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export type { SubscriptionContext };

import { create } from "zustand";
import type { Payment } from "../../core/modules/payment/domain/models/Payment";

interface PaymentContext {
  isLoading: boolean;
  error: string | null;
  paymentHistory: Payment[];

  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setPaymentHistory: (payments: Payment[]) => void;
}

export const usePaymentContext = create<PaymentContext>((set) => ({
  isLoading: false,
  error: null,
  paymentHistory: [],

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setPaymentHistory: (payments) => set({ paymentHistory: payments }),
}));

export type { PaymentContext };

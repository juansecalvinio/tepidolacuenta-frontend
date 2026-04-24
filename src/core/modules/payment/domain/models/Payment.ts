export type PaymentStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface Payment {
  id: string;
  userId: string;
  restaurantId: string;
  planId: string;
  mpPreferenceId: string;
  mpPaymentId: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

// Create preference
export interface CreatePaymentPreferenceRequest {
  planId: string;
  restaurantId: string;
}

export interface CreatePaymentPreferenceResponse {
  success: boolean;
  paymentUrl: string;
  preferenceId: string;
}

// Get payment by id
export type GetPaymentResponse = Payment;

// Get payment history
export type GetPaymentHistoryResponse = Payment[];

// WebSocket message
export interface PaymentApprovedWsMessage {
  type: "payment.approved";
  payment: Omit<Payment, "userId">;
}

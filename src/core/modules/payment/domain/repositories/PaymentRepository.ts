import type {
  CreatePaymentPreferenceRequest,
  CreatePaymentPreferenceResponse,
  GetPaymentHistoryResponse,
  GetPaymentResponse,
} from "../models/Payment";

export interface PaymentRepository {
  createPreference(
    request: CreatePaymentPreferenceRequest,
  ): Promise<CreatePaymentPreferenceResponse>;
  getPayment(paymentId: string): Promise<GetPaymentResponse>;
  getPaymentHistory(restaurantId: string): Promise<GetPaymentHistoryResponse>;
}

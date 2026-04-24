import { api } from "../../../../api/http-client";
import type {
  CreatePaymentPreferenceRequest,
  CreatePaymentPreferenceResponse,
  GetPaymentHistoryResponse,
  GetPaymentResponse,
} from "../../domain/models/Payment";
import type { PaymentRepository } from "../../domain/repositories/PaymentRepository";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export class ApiPaymentRepository implements PaymentRepository {
  async createPreference(
    request: CreatePaymentPreferenceRequest,
  ): Promise<CreatePaymentPreferenceResponse> {
    return await api.post<CreatePaymentPreferenceResponse>(
      "/api/v1/payments/create-preference",
      request,
    );
  }

  async getPayment(paymentId: string): Promise<GetPaymentResponse> {
    const response = await api.get<ApiEnvelope<GetPaymentResponse>>(
      `/api/v1/payments/${paymentId}`,
    );
    return response.data;
  }

  async getPaymentHistory(restaurantId: string): Promise<GetPaymentHistoryResponse> {
    const response = await api.get<ApiEnvelope<GetPaymentHistoryResponse>>(
      `/api/v1/payments/history?restaurantId=${restaurantId}`,
    );
    return response.data;
  }
}

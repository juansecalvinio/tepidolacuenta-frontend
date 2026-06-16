import { api } from "../../../../api/http-client";
import { unwrap, type ApiEnvelope } from "../../../../api/envelope";
import type {
  CreatePaymentPreferenceRequest,
  CreatePaymentPreferenceResponse,
  GetPaymentHistoryResponse,
  GetPaymentResponse,
} from "../../domain/models/Payment";
import type { PaymentRepository } from "../../domain/repositories/PaymentRepository";

export class ApiPaymentRepository implements PaymentRepository {
  async createPreference(
    request: CreatePaymentPreferenceRequest,
  ): Promise<CreatePaymentPreferenceResponse> {
    // Respuesta plana (trae success/paymentUrl/preferenceId en el top level)
    return await api.post<CreatePaymentPreferenceResponse>(
      "/api/v1/payments/create-preference",
      request,
    );
  }

  async getPayment(paymentId: string): Promise<GetPaymentResponse> {
    const response = await api.get<ApiEnvelope<GetPaymentResponse>>(
      `/api/v1/payments/${paymentId}`,
    );
    return unwrap(response);
  }

  async getPaymentHistory(
    restaurantId: string,
  ): Promise<GetPaymentHistoryResponse> {
    const response = await api.get<ApiEnvelope<GetPaymentHistoryResponse>>(
      `/api/v1/payments/history?restaurantId=${restaurantId}`,
    );
    return unwrap(response);
  }
}

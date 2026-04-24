import type {
  CreatePaymentPreferenceRequest,
  CreatePaymentPreferenceResponse,
} from "../domain/models/Payment";
import type { PaymentRepository } from "../domain/repositories/PaymentRepository";

export const CreatePaymentPreference = (repository: PaymentRepository) => {
  return async (
    request: CreatePaymentPreferenceRequest,
  ): Promise<CreatePaymentPreferenceResponse> => {
    return await repository.createPreference(request);
  };
};

import type { GetPaymentResponse } from "../domain/models/Payment";
import type { PaymentRepository } from "../domain/repositories/PaymentRepository";

export const GetPayment = (repository: PaymentRepository) => {
  return async (paymentId: string): Promise<GetPaymentResponse> => {
    return await repository.getPayment(paymentId);
  };
};

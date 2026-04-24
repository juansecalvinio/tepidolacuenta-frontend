import type { GetPaymentHistoryResponse } from "../domain/models/Payment";
import type { PaymentRepository } from "../domain/repositories/PaymentRepository";

export const GetPaymentHistory = (repository: PaymentRepository) => {
  return async (restaurantId: string): Promise<GetPaymentHistoryResponse> => {
    return await repository.getPaymentHistory(restaurantId);
  };
};

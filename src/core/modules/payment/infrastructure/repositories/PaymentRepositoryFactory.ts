import type { PaymentRepository } from "../../domain/repositories/PaymentRepository";
import { ApiPaymentRepository } from "./ApiPaymentRepository";

export const getPaymentRepository = (): PaymentRepository => {
  return new ApiPaymentRepository();
};

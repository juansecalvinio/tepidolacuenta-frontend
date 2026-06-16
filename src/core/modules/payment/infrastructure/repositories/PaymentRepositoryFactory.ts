import type { PaymentRepository } from "../../domain/repositories/PaymentRepository";
import { ApiPaymentRepository } from "./ApiPaymentRepository";

let instance: PaymentRepository | null = null;

export const getPaymentRepository = (): PaymentRepository => {
  instance ??= new ApiPaymentRepository();
  return instance;
};

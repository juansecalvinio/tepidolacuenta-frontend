import type { BillRequestRepository } from "../../domain/repositories/BillRequestRepository";
import { ApiBillRequestRepository } from "./ApiBillRequestRepository";
import { MockBillRequestRepository } from "./MockBillRequestRepository";

let instance: BillRequestRepository | null = null;

export const getBillRequestRepository = (): BillRequestRepository => {
  if (!instance) {
    const useMock = import.meta.env.VITE_USE_MOCK === "true";
    instance = useMock
      ? new MockBillRequestRepository()
      : new ApiBillRequestRepository();
  }
  return instance;
};

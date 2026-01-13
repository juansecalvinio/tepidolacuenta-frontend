import type { BillRequestRepository } from "../../domain/repositories/BillRequestRepository";
import { ApiBillRequestRepository } from "./ApiBillRequestRepository";
import { MockBillRequestRepository } from "./MockBillRequestRepository";

export const getBillRequestRepository = (): BillRequestRepository => {
  const useMock = import.meta.env.VITE_USE_MOCK === "true";
  return useMock
    ? new MockBillRequestRepository()
    : new ApiBillRequestRepository();
};

import type { GetPendingBillRequestsResponse } from "../domain/models/BillRequest";
import type { BillRequestRepository } from "../domain/repositories/BillRequestRepository";

export const GetPendingBillRequests = (repository: BillRequestRepository) => {
  return async (): Promise<GetPendingBillRequestsResponse> => {
    return await repository.getPendingRequests();
  };
};

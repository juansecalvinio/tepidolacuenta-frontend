import type { GetPendingBillRequestsResponse } from "../domain/models/BillRequest";
import type { BillRequestRepository } from "../domain/repositories/BillRequestRepository";

export const GetPendingBillRequests = (repository: BillRequestRepository) => {
  return async (
    restaurandId: string
  ): Promise<GetPendingBillRequestsResponse> => {
    return await repository.getPendingRequests(restaurandId);
  };
};

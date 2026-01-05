import type {
  MarkBillRequestAsAttendedRequest,
  MarkBillRequestAsAttendedResponse,
} from "../domain/models/BillRequest";
import type { BillRequestRepository } from "../domain/repositories/BillRequestRepository";

export const MarkBillRequestAsAttended = (
  repository: BillRequestRepository
) => {
  return async (
    request: MarkBillRequestAsAttendedRequest
  ): Promise<MarkBillRequestAsAttendedResponse> => {
    return await repository.markAsAttended(request);
  };
};

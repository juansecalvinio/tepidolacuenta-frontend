import type {
  GetPendingBillRequestsResponse,
  MarkBillRequestAsAttendedRequest,
  MarkBillRequestAsAttendedResponse,
} from "../models/BillRequest";

export interface BillRequestRepository {
  getPendingRequests(): Promise<GetPendingBillRequestsResponse>;
  markAsAttended(
    request: MarkBillRequestAsAttendedRequest
  ): Promise<MarkBillRequestAsAttendedResponse>;
}

import type { BillRequestRepository } from "../../domain/repositories/BillRequestRepository";
import type {
  GetPendingBillRequestsResponse,
  MarkBillRequestAsAttendedRequest,
  MarkBillRequestAsAttendedResponse,
} from "../../domain/models/BillRequest";
import { api } from "../../../../api/http-client";

export class ApiBillRequestRepository implements BillRequestRepository {
  async getPendingRequests(): Promise<GetPendingBillRequestsResponse> {
    return await api.get<GetPendingBillRequestsResponse>(
      "/api/v1/bill-requests/pending"
    );
  }

  async markAsAttended(
    request: MarkBillRequestAsAttendedRequest
  ): Promise<MarkBillRequestAsAttendedResponse> {
    return await api.patch<MarkBillRequestAsAttendedResponse>(
      `/api/v1/bill-requests/${request.requestId}/attended`,
      {}
    );
  }
}

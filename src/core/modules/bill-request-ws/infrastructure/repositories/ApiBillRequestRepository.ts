import type { BillRequestRepository } from "../../domain/repositories/BillRequestRepository";
import type {
  CreateBillRequestBody,
  CreateBillRequestResponse,
  GetPendingBillRequestsResponse,
  MarkBillRequestAsAttendedRequest,
  MarkBillRequestAsAttendedResponse,
} from "../../domain/models/BillRequest";
import { api } from "../../../../api/http-client";

export class ApiBillRequestRepository implements BillRequestRepository {
  async getPendingRequests(
    restaurantId: string
  ): Promise<GetPendingBillRequestsResponse> {
    return await api.get<GetPendingBillRequestsResponse>(
      `/api/v1/requests/restaurant/${restaurantId}/pending`
    );
  }

  async markAsAttended(
    request: MarkBillRequestAsAttendedRequest
  ): Promise<MarkBillRequestAsAttendedResponse> {
    return await api.put<MarkBillRequestAsAttendedResponse>(
      `/api/v1/requests/${request.requestId}/status`,
      {
        status: "attended",
      }
    );
  }

  async createBillRequest(
    body: CreateBillRequestBody
  ): Promise<CreateBillRequestResponse> {
    return await api.post("/api/v1/public/request-account", body);
  }
}

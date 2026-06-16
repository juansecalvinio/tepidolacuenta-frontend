import type { BillRequestRepository } from "../../domain/repositories/BillRequestRepository";
import type {
  CreateBillRequestBody,
  CreateBillRequestResponse,
  GetPendingBillRequestsResponse,
  GetVenueInfoResponse,
  MarkBillRequestAsAttendedRequest,
  MarkBillRequestAsAttendedResponse,
  VenueInfoParams,
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

  async getVenueInfo(
    params: VenueInfoParams
  ): Promise<GetVenueInfoResponse> {
    const query = new URLSearchParams({
      r: params.restaurantId,
      b: params.branchId,
      t: params.tableId,
      n: String(params.tableNumber),
      h: params.hash,
    });
    return await api.get<GetVenueInfoResponse>(
      `/api/v1/public/venue-info?${query.toString()}`
    );
  }
}

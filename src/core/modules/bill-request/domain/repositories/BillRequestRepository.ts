import type {
  CreateBillRequestBody,
  CreateBillRequestResponse,
  GetPendingBillRequestsResponse,
  GetVenueInfoResponse,
  MarkBillRequestAsAttendedRequest,
  MarkBillRequestAsAttendedResponse,
  VenueInfoParams,
} from "../models/BillRequest";

export interface BillRequestRepository {
  getPendingRequests(
    restaurantId: string
  ): Promise<GetPendingBillRequestsResponse>;
  markAsAttended(
    request: MarkBillRequestAsAttendedRequest
  ): Promise<MarkBillRequestAsAttendedResponse>;
  createBillRequest(
    body: CreateBillRequestBody
  ): Promise<CreateBillRequestResponse>;
  getVenueInfo(params: VenueInfoParams): Promise<GetVenueInfoResponse>;
}

import type {
  CreateBillRequestBody,
  CreateBillRequestResponse,
  GetPendingBillRequestsResponse,
  MarkBillRequestAsAttendedRequest,
  MarkBillRequestAsAttendedResponse,
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
}

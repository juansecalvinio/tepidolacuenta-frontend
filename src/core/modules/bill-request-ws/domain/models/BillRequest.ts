export interface BillRequest {
  id: string;
  tableId: string;
  tableNumber: number;
  restaurantId: string;
  status: BillRequestStatus;
  createdAt: string;
  updatedAt?: string;
}

export type BillRequestStatus = "pending" | "attended" | "cancelled";

export interface GetPendingBillRequestsResponse {
  success: boolean;
  message: string;
  data: BillRequest[];
}

export interface MarkBillRequestAsAttendedRequest {
  requestId: string;
}

export interface MarkBillRequestAsAttendedResponse {
  request: BillRequest;
}

export interface CreateBillRequestBody {
  restaurantId: string;
  tableId: string;
  tableNumber: number;
  hash: string;
}

export interface CreateBillRequestResponse {
  success: boolean;
  message: string;
  data: BillRequest;
}

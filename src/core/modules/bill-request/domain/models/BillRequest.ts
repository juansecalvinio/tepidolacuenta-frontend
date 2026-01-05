export interface BillRequest {
  id: string;
  tableId: string;
  tableNumber: number;
  restaurantId: string;
  status: "pending" | "attended";
  createdAt: string;
  attendedAt?: string;
}

export interface GetPendingBillRequestsResponse {
  requests: BillRequest[];
}

export interface MarkBillRequestAsAttendedRequest {
  requestId: string;
}

export interface MarkBillRequestAsAttendedResponse {
  request: BillRequest;
}

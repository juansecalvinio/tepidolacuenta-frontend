export interface BillRequest {
  id: string;
  tableId: string;
  tableNumber: number;
  restaurantId: string;
  status: BillRequestStatus;
  paymentMethod: PaymentMethod;
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

export type PaymentMethod = "cash" | "debit_card" | "credit_card";

export interface CreateBillRequestBody {
  restaurantId: string;
  branchId: string;
  tableId: string;
  tableNumber: number;
  hash: string;
  paymentMethod: PaymentMethod;
}

export interface CreateBillRequestResponse {
  success: boolean;
  message: string;
  data: BillRequest;
}

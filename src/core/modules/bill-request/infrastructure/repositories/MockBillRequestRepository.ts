import type { BillRequestRepository } from "../../domain/repositories/BillRequestRepository";
import type {
  GetPendingBillRequestsResponse,
  MarkBillRequestAsAttendedRequest,
  MarkBillRequestAsAttendedResponse,
  BillRequest,
} from "../../domain/models/BillRequest";

let mockRequests: BillRequest[] = [
  {
    id: "req-1",
    tableId: "table-3",
    tableNumber: 3,
    restaurantId: "restaurant-1",
    status: "pending",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "req-2",
    tableId: "table-7",
    tableNumber: 7,
    restaurantId: "restaurant-1",
    status: "pending",
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
];

export class MockBillRequestRepository implements BillRequestRepository {
  async getPendingRequests(): Promise<GetPendingBillRequestsResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const pendingRequests = mockRequests.filter(
      (req) => req.status === "pending"
    );
    return { requests: pendingRequests };
  }

  async markAsAttended(
    request: MarkBillRequestAsAttendedRequest
  ): Promise<MarkBillRequestAsAttendedResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const billRequest = mockRequests.find(
      (req) => req.id === request.requestId
    );

    if (!billRequest) {
      throw new Error("Bill request not found");
    }

    billRequest.status = "attended";
    billRequest.attendedAt = new Date().toISOString();

    return { request: billRequest };
  }
}

import type { BillRequestRepository } from "../../domain/repositories/BillRequestRepository";
import type {
  GetPendingBillRequestsResponse,
  MarkBillRequestAsAttendedRequest,
  MarkBillRequestAsAttendedResponse,
  BillRequest,
  CreateBillRequestResponse,
} from "../../domain/models/BillRequest";
import { mockDelay } from "../../../../api/mock-client";

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

const mockRequestResponse: CreateBillRequestResponse = {
  success: true,
  message: "Request created successfully",
  data: {
    id: "64a7fbcd12345678901234",
    restaurantId: "64a7f9abc12345678901234",
    tableId: "64a7fabc12345678901234",
    tableNumber: 5,
    status: "pending",
    createdAt: "2026-01-02T12:25:00Z",
    updatedAt: "2026-01-02T12:25:00Z",
  },
};

export class MockBillRequestRepository implements BillRequestRepository {
  async getPendingRequests(): Promise<GetPendingBillRequestsResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const pendingRequests = mockRequests.filter(
      (req) => req.status === "pending"
    );
    return {
      success: true,
      message: "Solicitudes obtenidas correctamente",
      data: pendingRequests,
    };
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
    billRequest.updatedAt = new Date().toISOString();

    return { request: billRequest };
  }

  async createBillRequest(): Promise<CreateBillRequestResponse> {
    await mockDelay(2000);
    return mockRequestResponse;
  }
}

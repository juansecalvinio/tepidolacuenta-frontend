import type { TableRepository } from "../../domain/repositories/TableRepository";
import type {
  CreateTablesRequest,
  CreateTablesResponse,
  GetTablesResponse,
} from "../../domain/models/Table";

export class MockTableRepository implements TableRepository {
  async createTables(
    request: CreateTablesRequest
  ): Promise<CreateTablesResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const tables = Array.from({ length: request.count }, (_, i) => ({
      id: `table-${i + 1}`,
      restaurantId: request.restaurantId,
      number: i + 1,
      capacity: 4,
      qrCode: `http://localhost:5173/request?r=${
        request.restaurantId
      }&t=table-${i + 1}&n=${i + 1}&h=mock-hash`,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return {
      success: true,
      message: "Tables created successfully",
      data: tables,
    };
  }

  async getTables(_restaurantId: string): Promise<GetTablesResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return empty array to simulate no tables created yet
    return {
      success: true,
      message: "Tables retrieved successfully",
      data: [],
    };
  }
}

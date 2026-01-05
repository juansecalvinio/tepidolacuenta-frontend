import { api } from "../../../../api/http-client";
import type {
  CreateTablesRequest,
  CreateTablesResponse,
  GetTablesResponse,
} from "../../domain/models/Table";
import type { TableRepository } from "../../domain/repositories/TableRepository";

export class ApiTableRepository implements TableRepository {
  async createTables(
    request: CreateTablesRequest
  ): Promise<CreateTablesResponse> {
    return await api.post<CreateTablesResponse>("/api/v1/tables/bulk", request);
  }

  async getTables(restaurantId: string): Promise<GetTablesResponse> {
    return await api.get<GetTablesResponse>(
      `/api/v1/tables/restaurant/${restaurantId}`
    );
  }
}

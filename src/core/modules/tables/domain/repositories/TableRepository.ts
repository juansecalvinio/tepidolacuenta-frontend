import type {
  CreateTablesRequest,
  CreateTablesResponse,
  GetTablesResponse,
} from "../models/Table";

export interface TableRepository {
  createTables(request: CreateTablesRequest): Promise<CreateTablesResponse>;
  getTables(restaurantId: string): Promise<GetTablesResponse>;
}

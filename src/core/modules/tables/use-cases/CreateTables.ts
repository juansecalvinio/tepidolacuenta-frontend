import type {
  CreateTablesRequest,
  CreateTablesResponse,
} from "../domain/models/Table";
import type { TableRepository } from "../domain/repositories/TableRepository";

export const CreateTables = (repository: TableRepository) => {
  return async (
    request: CreateTablesRequest
  ): Promise<CreateTablesResponse> => {
    return await repository.createTables(request);
  };
};

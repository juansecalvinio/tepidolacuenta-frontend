import type { GetTablesResponse } from "../domain/models/Table";
import type { TableRepository } from "../domain/repositories/TableRepository";

export const GetTables = (repository: TableRepository) => {
  return async (restaurantId: string): Promise<GetTablesResponse> => {
    return await repository.getTables(restaurantId);
  };
};

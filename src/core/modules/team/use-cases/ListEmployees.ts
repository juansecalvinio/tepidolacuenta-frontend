import type { TeamRepository } from "../domain/repositories/TeamRepository";
import type { ListEmployeesResponse } from "../domain/models/Team";

export function ListEmployees(repository: TeamRepository) {
  return async function (
    restaurantId: string,
  ): Promise<ListEmployeesResponse> {
    return await repository.listEmployees(restaurantId);
  };
}

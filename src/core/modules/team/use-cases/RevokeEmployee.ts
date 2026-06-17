import type { TeamRepository } from "../domain/repositories/TeamRepository";
import type { RevokeEmployeeResponse } from "../domain/models/Team";

export function RevokeEmployee(repository: TeamRepository) {
  return async function (
    restaurantId: string,
    employeeId: string,
  ): Promise<RevokeEmployeeResponse> {
    return await repository.revokeEmployee(restaurantId, employeeId);
  };
}

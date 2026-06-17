import { api } from "../../../../api/http-client";
import type {
  ListEmployeesResponse,
  RevokeEmployeeResponse,
} from "../../domain/models/Team";
import type { TeamRepository } from "../../domain/repositories/TeamRepository";

export const ApiTeamRepository: TeamRepository = {
  async listEmployees(restaurantId: string): Promise<ListEmployeesResponse> {
    return await api.get<ListEmployeesResponse>(
      `/api/v1/team/${restaurantId}/employees`,
    );
  },

  async revokeEmployee(
    restaurantId: string,
    employeeId: string,
  ): Promise<RevokeEmployeeResponse> {
    return await api.delete<RevokeEmployeeResponse>(
      `/api/v1/team/${restaurantId}/employees/${employeeId}`,
    );
  },
};

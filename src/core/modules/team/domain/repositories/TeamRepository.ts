import type {
  ListEmployeesResponse,
  RevokeEmployeeResponse,
} from "../models/Team";

export interface TeamRepository {
  listEmployees: (restaurantId: string) => Promise<ListEmployeesResponse>;
  revokeEmployee: (
    restaurantId: string,
    employeeId: string,
  ) => Promise<RevokeEmployeeResponse>;
}

import type { User } from "../../../auth/domain/models/User";

// Un empleado es un usuario con rol "employee" vinculado a un restaurante.
export type Employee = User;

export interface ListEmployeesResponse {
  success: boolean;
  message: string;
  data: Employee[];
}

export interface RevokeEmployeeResponse {
  success: boolean;
  message: string;
  data?: null;
}

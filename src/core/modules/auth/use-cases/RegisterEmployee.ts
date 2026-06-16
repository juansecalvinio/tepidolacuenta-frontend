import type { AuthRepository } from "../domain/repositories/AuthRepository";
import type { RegisterEmployeeRequest, RegisterEmployeeResponse } from "../domain/models/Auth";

export function RegisterEmployee(repository: AuthRepository) {
  return async function (user: RegisterEmployeeRequest): Promise<RegisterEmployeeResponse> {
    return await repository.registerEmployee(user);
  };
}

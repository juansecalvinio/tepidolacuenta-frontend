import type { AuthRepository } from "../domain/repositories/AuthRepository";
import type { RegisterRequest, RegisterResponse } from "../domain/models/Auth";

export function Register(repository: AuthRepository) {
  return async function (user: RegisterRequest): Promise<RegisterResponse> {
    return await repository.register(user);
  };
}

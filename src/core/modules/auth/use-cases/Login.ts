import type { AuthRepository } from "../domain/repositories/AuthRepository";
import type { LoginRequest, LoginResponse } from "../domain/models/Auth";

export function Login(repository: AuthRepository) {
  return async function (user: LoginRequest): Promise<LoginResponse> {
    return await repository.login(user);
  };
}

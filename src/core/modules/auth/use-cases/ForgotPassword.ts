import type { AuthRepository } from "../domain/repositories/AuthRepository";
import type { ForgotPasswordRequest, ForgotPasswordResponse } from "../domain/models/Auth";

export function ForgotPassword(repository: AuthRepository) {
  return async function (request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return await repository.forgotPassword(request);
  };
}

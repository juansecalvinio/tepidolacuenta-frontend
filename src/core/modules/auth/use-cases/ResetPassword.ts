import type { AuthRepository } from "../domain/repositories/AuthRepository";
import type { ResetPasswordRequest, ResetPasswordResponse } from "../domain/models/Auth";

export function ResetPassword(repository: AuthRepository) {
  return async function (request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return await repository.resetPassword(request);
  };
}

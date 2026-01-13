import type { AuthRepository } from "../../domain/repositories/AuthRepository";
import { ApiAuthRepository } from "../repositories/ApiAuthRepository";
import { MockAuthRepository } from "../repositories/MockAuthRepository";

export const getAuthRepository = (): AuthRepository => {
  const mode = import.meta.env.MODE;
  const useMocks = mode === "none";

  if (useMocks) {
    return MockAuthRepository;
  }

  return ApiAuthRepository;
};

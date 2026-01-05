import { api } from "../../../../api/http-client";
import type {
  RegisterResponse,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
} from "../../domain/models/Auth";
import type { AuthRepository } from "../../domain/repositories/AuthRepository";

export const ApiAuthRepository: AuthRepository = {
  async register(user: RegisterRequest): Promise<RegisterResponse> {
    return await api.post<RegisterResponse>("/api/v1/auth/register", user);
  },

  async login(user: LoginRequest): Promise<LoginResponse> {
    return await api.post<LoginResponse>("/api/v1/auth/login", user);
  },
};

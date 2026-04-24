import { api } from "../../../../api/http-client";
import type {
  RegisterResponse,
  RegisterRequest,
  RegisterEmployeeRequest,
  RegisterEmployeeResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../../domain/models/Auth";
import type { AuthRepository } from "../../domain/repositories/AuthRepository";

export const ApiAuthRepository: AuthRepository = {
  async register(user: RegisterRequest): Promise<RegisterResponse> {
    return await api.post<RegisterResponse>("/api/v1/auth/register", user);
  },

  async registerEmployee(user: RegisterEmployeeRequest): Promise<RegisterEmployeeResponse> {
    return await api.post<RegisterEmployeeResponse>("/api/v1/auth/register/employee", user);
  },

  async login(user: LoginRequest): Promise<LoginResponse> {
    return await api.post<LoginResponse>("/api/v1/auth/login", user);
  },

  async forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return await api.post<ForgotPasswordResponse>("/api/v1/auth/forgot-password", request);
  },

  async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return await api.post<ResetPasswordResponse>("/api/v1/auth/reset-password", request);
  },
};

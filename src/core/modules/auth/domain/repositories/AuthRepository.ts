import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../models/Auth";

export interface AuthRepository {
  register: (user: RegisterRequest) => Promise<RegisterResponse>;
  login: (user: LoginRequest) => Promise<LoginResponse>;
  forgotPassword: (request: ForgotPasswordRequest) => Promise<ForgotPasswordResponse>;
  resetPassword: (request: ResetPasswordRequest) => Promise<ResetPasswordResponse>;
}

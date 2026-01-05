import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../models/Auth";

export interface AuthRepository {
  register: (user: RegisterRequest) => Promise<RegisterResponse>;
  login: (user: LoginRequest) => Promise<LoginResponse>;
}

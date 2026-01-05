import { mockDelay } from "../../../../api/mock-client";
import type { AuthRepository } from "../../domain/repositories/AuthRepository";
import type { LoginResponse, RegisterResponse } from "../../domain/models/Auth";
import mockRegisterResponse from "../mocks/register-response.json";
import mockLoginResponse from "../mocks/login-response.json";

export const MockAuthRepository: AuthRepository = {
  register: async function (): Promise<RegisterResponse> {
    await mockDelay();
    return Promise.resolve(mockRegisterResponse as RegisterResponse);
  },
  login: async function (): Promise<LoginResponse> {
    await mockDelay();
    return Promise.resolve(mockLoginResponse as LoginResponse);
  },
};

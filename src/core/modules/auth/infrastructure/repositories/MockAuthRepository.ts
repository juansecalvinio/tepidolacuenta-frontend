import { mockDelay } from "../../../../api/mock-client";
import type { AuthRepository } from "../../domain/repositories/AuthRepository";
import type {
  LoginResponse,
  RegisterResponse,
  RegisterEmployeeResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
} from "../../domain/models/Auth";
import mockRegisterResponse from "../mocks/register-response.json";
import mockLoginResponse from "../mocks/login-response.json";

export const MockAuthRepository: AuthRepository = {
  register: async function (): Promise<RegisterResponse> {
    await mockDelay();
    return Promise.resolve(mockRegisterResponse as RegisterResponse);
  },
  registerEmployee: async function (): Promise<RegisterEmployeeResponse> {
    await mockDelay();
    return Promise.resolve({
      success: true,
      message: "Empleado registrado correctamente.",
      data: {
        token: "mock-employee-token",
        user: {
          id: "mock-employee-id",
          email: "empleado@mock.com",
          role: "employee",
          restaurantId: "mock-restaurant-id",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    });
  },
  login: async function (): Promise<LoginResponse> {
    await mockDelay();
    return Promise.resolve(mockLoginResponse as LoginResponse);
  },
  forgotPassword: async function (): Promise<ForgotPasswordResponse> {
    await mockDelay();
    return Promise.resolve({ success: true, message: "Si el email existe, recibirás un correo en los próximos minutos." });
  },
  resetPassword: async function (): Promise<ResetPasswordResponse> {
    await mockDelay();
    return Promise.resolve({ success: true, message: "Contraseña actualizada correctamente." });
  },
};

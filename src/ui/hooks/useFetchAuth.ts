import { useCallback } from "react";
import { useAuthContext } from "../contexts/auth.context";
import { Login } from "../../core/modules/auth/use-cases/Login";
import { Register } from "../../core/modules/auth/use-cases/Register";
import { RegisterEmployee } from "../../core/modules/auth/use-cases/RegisterEmployee";
import { ForgotPassword } from "../../core/modules/auth/use-cases/ForgotPassword";
import { ResetPassword } from "../../core/modules/auth/use-cases/ResetPassword";
import { getAuthRepository } from "../../core/modules/auth/infrastructure/factories/AuthRepositoryFactory";
import { getRestaurantRepository } from "../../core/modules/restaurant/infrastructure/repositories/RestaurantRepositoryFactory";
import { GetRestaurants } from "../../core/modules/restaurant/use-cases/GetRestaurants";
import type {
  LoginRequest,
  RegisterRequest,
  RegisterEmployeeRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../../core/modules/auth/domain/models/Auth";
import { getErrorMessage } from "../../core/utils/error-messages";

export const useFetchAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    setAuth,
    setLoading,
    setError,
    logout: logoutContext,
    clearError,
  } = useAuthContext();

  const authRepository = getAuthRepository();
  const restaurantRepository = getRestaurantRepository();

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        setLoading(true);
        clearError();

        const loginUseCase = Login(authRepository);
        const response = await loginUseCase(credentials);

        if (response.success) {
          sessionStorage.setItem("auth-token", response.data.token);
          const { user, token } = response.data;

          if (user.role === "employee") {
            // Employee: restaurantId comes from the user object returned by the API
            setAuth(user, token, user.restaurantId);
          } else {
            // Owner: fetch restaurants to get restaurantId
            try {
              const getRestaurantsUseCase = GetRestaurants(restaurantRepository);
              const restaurantsResponse = await getRestaurantsUseCase();
              const restaurantId =
                restaurantsResponse.data.length > 0
                  ? restaurantsResponse.data[0].id
                  : undefined;
              setAuth(user, token, restaurantId);
            } catch {
              setAuth(user, token);
            }
          }

          return { success: true, message: response.message };
        } else {
          const errorMessage = getErrorMessage(null, "login");
          setError(errorMessage);
          return { success: false, message: errorMessage };
        }
      } catch (err) {
        const errorMessage = getErrorMessage(err, "login");
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [
      authRepository,
      restaurantRepository,
      setAuth,
      setLoading,
      setError,
      clearError,
    ],
  );

  const register = useCallback(
    async (userData: RegisterRequest) => {
      try {
        setLoading(true);
        clearError();

        const registerUseCase = Register(authRepository);
        const response = await registerUseCase(userData);

        if (response.success) {
          // After successful registration, user might want to login automatically
          // or redirect to login page - adjust based on your needs
          if (response.data) {
            // TODO: create restaurant with username as restaurant name
          }

          return {
            success: true,
            message: response.message,
            data: response.data,
          };
        } else {
          const errorMessage = getErrorMessage(null, "register");
          setError(errorMessage);
          return { success: false, message: errorMessage };
        }
      } catch (err) {
        const errorMessage = getErrorMessage(err, "register");
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [authRepository, setLoading, setError, clearError],
  );

  const forgotPassword = useCallback(
    async (request: ForgotPasswordRequest) => {
      try {
        setLoading(true);
        clearError();

        const forgotPasswordUseCase = ForgotPassword(authRepository);
        const response = await forgotPasswordUseCase(request);

        if (response.success) {
          return { success: true, message: response.message };
        } else {
          const errorMessage = getErrorMessage(null, "forgotPassword");
          setError(errorMessage);
          return { success: false, message: errorMessage };
        }
      } catch (err) {
        const errorMessage = getErrorMessage(err, "forgotPassword");
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [authRepository, setLoading, setError, clearError],
  );

  const resetPassword = useCallback(
    async (request: ResetPasswordRequest) => {
      try {
        setLoading(true);
        clearError();

        const resetPasswordUseCase = ResetPassword(authRepository);
        const response = await resetPasswordUseCase(request);

        if (response.success) {
          return { success: true, message: response.message };
        } else {
          const errorMessage = getErrorMessage(null, "resetPassword");
          setError(errorMessage);
          return { success: false, message: errorMessage };
        }
      } catch (err) {
        const errorMessage = getErrorMessage(err, "resetPassword");
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [authRepository, setLoading, setError, clearError],
  );

  const registerEmployee = useCallback(
    async (userData: RegisterEmployeeRequest) => {
      try {
        setLoading(true);
        clearError();

        const registerEmployeeUseCase = RegisterEmployee(authRepository);
        const response = await registerEmployeeUseCase(userData);

        if (response.success) {
          sessionStorage.setItem("auth-token", response.data.token);
          setAuth(response.data.user, response.data.token, response.data.user.restaurantId);
          return { success: true, message: response.message };
        } else {
          const errorMessage = getErrorMessage(null, "register");
          setError(errorMessage);
          return { success: false, message: errorMessage };
        }
      } catch (err) {
        const errorMessage = getErrorMessage(err, "register");
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [authRepository, setAuth, setLoading, setError, clearError],
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem("auth-token");
    logoutContext();
  }, [logoutContext]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    registerEmployee,
    forgotPassword,
    resetPassword,
    logout,
    clearError,
  };
};

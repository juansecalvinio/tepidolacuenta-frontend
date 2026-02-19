import { useCallback } from "react";
import { useAuthContext } from "../contexts/auth.context";
import { Login } from "../../core/modules/auth/use-cases/Login";
import { Register } from "../../core/modules/auth/use-cases/Register";
import { getAuthRepository } from "../../core/modules/auth/infrastructure/factories/AuthRepositoryFactory";
import { getRestaurantRepository } from "../../core/modules/restaurant/infrastructure/repositories/RestaurantRepositoryFactory";
import { GetRestaurants } from "../../core/modules/restaurant/use-cases/GetRestaurants";
import type {
  LoginRequest,
  RegisterRequest,
} from "../../core/modules/auth/domain/models/Auth";

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

        //
        if (response.success) {
          // Save token to sessionStorage
          sessionStorage.setItem("auth-token", response.data.token);

          // After login, fetch user's restaurant to get restaurantId
          try {
            const getRestaurantsUseCase = GetRestaurants(restaurantRepository);
            const restaurantsResponse = await getRestaurantsUseCase();

            // Assume user has at least one restaurant (first one)
            const restaurantId =
              restaurantsResponse.data.length > 0
                ? restaurantsResponse.data[0].id
                : null;

            setAuth(
              response.data.user,
              response.data.token,
              restaurantId || undefined,
            );
          } catch {
            // If fetching restaurant fails, still login but without restaurantId
            setAuth(response.data.user, response.data.token);
          }

          return { success: true, message: response.message };
        } else {
          setError(response.message || "Login failed");
          return { success: false, message: response.message };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred during login";
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
          setError(response.message || "Registration failed");
          return { success: false, message: response.message };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred during registration";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [authRepository, setLoading, setError, clearError],
  );

  const logout = useCallback(() => {
    // Clear token from sessionStorage
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
    logout,
    clearError,
  };
};

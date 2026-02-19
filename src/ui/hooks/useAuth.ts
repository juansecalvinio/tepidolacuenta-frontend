import { useAuthContext } from "../contexts/auth.context";

/**
 * Hook simple para acceder al estado de autenticación
 * sin la lógica de fetching (login/register)
 */
export const useAuth = () => {
  const { user, token, restaurantId, branchId, isAuthenticated, logout } =
    useAuthContext();

  return {
    user,
    token,
    restaurantId,
    branchId,
    isAuthenticated,
    logout,
  };
};

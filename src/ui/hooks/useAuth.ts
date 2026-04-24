import { useAuthContext } from "../contexts/auth.context";

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
    isOwner: user?.role === "owner",
    isEmployee: user?.role === "employee",
  };
};

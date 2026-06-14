import { useAuthContext } from "../contexts/auth.context";

// Selectores por campo: el componente sólo re-renderiza si cambia el campo que usa.
export const useAuth = () => {
  const user = useAuthContext((s) => s.user);
  const token = useAuthContext((s) => s.token);
  const restaurantId = useAuthContext((s) => s.restaurantId);
  const branchId = useAuthContext((s) => s.branchId);
  const isAuthenticated = useAuthContext((s) => s.isAuthenticated);
  const logout = useAuthContext((s) => s.logout);

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

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth.context";
import { GetRestaurants } from "../../../core/modules/restaurant/use-cases/GetRestaurants";
import { getRestaurantRepository } from "../../../core/modules/restaurant/infrastructure/repositories/RestaurantRepositoryFactory";
import type { User, UserRole } from "../../../core/modules/auth/domain/models/User";

function decodeJwtPayload(token: string): Record<string, unknown> {
  const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
}

export const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthContext();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login?error=google_auth_failed");
      return;
    }

    const handleCallback = async () => {
      try {
        const payload = decodeJwtPayload(token);
        const role = (payload.role as UserRole) || "owner";

        const user: User = {
          id: (payload.userId as string) || (payload.id as string),
          email: payload.email as string,
          role,
          restaurantId: payload.restaurantId as string | undefined,
          createdAt: (payload.createdAt as string) || new Date().toISOString(),
          updatedAt: (payload.updatedAt as string) || new Date().toISOString(),
        };

        sessionStorage.setItem("auth-token", token);

        if (role === "employee") {
          setAuth(user, token, user.restaurantId);
          navigate("/dashboard");
          return;
        }

        // Owner: fetch restaurants to get restaurantId
        const restaurantRepository = getRestaurantRepository();
        const getRestaurantsUseCase = GetRestaurants(restaurantRepository);

        let restaurantId: string | undefined;
        try {
          const restaurantsResponse = await getRestaurantsUseCase();
          restaurantId =
            restaurantsResponse.data.length > 0
              ? restaurantsResponse.data[0].id
              : undefined;
        } catch {
          // proceed without restaurantId — new owner with no restaurant yet
        }

        setAuth(user, token, restaurantId);

        if (restaurantId) {
          navigate("/dashboard");
        } else {
          // Nuevo usuario OAuth: elige si quiere registrar su negocio o ingresar como empleado
          navigate("/register/role", { state: { isOAuth: true } });
        }
      } catch {
        navigate("/login?error=google_auth_failed");
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="flex flex-col items-center gap-3">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="text-sm text-base-content/60">
          Iniciando sesión con Google...
        </p>
      </div>
    </div>
  );
};

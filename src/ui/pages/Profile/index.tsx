import { useAuth } from "../../hooks/useAuth";
import { useRestaurants } from "../../hooks/useRestaurants";

export const Profile = () => {
  const { user } = useAuth();
  const { restaurant } = useRestaurants();

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Tu perfil</h2>

      <div className="bg-base-100 border-2 border-base-300 rounded-xl overflow-hidden">
        {/* Avatar + email */}
        <div className="p-4 flex items-center gap-4 border-b border-base-300">
          <div className="avatar avatar-placeholder shrink-0">
            <div className="bg-base-300 border-2 border-base-300 w-12 rounded-full">
              <span className="text-base font-semibold">
                {user?.email.substring(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-base-content/40 uppercase tracking-wider mb-0.5">
              Email
            </p>
            <p className="text-base font-medium break-all leading-snug">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Nombre del local */}
        <div className="p-4">
          <p className="text-xs text-base-content/40 uppercase tracking-wider mb-1">
            Nombre del local
          </p>
          <p className="text-base font-semibold">{restaurant?.name}</p>
        </div>
      </div>
    </div>
  );
};

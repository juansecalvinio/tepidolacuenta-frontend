import { useAuth } from "../../hooks/useAuth";
import { useRestaurants } from "../../hooks/useRestaurants";

export const Profile = () => {
  const { user } = useAuth();
  const { restaurant } = useRestaurants();

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Información de tu perfil</h2>

      <div className="bg-base-100 border-2 border-base-300 p-4 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="avatar avatar-online avatar-placeholder">
            <div className="bg-base-300 border-base-300 border-2 w-12 rounded-full">
              <span>{user?.email.substring(0, 2).toUpperCase()}</span>
            </div>
          </div>

          <p className="text-lg">{user?.email}</p>
        </div>

        <div className="flex items-center justify-between gap-4 mt-8">
          <p className="text-lg text-neutral-400">Nombre del local:</p>
          <p className="text-lg">{restaurant?.name}</p>
        </div>
      </div>
    </div>
  );
};

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useRestaurants } from "../../hooks/useRestaurants";

export const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { restaurant, activeBranch } = useRestaurants();

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-4 flex flex-col md:flex-row justify-between md:items-start gap-2">
        <button
          className="btn btn-soft btn-sm w-fit mb-4"
          onClick={() => navigate("/dashboard")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Dashboard
        </button>
        <h2 className="text-2xl font-bold">Información de tu perfil</h2>
      </div>

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

        <div className="flex items-center justify-between gap-4 mt-4">
          <p className="text-lg text-neutral-400">Sucursal activa:</p>
          <p className="text-lg">{activeBranch?.address}</p>
        </div>
      </div>
    </div>
  );
};

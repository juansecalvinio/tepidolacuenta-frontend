import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="text-center max-w-2xl w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6">
          Llegó una nueva forma de pedir la cuenta
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-base-content/70 mb-6 sm:mb-8 px-2">
          Sistema de solicitud de cuenta para restaurantes. Gestiona las
          solicitudes de tus clientes en tiempo real.
        </p>
        <button
          onClick={handleGetStarted}
          className="btn btn-neutral btn-md sm:btn-lg"
        >
          {isAuthenticated ? "Ir al Dashboard" : "Comenzar"}
        </button>
      </div>
    </div>
  );
};

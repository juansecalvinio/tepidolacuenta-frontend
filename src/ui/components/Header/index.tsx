import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ToggleTheme } from "../ToggleTheme";

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  const showToggleTheme = false;

  return (
    <header className="max-w-2xl mx-auto border-b border-neutral-100">
      <div className="p-3 sm:p-4 flex justify-between items-center gap-2">
        <h1
          className="text-xl sm:text-2xl font-extrabold tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleLogoClick}
        >
          tepidolacuenta
        </h1>
        <div className="flex items-center gap-2 sm:gap-4">
          {showToggleTheme && <ToggleTheme />}
          <button
            className="btn btn-soft btn-sm sm:btn-md"
            onClick={handleAuthClick}
          >
            {isAuthenticated ? "Salir" : "Entrar"}
          </button>
        </div>
      </div>
    </header>
  );
};

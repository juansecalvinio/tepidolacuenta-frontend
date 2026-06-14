import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AvatarMenu } from "../AvatarMenu";
import { avatarMenuItemsData } from "../../data/avatar-menu";
import { BranchSelector } from "../../pages/BranchSelector";
import { ToggleTheme } from "../ToggleTheme";

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <header className="flex flex-col items-center sm:flex-row justify-between gap-4 w-full max-w-4xl p-4 min-h-12">
      <button
        type="button"
        className="font-display text-xl sm:text-2xl font-semibold tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleLogoClick}
        aria-label="Ir al inicio"
      >
        tepidolacuenta
      </button>

      <div className="flex items-center justify-between gap-4">
        <BranchSelector />

        <div className="flex items-center gap-2 sm:gap-4">
          <ToggleTheme />

          {user && <AvatarMenu items={avatarMenuItemsData} />}
        </div>
      </div>
    </header>
  );
};

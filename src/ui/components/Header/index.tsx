import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AvatarMenu } from "../AvatarMenu";
import { avatarMenuItemsData } from "../../data/avatar-menu";
import { BranchSelector } from "../../pages/BranchSelector";

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
    <header className="flex items-center justify-between gap-4 w-full max-w-4xl p-4 min-h-12">
      <h1
        className="text-brand text-xl sm:text-2xl font-light tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleLogoClick}
      >
        tepidolacuenta
      </h1>

      <div className="flex items-center justify-between gap-4">
        <BranchSelector />

        <div className="flex items-center gap-2 sm:gap-4">
          {user && <AvatarMenu items={avatarMenuItemsData} />}
        </div>
      </div>
    </header>
  );
};

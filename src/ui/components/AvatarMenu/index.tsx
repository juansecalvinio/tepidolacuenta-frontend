import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type {
  AvatarMenuItemProps,
  AvatarMenuItemWithHandler,
} from "../../data/avatar-menu";
import { themeSvgPathWhite, themeSvgPathBlack } from "../../data/avatar-menu";
import { AvatarMenuItem } from "../AvatarMenuItem";

type Theme = "white" | "black";

interface Props {
  items: AvatarMenuItemProps[];
}

export const AvatarMenu = ({ items }: Props) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [theme, setTheme] = useState<Theme>(
    () =>
      (document.documentElement.getAttribute("data-theme") as Theme) ?? "white",
  );

  const handleThemeChange = () => {
    const next: Theme = theme === "white" ? "black" : "white";
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const itemsWithHandlers: AvatarMenuItemWithHandler[] = items.map((item) => {
    switch (item.id) {
      case "dashboard":
        return { ...item, onClick: () => navigate("/dashboard") };
      case "profile":
        return { ...item, onClick: () => navigate("/dashboard/profile") };
      case "restaurant":
        return { ...item, onClick: () => navigate("/dashboard/restaurant") };
      case "theme":
        return {
          ...item,
          pathD: theme === "white" ? themeSvgPathWhite : themeSvgPathBlack,
          onClick: handleThemeChange,
        };
      case "logout":
        return { ...item, onClick: handleLogout };
    }
  });

  return (
    <div className="dropdown">
      <div
        className="avatar avatar-online avatar-placeholder hover:cursor-pointer"
        role="button"
        tabIndex={0}
      >
        <div className="bg-base-300 border-base-300 border-2 w-12 rounded-full">
          <span>{user?.email.substring(0, 2).toUpperCase()}</span>
        </div>
      </div>

      <div
        className="dropdown-content card bg-base-100 card-border border-base-300 mt-2"
        tabIndex={-1}
      >
        <span className="menu-title">{user?.email}</span>
        <ul className="menu w-full">
          {itemsWithHandlers.map((item) => (
            <AvatarMenuItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
};

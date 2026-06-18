import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type {
  AvatarMenuItemProps,
  AvatarMenuItemWithHandler,
} from "../../data/avatar-menu";
import { AvatarMenuItem } from "../AvatarMenuItem";

interface Props {
  items: AvatarMenuItemProps[];
}

export const AvatarMenu = ({ items }: Props) => {
  const navigate = useNavigate();
  const { logout, user, isOwner } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Los empleados no ven los ítems owner-only (plan, local).
  const visibleItems = items.filter((item) => !item.ownerOnly || isOwner);

  const itemsWithHandlers: AvatarMenuItemWithHandler[] = visibleItems.map((item) => {
    switch (item.id) {
      case "dashboard":
        return { ...item, onClick: () => navigate("/dashboard") };
      case "profile":
        return { ...item, onClick: () => navigate("/dashboard/profile") };
      case "settings":
        return { ...item, onClick: () => navigate("/dashboard/settings") };
      case "plan":
        return { ...item, onClick: () => navigate("/dashboard/subscription") };
      case "restaurant":
        return { ...item, onClick: () => navigate("/dashboard/restaurant") };
      case "logout":
        return { ...item, onClick: handleLogout };
    }
  });

  return (
    <div className="dropdown dropdown-end">
      <div
        className="avatar avatar-placeholder hover:cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label="Menú de usuario"
      >
        <div className="bg-base-300 border-base-300 border w-8 rounded-full">
          <p>{user?.email.substring(0, 2).toUpperCase()}</p>
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

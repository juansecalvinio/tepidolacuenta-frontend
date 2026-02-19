import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [theme, setTheme] = useState<"white" | "black">(
    (document.documentElement.getAttribute("data-theme") as
      | "white"
      | "black") ?? "white",
  );

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  const handleThemeChange = () => {
    const next = theme === "white" ? "black" : "white";
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
  };

  return (
    <header className="flex items-center justify-between gap-4 w-full max-w-4xl p-4 min-h-12">
      <h1
        className="text-brand text-xl sm:text-2xl font-light tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleLogoClick}
      >
        tepidolacuenta
      </h1>
      <div className="flex items-center gap-2 sm:gap-4">
        {user && (
          <div className="dropdown">
            <div
              className="avatar avatar-online avatar-placeholder hover:cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <div className="bg-base-300 border-base-300 border-2 w-12 rounded-full">
                <span>{user.email.substring(0, 2).toUpperCase()}</span>
              </div>
            </div>

            <div
              className="dropdown-content card bg-base-100 card-border border-base-300 mt-2"
              tabIndex={-1}
            >
              <span className="menu-title">{user.email}</span>
              <ul className="menu w-full">
                <li>
                  <span onClick={() => navigate("/dashboard/profile")}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="size-5 opacity-30"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      ></path>
                    </svg>
                    Perfil
                  </span>
                </li>

                <li>
                  <span onClick={handleThemeChange}>
                    {theme === "white" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="size-5 opacity-30"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="size-5 opacity-30"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                        />
                      </svg>
                    )}
                    Aspecto
                  </span>
                </li>

                <li>
                  <span onClick={handleLogoutClick}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="size-5 opacity-30"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                      />
                    </svg>
                    Salir
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

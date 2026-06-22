import { useNotificationPermission } from "../../hooks/useNotificationPermission";

export const NotificationPermissionBanner = () => {
  const { supported, permission, request } = useNotificationPermission();

  // Solo mostramos el aviso si el navegador soporta notificaciones y el usuario
  // todavía no decidió (granted/denied ya no necesitan banner).
  if (!supported || permission !== "default") return null;

  return (
    <div className="flex items-start gap-3 border border-primary/30 bg-primary/5 rounded-xl px-4 py-3 mb-4 text-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 shrink-0 mt-0.5 text-primary"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
        />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-base-content">
          Activá los avisos de pedidos
        </p>
        <p className="text-fg-soft mt-0.5">
          Te avisamos cuando una mesa pide la cuenta, aunque tengas la pestaña
          en segundo plano.
        </p>
      </div>
      <button
        type="button"
        onClick={request}
        className="btn btn-sm btn-primary shrink-0"
      >
        Activar
      </button>
    </div>
  );
};

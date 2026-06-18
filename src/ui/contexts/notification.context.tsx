import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  playNotificationSound,
  unlockNotificationSound,
} from "../utils/notificationSound";
import { showDesktopNotification } from "../utils/desktopNotification";
import { startTitleFlash } from "../utils/titleFlash";
import { usePreferencesContext } from "./preferences.context";

export interface NotificationData {
  id: string;
  tableNumber: number;
  message?: string;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: NotificationData[];
  addNotification: (tableNumber: number, message?: string) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // Desbloqueamos el audio en la primera interacción del usuario para sortear
  // la política de autoplay (si no, el primer aviso puede salir mudo).
  useEffect(() => {
    const unlock = () => unlockNotificationSound();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const addNotification = (tableNumber: number, message?: string) => {
    const resolvedMessage =
      message || `Nueva solicitud de la mesa ${tableNumber}`;
    const newNotification: NotificationData = {
      id: `notification-${Date.now()}-${Math.random()}`,
      tableNumber,
      message: resolvedMessage,
      timestamp: new Date(),
    };

    setNotifications((prev) => [newNotification, ...prev]); // Agregar al inicio para que aparezca arriba

    // Respetamos las preferencias del usuario (sonido / notif. de escritorio).
    const { notifications } = usePreferencesContext.getState();

    if (notifications.sound) {
      playNotificationSound();
    }
    // Si la pestaña está oculta y el usuario lo tiene activado: notificación del
    // sistema + parpadeo del título como respaldo visible.
    if (
      notifications.desktop &&
      typeof document !== "undefined" &&
      document.hidden
    ) {
      showDesktopNotification(
        "tepidolacuenta",
        resolvedMessage,
        newNotification.id,
      );
      startTitleFlash(`🔔 ${resolvedMessage}`);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

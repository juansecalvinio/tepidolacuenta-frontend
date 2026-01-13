import { createContext, useContext, useState, type ReactNode } from "react";

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

  const addNotification = (tableNumber: number, message?: string) => {
    const newNotification: NotificationData = {
      id: `notification-${Date.now()}-${Math.random()}`,
      tableNumber,
      message: message || `Nueva solicitud de la mesa ${tableNumber}`,
      timestamp: new Date(),
    };

    setNotifications((prev) => [newNotification, ...prev]); // Agregar al inicio para que aparezca arriba
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

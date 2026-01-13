import { useNotifications } from "../../contexts/notification.context";
import { NotificationAlert } from "../NotificationAlert";

export const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className="transform transition-all duration-300 ease-out"
          style={{
            transform: `translateY(${index * 8}px)`, // Desplazamiento en pila
            zIndex: notifications.length - index, // Z-index inverso para que las más nuevas estén arriba
          }}
        >
          <NotificationAlert
            id={notification.id}
            tableNumber={notification.tableNumber}
            message={
              notification.message ||
              `Nueva solicitud de la mesa ${notification.tableNumber}`
            }
            onClose={removeNotification}
            autoClose={true}
            duration={5000}
          />
        </div>
      ))}
    </div>
  );
};

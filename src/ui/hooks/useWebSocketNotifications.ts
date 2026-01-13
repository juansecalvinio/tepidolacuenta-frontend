import { useEffect } from "react";
import { useNotifications } from "../contexts/notification.context";

export const useWebSocketNotifications = (url: string) => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Crear conexión WebSocket
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("Conectado al servidor de notificaciones");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Verificar si es una notificación de nueva solicitud de cuenta
        if (data.type === "bill_request" && data.tableNumber) {
          addNotification(
            data.tableNumber,
            data.message || `¡La mesa ${data.tableNumber} pidió la cuenta!`
          );
        }
      } catch (error) {
        console.error("Error al procesar mensaje WebSocket:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("Error en WebSocket:", error);
    };

    ws.onclose = () => {
      console.log("Conexión WebSocket cerrada");
      // Aquí podrías implementar reconexión automática
    };

    // Cleanup: cerrar conexión cuando el componente se desmonte
    return () => {
      ws.close();
    };
  }, [url, addNotification]);
};

// Ejemplo de uso:
// En tu componente principal o en App.tsx:
// useWebSocketNotifications('ws://localhost:8080/notifications');

// El servidor debería enviar mensajes como:
// {
//   "type": "bill_request",
//   "tableNumber": 5,
//   "message": "¡La mesa 5 pidió la cuenta!"
// }

import { useEffect, useRef, useCallback, useState } from "react";
import { useNotifications } from "../contexts/notification.context";
import type { BillRequestWsResponse } from "../../core/modules/bill-request-ws/domain/models/BillRequestWs";
import { useFetchBillRequests } from "./useFetchBillRequests";

export type WsStatus = "connecting" | "connected" | "reconnecting" | "disconnected";

interface Props {
  restaurantId: string;
  token: string;
}

// Global set para evitar duplicados incluso entre montajes del componente
const globalRecentNotifications = new Set<string>();

export const useWebSocketNotifications = ({ restaurantId, token }: Props) => {
  const { addNotification } = useNotifications();
  const { fetchPendingRequests } = useFetchBillRequests();
  const [wsStatus, setWsStatus] = useState<WsStatus>("connecting");

  // Limpiar baseUrl de protocolos existentes
  const baseUrl = (import.meta.env.VITE_WS_BASE_URL || "localhost:8080")
    .replace(/^(wss?:\/\/)/, "")
    .replace(/^(https?:\/\/)/, "");

  // Referencias para manejar la reconexión
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const isConnectingRef = useRef(false);
  const hasInitializedRef = useRef(false); // Prevenir inicialización múltiple
  const maxReconnectAttempts = 10;
  const initialReconnectDelay = 1000; // 1 segundo

  const connectWebSocket = useCallback(() => {
    // Evitar múltiples conexiones simultáneas
    if (
      isConnectingRef.current ||
      wsRef.current?.readyState === WebSocket.OPEN ||
      !restaurantId ||
      !token
    ) {
      return;
    }

    isConnectingRef.current = true;

    try {
      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const url = `${protocol}://${baseUrl}/api/v1/requests/ws/${restaurantId}?token=${token}`;
      console.log(`🔗 Conectando a: ${url}`);
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log("✅ Conectado al servidor de notificaciones");
        wsRef.current = ws;
        isConnectingRef.current = false;
        reconnectAttemptsRef.current = 0; // Reset intentos cuando conecta exitosamente
        setWsStatus("connected");
      };

      ws.onmessage = (event) => {
        try {
          console.log("📨 Mensaje recibido del WebSocket:", event.data);
          const data = JSON.parse(event.data) as BillRequestWsResponse;
          console.log("✅ Datos parseados:", data);
          console.log(`🍽️ Mesa ${data.tableNumber} - Estado: ${data.status}`);

          // Mostrar notificación solo si es un pedido nuevo (pending)
          if (data.status === "pending") {
            // Crear una clave única usando timestamp para deduplicar con precisión
            const timestamp = Math.floor(Date.now() / 1000); // Timestamp en segundos
            const notificationKey = `${data.tableNumber}-${data.id || data.tableNumber}-${timestamp}`;

            // Si ya se mostró recientemente, ignorar
            if (globalRecentNotifications.has(notificationKey)) {
              return;
            }

            // Marcar como notificado recientemente
            globalRecentNotifications.add(notificationKey);

            addNotification(
              data.tableNumber,
              `¡La mesa ${data.tableNumber} pidió la cuenta!`,
            );

            // Limpiar la entrada después de 5 segundos
            setTimeout(() => {
              globalRecentNotifications.delete(notificationKey);
            }, 5000);

            // Refrescar la lista de pedidos para mostrar el nuevo pedido
            console.log("🔄 Refrescando lista de pedidos...");
            fetchPendingRequests();
          }
        } catch (error) {
          console.error("Error al procesar mensaje WebSocket:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("❌ Error en WebSocket:", error);
        console.error(
          "📍 URL intentada:",
          `ws://${baseUrl}/api/v1/requests/ws/${restaurantId}?token=${token}`,
        );
        console.error(
          "🔍 Estado WebSocket:",
          ws.readyState,
          "- 0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED",
        );
        console.error("💡 Verifica que:");
        console.error("   1. El servidor está corriendo en", baseUrl);
        console.error("   2. El restaurantId es válido:", restaurantId);
        console.error(
          "   3. El token es válido:",
          token ? "✓ Presente" : "✗ Faltante",
        );
      };

      ws.onclose = (event: CloseEvent) => {
        wsRef.current = null;
        isConnectingRef.current = false;

        console.log("🔌 Desconexión WebSocket:");
        console.log(
          "   Código:",
          event.code,
          "- Razón:",
          event.reason || "Sin razón",
        );
        console.log(
          "   ¿Limpio?:",
          event.wasClean ? "Sí" : "No (conexión interrumpida)",
        );

        // Implementar reconexión automática con backoff exponencial
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay =
            initialReconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
          const maxDelay = 30000; // Máximo 30 segundos
          const actualDelay = Math.min(delay, maxDelay);

          console.log(
            `⏳ Reconectando en ${(actualDelay / 1000).toFixed(
              1,
            )}s... (Intento ${
              reconnectAttemptsRef.current + 1
            }/${maxReconnectAttempts})`,
          );

          setWsStatus("reconnecting");
          reconnectAttemptsRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, actualDelay);
        } else {
          console.error(
            "❌ Máximo número de intentos de reconexión alcanzado. Por favor, recarga la página.",
          );
          setWsStatus("disconnected");
        }
      };

      return ws;
    } catch (error) {
      console.error("Error al crear WebSocket:", error);
      isConnectingRef.current = false;
      return null;
    }
  }, [restaurantId, token, addNotification, fetchPendingRequests]);

  useEffect(() => {
    // Solo conectar una sola vez por montaje
    if (!restaurantId || !token || hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;
    connectWebSocket();

    // Cleanup: cerrar conexión y limpiar timeouts cuando el componente se desmonte
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
    };
  }, [restaurantId, token, connectWebSocket]);

  return { wsStatus };
};

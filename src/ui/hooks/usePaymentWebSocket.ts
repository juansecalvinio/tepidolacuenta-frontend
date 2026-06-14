import { useEffect, useRef, useCallback } from "react";
import type { PaymentApprovedWsMessage } from "../../core/modules/payment/domain/models/Payment";

interface Props {
  restaurantId: string | null;
  token: string | null;
  preferenceId: string | null;
  onPaymentApproved: (message: PaymentApprovedWsMessage["payment"]) => void;
}

export const usePaymentWebSocket = ({
  restaurantId,
  token,
  preferenceId,
  onPaymentApproved,
}: Props) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 10;

  const onPaymentApprovedRef = useRef(onPaymentApproved);
  useEffect(() => {
    onPaymentApprovedRef.current = onPaymentApproved;
  }, [onPaymentApproved]);

  // Ref para reconectar sin que `connect` se referencie a sí mismo (evita TDZ).
  const connectRef = useRef<() => void>(() => {});

  const connect = useCallback(() => {
    if (!restaurantId || !token) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const baseUrl = (import.meta.env.VITE_WS_BASE_URL || "localhost:8080")
      .replace(/^(wss?:\/\/)/, "")
      .replace(/^(https?:\/\/)/, "");

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const url = `${protocol}://${baseUrl}/api/v1/requests/ws/${restaurantId}?token=${token}`;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as PaymentApprovedWsMessage;
        if (data.type === "payment.approved") {
          if (!preferenceId || data.payment.mpPreferenceId === preferenceId) {
            onPaymentApprovedRef.current(data.payment);
          }
        }
      } catch {
        // ignore non-JSON or unknown messages
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        const delay = Math.min(
          1000 * Math.pow(2, reconnectAttemptsRef.current),
          30000,
        );
        reconnectAttemptsRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(() => connectRef.current(), delay);
      }
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [restaurantId, token, preferenceId]);

  useEffect(() => {
    connectRef.current = connect;
    connect();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null; // prevent reconnect on intentional close
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);
};

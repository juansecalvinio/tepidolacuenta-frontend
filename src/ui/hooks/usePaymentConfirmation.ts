import { useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { useFetchPayment } from "./useFetchPayment";
import { usePaymentWebSocket } from "./usePaymentWebSocket";
import { logger } from "../utils/logger";
import type { PaymentApprovedWsMessage } from "../../core/modules/payment/domain/models/Payment";

export type PaymentConfirmStatus = "waiting" | "approved" | "timeout";

// El WS es best-effort (sin replay): la fuente de verdad es el polling del
// historial de pagos. Reintentamos hasta confirmar `approved` o agotar el tiempo.
const FIRST_POLL_MS = 1200;
const POLL_INTERVAL_MS = 3000;
// Ventana amplia: el webhook de MP es asíncrono y puede tardar (sobre todo en
// local con túneles). Corta apenas detecta `approved`; esto es solo el techo.
const MAX_WAIT_MS = 120000;

export const usePaymentConfirmation = () => {
  const { token, restaurantId } = useAuth();
  const {
    fetchPaymentHistory,
    clearPaymentStorage,
    getStoredPreferenceId,
    getStoredRestaurantId,
  } = useFetchPayment();

  const storedPreferenceId = getStoredPreferenceId();
  const storedRestaurantId = getStoredRestaurantId() ?? restaurantId;

  const [status, setStatus] = useState<PaymentConfirmStatus>("waiting");
  const settledRef = useRef(false);

  const settle = (next: PaymentConfirmStatus) => {
    if (settledRef.current) return;
    settledRef.current = true;
    if (next === "approved") clearPaymentStorage();
    setStatus(next);
  };

  // ── Vía 1: WebSocket (optimización, acelera la UX si el cliente está conectado)
  const handleApproved = (payment: PaymentApprovedWsMessage["payment"]) => {
    if (!storedPreferenceId || payment.mpPreferenceId === storedPreferenceId) {
      logger.debug("✅ Pago confirmado vía WebSocket:", payment.id);
      settle("approved");
    }
  };

  usePaymentWebSocket({
    restaurantId: storedRestaurantId,
    token,
    preferenceId: storedPreferenceId,
    onPaymentApproved: handleApproved,
  });

  // ── Vía 2: Polling del historial (fuente de verdad, independiente del WS)
  useEffect(() => {
    if (!storedRestaurantId) {
      settle("timeout");
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const startedAt = Date.now();

    const poll = async () => {
      if (cancelled || settledRef.current) return;

      const result = await fetchPaymentHistory(storedRestaurantId);
      if (cancelled || settledRef.current) return;

      const match =
        result.success && result.data
          ? storedPreferenceId
            ? result.data.find((p) => p.mpPreferenceId === storedPreferenceId)
            : result.data[0]
          : undefined;

      if (match?.status === "approved") {
        logger.debug("✅ Pago confirmado vía polling:", match.id);
        settle("approved");
        return;
      }

      if (Date.now() - startedAt >= MAX_WAIT_MS) {
        settle("timeout");
        return;
      }

      timer = setTimeout(poll, POLL_INTERVAL_MS);
    };

    timer = setTimeout(poll, FIRST_POLL_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedRestaurantId, storedPreferenceId]);

  return { status, storedRestaurantId };
};

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useFetchPayment } from "./useFetchPayment";

export type PendingPaymentStatus = "checking" | "none" | "pending" | "approved";

/**
 * Detecta si hay un pago "en vuelo" para evitar cobros duplicados: si quedó una
 * preferencia guardada (el usuario pagó pero el webhook todavía no confirmó),
 * mira su estado en el historial. Así, antes de dejar elegir/pagar de nuevo,
 * podemos avisar que ya hay un pago en proceso.
 */
export const usePendingPayment = () => {
  const { restaurantId } = useAuth();
  const { fetchPaymentHistory, getStoredPreferenceId, clearPaymentStorage } =
    useFetchPayment();

  // Si no hay preferencia guardada, no hay nada que verificar.
  const [status, setStatus] = useState<PendingPaymentStatus>(() =>
    getStoredPreferenceId() ? "checking" : "none",
  );

  // Función pura (sin setState): resuelve el estado del pago en vuelo.
  const evaluate = useCallback(async (): Promise<PendingPaymentStatus> => {
    const preferenceId = getStoredPreferenceId();
    if (!preferenceId || !restaurantId) return "none";

    const result = await fetchPaymentHistory(restaurantId);
    const payment =
      result.success && result.data
        ? result.data.find((p) => p.mpPreferenceId === preferenceId)
        : undefined;

    if (payment?.status === "approved") return "approved";
    if (payment?.status === "pending") return "pending";

    // rechazado / cancelado / inexistente → no hay nada en proceso
    clearPaymentStorage();
    return "none";
  }, [restaurantId, fetchPaymentHistory, getStoredPreferenceId, clearPaymentStorage]);

  useEffect(() => {
    if (!getStoredPreferenceId() || !restaurantId) return;
    let active = true;
    evaluate().then((next) => {
      if (active) setStatus(next);
    });
    return () => {
      active = false;
    };
  }, [evaluate, getStoredPreferenceId, restaurantId]);

  const recheck = useCallback(async (): Promise<PendingPaymentStatus> => {
    const next = await evaluate();
    setStatus(next);
    return next;
  }, [evaluate]);

  // Descartar el pago en vuelo (p. ej. el usuario decide elegir otro plan).
  const dismiss = useCallback(() => {
    clearPaymentStorage();
    setStatus("none");
  }, [clearPaymentStorage]);

  return { status, recheck, dismiss };
};

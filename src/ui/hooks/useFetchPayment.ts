import { useCallback } from "react";
import { logger } from "../utils/logger";
import { usePaymentContext } from "../contexts/payment.context";
import { getPaymentRepository } from "../../core/modules/payment/infrastructure/repositories/PaymentRepositoryFactory";
import { CreatePaymentPreference } from "../../core/modules/payment/use-cases/CreatePaymentPreference";
import { GetPayment } from "../../core/modules/payment/use-cases/GetPayment";
import { GetPaymentHistory } from "../../core/modules/payment/use-cases/GetPaymentHistory";
import type { CreatePaymentPreferenceRequest } from "../../core/modules/payment/domain/models/Payment";
import { getErrorMessage } from "../../core/utils/error-messages";

const MP_PREFERENCE_KEY = "mp_preference_id";
const MP_RESTAURANT_KEY = "mp_restaurant_id";

export const useFetchPayment = () => {
  const { setLoading, setError, clearError, setPaymentHistory } =
    usePaymentContext();

  const repository = getPaymentRepository();

  const createPreference = useCallback(
    async (request: CreatePaymentPreferenceRequest) => {
      setLoading(true);
      clearError();
      try {
        const execute = CreatePaymentPreference(repository);
        const response = await execute(request);
        logger.debug("🚀 ~ useFetchPayment ~ response:", response);
        localStorage.setItem(MP_PREFERENCE_KEY, response.preferenceId);
        localStorage.setItem(MP_RESTAURANT_KEY, request.restaurantId);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage = getErrorMessage(err, "createPaymentPreference");
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [repository, setLoading, setError, clearError],
  );

  const fetchPayment = useCallback(
    async (paymentId: string) => {
      setLoading(true);
      clearError();
      try {
        const execute = GetPayment(repository);
        const payment = await execute(paymentId);
        return { success: true, data: payment };
      } catch (err) {
        const errorMessage = getErrorMessage(err, "getPayment");
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [repository, setLoading, setError, clearError],
  );

  const fetchPaymentHistory = useCallback(
    async (restaurantId: string) => {
      setLoading(true);
      clearError();
      try {
        const execute = GetPaymentHistory(repository);
        const payments = await execute(restaurantId);
        setPaymentHistory(payments);
        return { success: true, data: payments };
      } catch (err) {
        const errorMessage = getErrorMessage(err, "getPaymentHistory");
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [repository, setLoading, setError, clearError, setPaymentHistory],
  );

  const clearPaymentStorage = useCallback(() => {
    localStorage.removeItem(MP_PREFERENCE_KEY);
    localStorage.removeItem(MP_RESTAURANT_KEY);
  }, []);

  const getStoredPreferenceId = useCallback(
    () => localStorage.getItem(MP_PREFERENCE_KEY),
    [],
  );

  const getStoredRestaurantId = useCallback(
    () => localStorage.getItem(MP_RESTAURANT_KEY),
    [],
  );

  return {
    createPreference,
    fetchPayment,
    fetchPaymentHistory,
    clearPaymentStorage,
    getStoredPreferenceId,
    getStoredRestaurantId,
  };
};

import { usePaymentContext } from "../contexts/payment.context";

export const usePayment = () => {
  const { isLoading, error, paymentHistory } = usePaymentContext();

  return {
    isLoading,
    error,
    paymentHistory,
  };
};

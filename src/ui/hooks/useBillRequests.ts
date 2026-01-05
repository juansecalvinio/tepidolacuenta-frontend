import { useBillRequestContext } from "../contexts/bill-request.context";

export const useBillRequests = () => {
  const { requests, isLoading, error } = useBillRequestContext();

  return {
    requests,
    isLoading,
    error,
    pendingCount: requests.filter((req) => req.status === "pending").length,
  };
};

import { useBillRequestContext } from "../contexts/bill-request.context";

export const useBillRequests = () => {
  const { requests, isRequested, isLoading, error } = useBillRequestContext();

  return {
    requests,
    isLoading,
    isRequested,
    error,
    pendingCount: requests.filter((req) => req.status === "pending").length,
  };
};

import { useBillRequestContext } from "../contexts/bill-request.context";

export const useBillRequests = () => {
  const { requests, isRequested, isDuplicateRequest, isLoading, error } = useBillRequestContext();

  let pendingCount: number = 0;

  if (requests && requests.length > 0) {
    pendingCount = requests.filter((req) => req.status === "pending").length;
  }

  return {
    requests,
    isLoading,
    isRequested,
    isDuplicateRequest,
    error,
    pendingCount,
  };
};

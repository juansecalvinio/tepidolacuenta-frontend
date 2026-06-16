import { useShallow } from "zustand/react/shallow";
import { useBillRequestContext } from "../contexts/bill-request.context";

export const useBillRequests = () => {
  const { requests, isRequested, isDuplicateRequest, isLoading, error } =
    useBillRequestContext(
      useShallow((s) => ({
        requests: s.requests,
        isRequested: s.isRequested,
        isDuplicateRequest: s.isDuplicateRequest,
        isLoading: s.isLoading,
        error: s.error,
      })),
    );

  const pendingCount =
    requests && requests.length > 0
      ? requests.filter((req) => req.status === "pending").length
      : 0;

  return {
    requests,
    isLoading,
    isRequested,
    isDuplicateRequest,
    error,
    pendingCount,
  };
};

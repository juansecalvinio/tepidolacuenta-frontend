import { useCallback } from "react";
import { useBillRequestContext } from "../contexts/bill-request.context";
import { getBillRequestRepository } from "../../core/modules/bill-request/infrastructure/repositories/BillRequestRepositoryFactory";
import { GetPendingBillRequests } from "../../core/modules/bill-request/use-cases/GetPendingBillRequests";
import { MarkBillRequestAsAttended } from "../../core/modules/bill-request/use-cases/MarkBillRequestAsAttended";

export const useFetchBillRequests = () => {
  const { setRequests, updateRequest, setLoading, setError, clearError } =
    useBillRequestContext();
  const repository = getBillRequestRepository();

  const fetchPendingRequests = useCallback(async () => {
    setLoading(true);
    clearError();

    try {
      const getPendingUseCase = GetPendingBillRequests(repository);
      const response = await getPendingUseCase();
      setRequests(response.requests);
      return { success: true, data: response.requests };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar las solicitudes";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [repository, setRequests, setLoading, setError, clearError]);

  const markAsAttended = useCallback(
    async (requestId: string) => {
      clearError();

      try {
        const markAsAttendedUseCase = MarkBillRequestAsAttended(repository);
        const response = await markAsAttendedUseCase({ requestId });
        updateRequest(requestId, {
          status: "attended",
          attendedAt: response.request.attendedAt,
        });
        return { success: true, data: response.request };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al marcar como atendida";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [repository, updateRequest, setError, clearError]
  );

  return {
    fetchPendingRequests,
    markAsAttended,
  };
};

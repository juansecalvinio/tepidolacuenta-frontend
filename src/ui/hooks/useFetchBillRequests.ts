import { useCallback } from "react";
import { useBillRequestContext } from "../contexts/bill-request.context";
import { getBillRequestRepository } from "../../core/modules/bill-request/infrastructure/repositories/BillRequestRepositoryFactory";
import { GetPendingBillRequests } from "../../core/modules/bill-request/use-cases/GetPendingBillRequests";
import { MarkBillRequestAsAttended } from "../../core/modules/bill-request/use-cases/MarkBillRequestAsAttended";
import type { CreateBillRequestBody } from "../../core/modules/bill-request/domain/models/BillRequest";
import { CreateBillRequest } from "../../core/modules/bill-request/use-cases/CreateBillRequest";
import { useAuth } from "./useAuth";

export const useFetchBillRequests = () => {
  const { restaurantId } = useAuth();
  const {
    setRequests,
    updateRequest,
    setLoading,
    setIsRequested,
    setError,
    clearError,
  } = useBillRequestContext();
  const repository = getBillRequestRepository();

  const fetchPendingRequests = useCallback(async () => {
    setLoading(true);
    clearError();

    try {
      const getPendingUseCase = GetPendingBillRequests(repository);
      const response = await getPendingUseCase(restaurantId!);
      setRequests(response.data);
      return { success: true, data: response.data };
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
          updatedAt: response.request.updatedAt,
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

  const createBillRequest = useCallback(
    async (body: CreateBillRequestBody) => {
      setLoading(true);
      clearError();

      try {
        const createBillRequestUseCase = CreateBillRequest(repository);
        const response = await createBillRequestUseCase(body);
        if (response.success) {
          setIsRequested(true);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al crear la solicitud";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [repository, setIsRequested, setError, clearError]
  );

  return {
    fetchPendingRequests,
    markAsAttended,
    createBillRequest,
  };
};

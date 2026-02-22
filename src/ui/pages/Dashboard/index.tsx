import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTables } from "../../hooks/useTables";
import { useBillRequests } from "../../hooks/useBillRequests";
import { useFetchBillRequests } from "../../hooks/useFetchBillRequests";
import { useFetchTables } from "../../hooks/useFetchTables";
import { useNavigate } from "react-router-dom";
import type { BillRequest } from "../../../core/modules/bill-request/domain/models/BillRequest";
import { PendingRequestCard } from "../../components/PendingRequestCard";
import { useWebSocketNotifications } from "../../hooks/useWebSocketNotifications";
import { useBillRequestContext } from "../../contexts/bill-request.context";
import { useRestaurants } from "../../hooks/useRestaurants";
import { useFetchBranches } from "../../hooks/useFetchBranches";
import { useFetchRestaurant } from "../../hooks/useFetchRestaurant";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { token, restaurantId } = useAuth();
  const { fetchRestaurant } = useFetchRestaurant();
  const { fetchBranchesByRestaurant } = useFetchBranches();
  const { fetchTables } = useFetchTables();
  const { restaurant, activeBranch } = useRestaurants();
  const { tables } = useTables();
  const { requests, pendingCount } = useBillRequests();
  const { fetchPendingRequests, markAsAttended } = useFetchBillRequests();
  const { removeRequest } = useBillRequestContext();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useWebSocketNotifications({
    restaurantId: restaurantId || "",
    token: token || "",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchRestaurant(restaurantId!);
      await fetchBranchesByRestaurant(restaurantId!);
      await fetchTables();
      await fetchPendingRequests();
      setIsInitialLoading(false);
    };

    fetchInitialData();
  }, [restaurantId]);

  const handleMarkAsAttended = async (requestId: string) => {
    removeRequest(requestId);
    const result = await markAsAttended(requestId);
    if (!result?.success) {
      await fetchPendingRequests();
    }
  };

  const pendingRequests: BillRequest[] =
    requests?.filter((req) => req.status === "pending") ?? [];

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-base-200">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="font-light text-center">
          Estamos cargando tu restaurante...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          {restaurant?.name || "Tu restaurante"}
        </h1>
        <select
          defaultValue={activeBranch?.address || "Sucursal"}
          className="select select-md border-base-300"
          disabled
        >
          <option>{activeBranch?.address || "Sucursal"}</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row justify-start gap-4 mb-6">
        <div className="card bg-base-100 card-border border-base-300 w-full">
          <div className="card-body p-4 flex flex-col justify-between">
            <div className="font-bold tracking-wide opacity-50">
              Mesas totales
            </div>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-black">{tables.length}</div>
              {tables.length > 0 && (
                <button
                  className="btn btn-square btn-sm"
                  onClick={() => navigate("/dashboard/tables")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="card bg-base-100 card-border border-base-300 w-full">
          <div className="card-body p-4">
            <div className="font-bold tracking-wide opacity-50">
              Solicitudes pendientes
            </div>
            <div
              className={`text-4xl font-black ${pendingCount > 0 ? "text-brand" : ""}`}
            >
              {pendingCount}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-bold">Solicitudes de cuentas</h2>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="card bg-base-100 card-border border-base-300 w-full">
          <div className="card-body p-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current w-10 h-10 mx-auto mb-4 size-5 opacity-30"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg">No hay solicitudes pendientes</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingRequests.map((request) => (
            <PendingRequestCard
              key={request.id}
              request={request}
              onClick={() => handleMarkAsAttended(request.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

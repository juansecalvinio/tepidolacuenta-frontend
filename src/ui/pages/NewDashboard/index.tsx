import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTables } from "../../hooks/useTables";
import { useBillRequests } from "../../hooks/useBillRequests";
import { useFetchBillRequests } from "../../hooks/useFetchBillRequests";
import { useFetchTables } from "../../hooks/useFetchTables";
import { useBillRequestContext } from "../../contexts/bill-request.context";
import { useRestaurants } from "../../hooks/useRestaurants";
import { useFetchBranches } from "../../hooks/useFetchBranches";
import { useFetchRestaurant } from "../../hooks/useFetchRestaurant";
import {
  useWebSocketNotifications,
  type WsStatus,
} from "../../hooks/useWebSocketNotifications";
import { NewTrialBanner } from "../../components/NewTrialBanner";
import { TimeUtils } from "../../utils/time.utils";
import type {
  BillRequest,
  PaymentMethod,
} from "../../../core/modules/bill-request/domain/models/BillRequest";

// ─── Helpers ────────────────────────────────────────────────────────────────

const minutesAgo = (dateString: string) =>
  Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);

const timeUrgencyClass = (dateString: string): string => {
  const mins = minutesAgo(dateString);
  if (mins >= 20) return "text-error font-medium";
  if (mins >= 10) return "text-warning font-medium";
  return "text-base-content/40";
};

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: "Efectivo",
  debit_card: "Débito",
  credit_card: "Crédito",
};

// ─── Icons ───────────────────────────────────────────────────────────────────

const CashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-3.5 h-3.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125H15m-5.625 0h1.875M9.375 10.5H7.5"
    />
  </svg>
);

const CardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-3.5 h-3.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
    />
  </svg>
);

// ─── WS Status badge ─────────────────────────────────────────────────────────

const WsBadge = ({ status }: { status: WsStatus }) => {
  const config: Record<WsStatus, { dot: string; label: string }> = {
    connecting: { dot: "bg-amber-400 animate-pulse", label: "Conectando..." },
    connected: { dot: "bg-green-500", label: "Conectado con las mesas" },
    reconnecting: {
      dot: "bg-amber-400 animate-pulse",
      label: "Reconectando...",
    },
    disconnected: { dot: "bg-red-500", label: "Sin conexión" },
  };

  const { dot, label } = config[status];

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-base-content/50 shrink-0">
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
};

// ─── Skeleton ────────────────────────────────────────────────────────────────

const LoadingSkeleton = () => (
  <div className="p-4 max-w-3xl mx-auto space-y-4 pt-6">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="h-8 w-44 bg-base-300 rounded-lg animate-pulse" />
        <div className="h-3 w-28 bg-base-300 rounded animate-pulse" />
      </div>
      <div className="h-4 w-16 bg-base-300 rounded animate-pulse" />
    </div>
    <div className="flex gap-3">
      <div className="h-20 flex-1 bg-base-300 rounded-xl animate-pulse" />
      <div className="h-20 flex-1 bg-base-300 rounded-xl animate-pulse" />
    </div>
    <div className="h-5 w-36 bg-base-300 rounded animate-pulse" />
    <div className="h-16 bg-base-300 rounded-xl animate-pulse" />
    <div className="h-16 bg-base-300 rounded-xl animate-pulse" />
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const NewDashboard = () => {
  const navigate = useNavigate();
  const { token, restaurantId } = useAuth();
  const { fetchRestaurant } = useFetchRestaurant();
  const { fetchBranchesByRestaurant } = useFetchBranches();
  const { fetchTables } = useFetchTables();
  const { restaurant, activeBranch } = useRestaurants();
  const { tables, isLoading: isTablesLoading } = useTables();
  const {
    requests,
    error: requestsError,
    isLoading: isRequestsLoading,
  } = useBillRequests();
  const { fetchPendingRequests, markAsAttended } = useFetchBillRequests();
  const { removeRequest } = useBillRequestContext();

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const isInitialLoadComplete = useRef(false);

  // Fuerza re-render cada 30s para mantener los labels de tiempo actualizados
  const [, forceTimeUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => forceTimeUpdate((n) => n + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  const { wsStatus } = useWebSocketNotifications({
    restaurantId: restaurantId || "",
    token: token || "",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        fetchRestaurant(restaurantId!),
        fetchBranchesByRestaurant(restaurantId!),
        fetchTables(),
        fetchPendingRequests(),
      ]);
      setIsInitialLoading(false);
      isInitialLoadComplete.current = true;
    };

    fetchInitialData();
  }, [restaurantId]);

  useEffect(() => {
    if (!isInitialLoadComplete.current) return;
    fetchTables();
    fetchPendingRequests();
  }, [activeBranch?.id]);

  const handleMarkAsAttended = useCallback(
    async (requestId: string) => {
      removeRequest(requestId);
      const result = await markAsAttended(requestId);
      if (!result?.success) {
        await fetchPendingRequests();
      }
    },
    [removeRequest, markAsAttended, fetchPendingRequests],
  );

  // Filtramos por mesas de la sucursal activa, luego ordenamos de más antigua a más reciente
  const activeBranchTableIds = new Set(tables.map((t) => t.id));
  const pendingRequests: BillRequest[] = (
    requests?.filter(
      (req) =>
        req.status === "pending" && activeBranchTableIds.has(req.tableId),
    ) ?? []
  ).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const filteredPendingCount = pendingRequests.length;

  if (isInitialLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <NewTrialBanner />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="font-host text-3xl sm:text-4xl font-bold leading-tight truncate">
            {restaurant?.name || "Tu restaurante"}
          </h1>
          {activeBranch && (
            <p className="text-sm text-base-content/40 mt-0.5 truncate">
              {activeBranch.name}
            </p>
          )}
        </div>
        <WsBadge status={wsStatus} />
      </div>

      {/* Reconectando — aviso transitorio */}
      {wsStatus === "reconnecting" && (
        <div className="flex items-start gap-3 border border-amber-400/30 bg-amber-400/5 rounded-xl px-4 py-3 mb-4 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 shrink-0 mt-0.5 text-amber-500 animate-spin"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          <p className="flex-1 text-base-content/70">
            Reconectando con el servidor de notificaciones...
          </p>
        </div>
      )}

      {/* Sin conexión — alerta persistente */}
      {wsStatus === "disconnected" && (
        <div className="flex items-start gap-3 border border-red-500/25 bg-red-500/5 rounded-xl px-4 py-3 mb-4 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 shrink-0 mt-0.5 text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <p className="flex-1 text-base-content/80">
            Sin conexión en tiempo real. Las solicitudes no se actualizarán
            automáticamente.
          </p>
          <button
            className="btn btn-xs btn-ghost shrink-0"
            onClick={() => window.location.reload()}
          >
            Recargar
          </button>
        </div>
      )}

      {/* Error al cargar solicitudes */}
      {!isInitialLoading && requestsError && (
        <div className="flex items-start gap-3 border border-red-500/25 bg-red-500/5 rounded-xl px-4 py-3 mb-4 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 shrink-0 mt-0.5 text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-3.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <p className="flex-1 text-base-content/80">
            No pudimos cargar las solicitudes.
          </p>
          <button
            className="btn btn-xs btn-ghost shrink-0"
            onClick={() => fetchPendingRequests()}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Métricas */}
      <div className="flex gap-3 mb-6">
        {/* Mesas */}
        <div className="flex-1 border border-base-300 rounded-xl p-4 bg-base-100">
          <p className="text-xs font-medium text-base-content/40 uppercase tracking-wider mb-2">
            Mesas
          </p>
          {isTablesLoading ? (
            <div className="h-8 w-8 bg-base-300 rounded animate-pulse" />
          ) : tables.length === 0 ? (
            <button
              className="text-sm font-medium text-primary hover:underline underline-offset-2 transition-all"
              onClick={() => navigate("/dashboard/tables/add-tables")}
            >
              Configurar mesas →
            </button>
          ) : (
            <div className="flex items-end justify-between">
              <span className="font-host text-3xl font-black">
                {tables.length}
              </span>
              <button
                className="btn btn-square btn-xs btn-ghost opacity-40 hover:opacity-100 transition-opacity"
                onClick={() => navigate("/dashboard/tables")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Pendientes — urgency card */}
        <div
          className={`flex-1 border rounded-xl p-4 transition-colors ${
            filteredPendingCount > 0
              ? "border-primary/30 bg-primary/5"
              : "border-base-300 bg-base-100"
          }`}
        >
          <p
            className={`text-xs font-medium uppercase tracking-wider mb-2 ${
              filteredPendingCount > 0 ? "text-primary/60" : "text-base-content/40"
            }`}
          >
            Pendientes
          </p>
          {isRequestsLoading ? (
            <div className="h-8 w-8 bg-base-300 rounded animate-pulse" />
          ) : (
            <span
              className={`font-host text-3xl font-black ${
                filteredPendingCount > 0 ? "text-primary" : ""
              }`}
            >
              {filteredPendingCount}
            </span>
          )}
        </div>
      </div>

      {/* Sección de solicitudes */}
      <div className="mb-3">
        <h2 className="font-host text-lg font-bold">
          {filteredPendingCount > 0
            ? filteredPendingCount === 1
              ? "1 solicitud pendiente"
              : `${filteredPendingCount} solicitudes pendientes`
            : "Solicitudes de cuentas"}
        </h2>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="border border-base-300 rounded-xl bg-base-100">
          <div className="p-8 flex flex-col items-center gap-2 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-base-content/20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <p className="text-base-content/40 text-sm">
              Sin solicitudes por el momento
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {pendingRequests.map((request) => {
            const mins = minutesAgo(request.createdAt);
            const isUrgent = mins >= 20;
            const isModerate = mins >= 10 && mins < 20;
            const PayIcon =
              request.paymentMethod === "cash" ? CashIcon : CardIcon;

            return (
              <div
                key={request.id}
                className={`border rounded-xl bg-base-100 transition-colors ${
                  isUrgent
                    ? "border-error/25"
                    : isModerate
                      ? "border-warning/25"
                      : "border-base-300"
                }`}
              >
                <div className="p-4 flex items-center gap-3">
                  {/* Dot — urgency-colored */}
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${
                      isUrgent
                        ? "bg-error"
                        : isModerate
                          ? "bg-warning"
                          : "bg-primary"
                    }`}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-host font-bold text-xl">
                        Mesa {request.tableNumber}
                      </span>
                      <span
                        className={`text-xs ${timeUrgencyClass(request.createdAt)}`}
                      >
                        {TimeUtils.getTimeAgo(request.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-base-content/40 mt-0.5">
                      <PayIcon />
                      <span>
                        {PAYMENT_LABELS[request.paymentMethod as PaymentMethod]}
                      </span>
                      <span className="text-base-content/20">·</span>
                      <span>{TimeUtils.formatTime(request.createdAt)}</span>
                    </div>
                  </div>

                  {/* Acción */}
                  <button
                    className="btn btn-primary btn-sm shrink-0"
                    onClick={() => handleMarkAsAttended(request.id)}
                  >
                    Entregar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

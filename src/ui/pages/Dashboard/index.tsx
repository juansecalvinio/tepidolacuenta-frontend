import { use, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTables } from "../../hooks/useTables";
import { useBillRequests } from "../../hooks/useBillRequests";
import { useFetchBillRequests } from "../../hooks/useFetchBillRequests";
import { useFetchTables } from "../../hooks/useFetchTables";
import { useNavigate } from "react-router-dom";

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const then = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - then.getTime()) / 60000);

  if (diffInMinutes < 1) return "Ahora";
  if (diffInMinutes === 1) return "Hace 1 minuto";
  return `Hace ${diffInMinutes} minutos`;
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchTables } = useFetchTables();
  const { tables, isLoading } = useTables();
  const { requests, pendingCount } = useBillRequests();
  const { fetchPendingRequests, markAsAttended } = useFetchBillRequests();

  useEffect(() => {
    fetchTables();
    fetchPendingRequests();
  }, []);

  const handleMarkAsAttended = async (requestId: string) => {
    await markAsAttended(requestId);
  };

  const pendingRequests = requests.filter((req) => req.status === "pending");

  return (
    <div className="p-4 md:p-2 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Dashboard</h1>
        <h2 className="text-xl font-semibold mb-2">{user?.username}</h2>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center h-32 gap-2">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="font-light text-center">
            Estamos cargando la información de tus mesas
          </p>
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card bg-base-100 shadow">
            <div className="card-body p-4 flex flex-col justify-between">
              <div className="text-sm text-base-content/60">Mesas totales</div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{tables.length}</div>
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
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body p-4">
              <div className="text-sm text-base-content/60">
                Solicitudes pendientes
              </div>
              <div className="text-3xl font-bold text-primary">
                {pendingCount}
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Solicitudes de Cuenta
            {pendingCount > 0 && (
              <span className="badge badge-primary badge-lg">
                {pendingCount}
              </span>
            )}
          </h2>
        </div>
      )}

      {!isLoading && pendingRequests.length === 0 && (
        <div className="card bg-base-100 shadow">
          <div className="card-body p-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current w-12 h-12 mx-auto mb-4 text-base-content/30"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-base-content/60">
              No hay solicitudes pendientes
            </p>
          </div>
        </div>
      )}

      {!isLoading && pendingRequests.length > 0 && (
        <div className="space-y-3">
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className="card bg-base-100 shadow-md border-l-4 border-primary"
            >
              <div className="card-body p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div>
                      <div className="font-bold text-lg">
                        Mesa {request.tableNumber}
                      </div>
                      <div className="text-sm text-base-content/60">
                        {formatTime(request.createdAt)} •{" "}
                        {getTimeAgo(request.createdAt)}
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleMarkAsAttended(request.id)}
                  >
                    Atendida
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

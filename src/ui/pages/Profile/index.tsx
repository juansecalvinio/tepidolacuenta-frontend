import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useFetchAuth } from "../../hooks/useFetchAuth";
import { useRestaurants } from "../../hooks/useRestaurants";
import { useSubscription } from "../../hooks/useSubscription";
import { useFetchInvitation } from "../../hooks/useFetchInvitation";
import { useFetchTeam } from "../../hooks/useFetchTeam";
import { useFetchBranches } from "../../hooks/useFetchBranches";

export const Profile = () => {
  const navigate = useNavigate();
  const { user, restaurantId, isOwner } = useAuth();
  const { logout } = useFetchAuth();
  const { restaurant, branches, activeBranch } = useRestaurants();
  const { fetchBranchesByRestaurant } = useFetchBranches();
  const { subscription } = useSubscription();
  const { isLoading: invitationLoading, error: invitationError, invitationCode, invitationExpiresAt, generateInvitation, clearInvitation } = useFetchInvitation();
  const {
    employees,
    isLoading: teamLoading,
    error: teamError,
    revokingId,
    fetchEmployees,
    revokeEmployee,
  } = useFetchTeam();
  const [copied, setCopied] = useState(false);
  const [confirmRevokeId, setConfirmRevokeId] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  useEffect(() => {
    if (isOwner && restaurantId) {
      fetchEmployees(restaurantId);
      fetchBranchesByRestaurant(restaurantId);
    }
  }, [isOwner, restaurantId, fetchEmployees, fetchBranchesByRestaurant]);

  // Sucursal efectiva: la elegida o, por defecto, la activa / la primera.
  const effectiveBranchId =
    selectedBranchId || activeBranch?.id || branches?.[0]?.id || "";

  const branchName = (branchId?: string) => {
    const branch = branches?.find((b) => b.id === branchId);
    return branch?.name || branch?.address || "Sucursal";
  };

  const handleGenerateInvitation = async () => {
    if (restaurantId && effectiveBranchId) {
      await generateInvitation(restaurantId, effectiveBranchId);
    }
  };

  const handleRevokeEmployee = async (employeeId: string) => {
    if (!restaurantId) return;
    await revokeEmployee(restaurantId, employeeId);
    setConfirmRevokeId(null);
  };

  const handleCopyCode = async () => {
    if (invitationCode) {
      await navigator.clipboard.writeText(invitationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (value: Date | string) =>
    new Date(value).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });

  const formatExpiresAt = (iso: string) => formatDate(iso);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="font-display text-2xl font-semibold mb-6">Tu perfil</h2>

      <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
        {/* Avatar + email */}
        <div className="p-4 flex items-center gap-4 border-b border-base-300">
          <div className="avatar avatar-placeholder shrink-0">
            <div className="bg-base-300 border-2 border-base-300 w-12 rounded-full">
              <span className="text-base font-semibold">
                {user?.email.substring(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-fg-subtle uppercase tracking-wider mb-0.5">
              Email
            </p>
            <p className="text-base font-medium break-all leading-snug">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Nombre del local */}
        <div className="p-4">
          <p className="text-xs text-fg-subtle uppercase tracking-wider mb-1">
            Nombre del local
          </p>
          <p className="text-base font-semibold">{restaurant?.name}</p>
        </div>
      </div>

      {isOwner && (
        <>
          <h2 className="font-display text-2xl font-semibold my-6">Suscripción</h2>

          <div className="bg-base-100 border border-base-300 rounded-xl flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="text-xs text-fg-subtle uppercase tracking-wider mb-1">
                Plan actual
              </p>
              <p className="text-base font-semibold truncate">
                {subscription?.plan?.name}
              </p>
            </div>
            <button
              className="btn btn-sm btn-secondary shrink-0"
              onClick={() => navigate("/dashboard/subscription")}
            >
              Gestionar
            </button>
          </div>

          <h2 className="font-display text-2xl font-semibold my-6">Equipo</h2>

          <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-base-300">
              <p className="text-sm text-fg-soft">
                Elegí la sucursal y generá un código para que un empleado se registre con acceso solo a esa sucursal. El código expira a los 7 días y es de un solo uso.
              </p>
            </div>

            <div className="p-4">
              {invitationError && (
                <div className="alert alert-error alert-soft mb-4">
                  <span>{invitationError}</span>
                </div>
              )}

              {invitationCode ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 bg-base-200 rounded-lg p-3">
                    <code className="flex-1 font-mono text-sm break-all">{invitationCode}</code>
                    <button
                      className="btn btn-sm btn-ghost shrink-0"
                      onClick={handleCopyCode}
                    >
                      {copied ? "Copiado" : "Copiar"}
                    </button>
                  </div>
                  {invitationExpiresAt && (
                    <p className="text-xs text-fg-subtle">
                      Expira el {formatExpiresAt(invitationExpiresAt)}
                    </p>
                  )}
                  <p className="text-xs text-fg-subtle">
                    Acceso a:{" "}
                    <span className="font-medium text-fg-soft">
                      {branchName(effectiveBranchId)}
                    </span>
                  </p>
                  <button
                    className="btn btn-sm btn-ghost self-start"
                    onClick={clearInvitation}
                  >
                    Generar nuevo código
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-fg-soft">
                      Sucursal
                    </span>
                    <select
                      className="select select-bordered select-sm"
                      value={effectiveBranchId}
                      onChange={(e) => setSelectedBranchId(e.target.value)}
                    >
                      {(branches ?? []).map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name || branch.address}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="btn btn-primary btn-sm self-start"
                    onClick={handleGenerateInvitation}
                    disabled={invitationLoading || !effectiveBranchId}
                  >
                    {invitationLoading ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      "Generar código de invitación"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Lista de empleados */}
          <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden mt-4">
            <div className="p-4 border-b border-base-300">
              <p className="text-sm font-medium text-base-content">Empleados</p>
              <p className="text-xs text-fg-soft mt-0.5">
                Tienen acceso a este local. Podés revocarles el acceso cuando quieras.
              </p>
            </div>

            {teamError && (
              <div className="p-4">
                <div className="alert alert-error alert-soft">
                  <span>{teamError}</span>
                </div>
              </div>
            )}

            {teamLoading ? (
              <div className="p-4 flex justify-center">
                <span
                  className="loading loading-spinner loading-sm"
                  aria-label="Cargando empleados…"
                />
              </div>
            ) : employees.length === 0 ? (
              <p className="p-4 text-sm text-fg-subtle">
                Todavía no hay empleados. Generá un código de invitación para sumar uno.
              </p>
            ) : (
              <ul className="divide-y divide-base-300">
                {employees.map((employee) => (
                  <li
                    key={employee.id}
                    className="p-4 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {employee.email}
                      </p>
                      <p className="text-xs text-fg-subtle truncate">
                        {branchName(employee.branchId)} · Desde{" "}
                        {formatDate(employee.createdAt)}
                      </p>
                    </div>

                    {confirmRevokeId === employee.id ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => handleRevokeEmployee(employee.id)}
                          disabled={revokingId === employee.id}
                        >
                          {revokingId === employee.id ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : (
                            "Revocar"
                          )}
                        </button>
                        <button
                          className="btn btn-xs btn-ghost"
                          onClick={() => setConfirmRevokeId(null)}
                          disabled={revokingId === employee.id}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-xs btn-ghost text-error shrink-0"
                        onClick={() => setConfirmRevokeId(employee.id)}
                      >
                        Revocar
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      <div className="mt-8">
        <button
          className="btn btn-outline w-full"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

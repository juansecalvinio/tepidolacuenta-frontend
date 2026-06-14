import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useFetchAuth } from "../../hooks/useFetchAuth";
import { useRestaurants } from "../../hooks/useRestaurants";
import { useSubscription } from "../../hooks/useSubscription";
import { useFetchInvitation } from "../../hooks/useFetchInvitation";

export const Profile = () => {
  const navigate = useNavigate();
  const { user, restaurantId, isOwner } = useAuth();
  const { logout } = useFetchAuth();
  const { restaurant } = useRestaurants();
  const { subscription } = useSubscription();
  const { isLoading: invitationLoading, error: invitationError, invitationCode, invitationExpiresAt, generateInvitation, clearInvitation } = useFetchInvitation();
  const [copied, setCopied] = useState(false);

  const handleGenerateInvitation = async () => {
    if (restaurantId) {
      await generateInvitation(restaurantId);
    }
  };

  const handleCopyCode = async () => {
    if (invitationCode) {
      await navigator.clipboard.writeText(invitationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatExpiresAt = (iso: string) =>
    new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="font-display text-2xl font-semibold mb-6">Tu perfil</h2>

      <div className="bg-base-100 border-2 border-base-300 rounded-xl overflow-hidden">
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
            <p className="text-xs text-base-content/40 uppercase tracking-wider mb-0.5">
              Email
            </p>
            <p className="text-base font-medium break-all leading-snug">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Nombre del local */}
        <div className="p-4">
          <p className="text-xs text-base-content/40 uppercase tracking-wider mb-1">
            Nombre del local
          </p>
          <p className="text-base font-semibold">{restaurant?.name}</p>
        </div>
      </div>

      {isOwner && (
        <>
          <h2 className="font-display text-2xl font-semibold my-6">Suscripción</h2>

          <div className="bg-base-100 border-2 border-base-300 rounded-xl overflow-hidden flex items-center justify-between">
            <div className="p-4">
              <p className="text-xs text-base-content/40 uppercase tracking-wider mb-1">
                Plan actual
              </p>
              <p className="text-base font-semibold">{subscription?.plan?.name}</p>
            </div>
            <span className="p-4">
              <button
                className="btn btn-sm btn-secondary hover:bg-primary/10 transition-colors"
                onClick={() => navigate("/dashboard/plans")}
              >
                Modificar
              </button>
            </span>
          </div>

          <h2 className="font-display text-2xl font-semibold my-6">Equipo</h2>

          <div className="bg-base-100 border-2 border-base-300 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-base-300">
              <p className="text-sm text-base-content/60">
                Generá un código de invitación para que un empleado pueda registrarse. El código expira a los 7 días y es de un solo uso.
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
                    <p className="text-xs text-base-content/50">
                      Expira el {formatExpiresAt(invitationExpiresAt)}
                    </p>
                  )}
                  <button
                    className="btn btn-sm btn-ghost self-start"
                    onClick={clearInvitation}
                  >
                    Generar nuevo código
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleGenerateInvitation}
                  disabled={invitationLoading}
                >
                  {invitationLoading ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    "Generar código de invitación"
                  )}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <div className="mt-8">
        <button
          className="btn btn-error btn-outline w-full"
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

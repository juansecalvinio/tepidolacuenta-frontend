import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFetchAuth } from "../../hooks/useFetchAuth";
import { useFetchInvitation } from "../../hooks/useFetchInvitation";
import { AuthLogo } from "../../components/AuthLogo";

type SelectedRole = "owner" | "employee" | null;

interface CredentialsState {
  email: string;
  password: string;
  isOAuth?: never;
}

interface OAuthState {
  isOAuth: true;
  email?: never;
  password?: never;
}

type LocationState = CredentialsState | OAuthState;

export const RoleSelection = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState | null };
  const { register, login, registerEmployee, isLoading: authLoading, error: authError, clearError } = useFetchAuth();
  const { acceptInvitation, isLoading: invitationLoading, error: invitationError } = useFetchInvitation();

  const [selectedRole, setSelectedRole] = useState<SelectedRole>(null);
  const [invitationCode, setInvitationCode] = useState("");
  const [formError, setFormError] = useState("");

  const isOAuth = state?.isOAuth === true;
  const hasCredentials = !isOAuth && !!state?.email && !!state?.password;

  // Acceso directo sin estado válido → redirigir al inicio del registro
  if (!isOAuth && !hasCredentials) {
    navigate("/register", { replace: true });
    return null;
  }

  const isLoading = authLoading || invitationLoading;
  const error = authError || invitationError || formError;

  const handleSelectRole = (role: SelectedRole) => {
    setSelectedRole(role);
    clearError();
    setFormError("");
    setInvitationCode("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setFormError("");

    if (!selectedRole) return;

    if (selectedRole === "owner") {
      if (isOAuth) {
        // Ya autenticado vía Google → ir directo a selección de plan
        navigate("/dashboard/select-plan");
        return;
      }

      const { email, password } = state as CredentialsState;
      const registerResult = await register({ email, password });
      if (!registerResult.success) return;

      const loginResult = await login({ email, password });
      if (loginResult.success) {
        navigate("/dashboard/select-plan");
      }
      return;
    }

    // Empleado
    if (!invitationCode.trim()) {
      setFormError("Ingresá el código de invitación.");
      return;
    }

    if (isOAuth) {
      // Usuario ya autenticado vía Google → acepta invitación para vincularse como empleado
      const result = await acceptInvitation(invitationCode.trim());
      if (result.success) {
        navigate("/dashboard");
      }
      return;
    }

    // Registro nuevo como empleado (email + contraseña + código)
    const { email, password } = state as CredentialsState;
    const result = await registerEmployee({
      email,
      password,
      invitationCode: invitationCode.trim(),
    });
    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4 py-8">
      <div className="w-full max-w-sm">
        <AuthLogo />

        <div className="card w-full bg-base-100 border-base-300 border-2">
          <div className="card-body p-6">
            <h2 className="font-display text-xl font-semibold mb-1">¿Cómo querés continuar?</h2>
            <p className="text-sm text-base-content/60 mb-4">
              Elegí una opción para configurar tu cuenta.
            </p>

            {error && (
              <div className="alert alert-error alert-soft mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* Opción owner */}
              <button
                type="button"
                onClick={() => handleSelectRole("owner")}
                disabled={isLoading}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-colors ${
                  selectedRole === "owner"
                    ? "border-primary bg-primary/5"
                    : "border-base-300 hover:border-base-content/30"
                }`}
              >
                <span className="text-2xl mt-0.5">🏪</span>
                <div>
                  <p className="font-semibold text-base-content">Registrar mi negocio</p>
                  <p className="text-sm text-base-content/60 mt-0.5">
                    Creá tu local, elegí un plan y administrá tus mesas y sucursales.
                  </p>
                </div>
              </button>

              {/* Opción employee */}
              <button
                type="button"
                onClick={() => handleSelectRole("employee")}
                disabled={isLoading}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-colors ${
                  selectedRole === "employee"
                    ? "border-primary bg-primary/5"
                    : "border-base-300 hover:border-base-content/30"
                }`}
              >
                <span className="text-2xl mt-0.5">🔑</span>
                <div>
                  <p className="font-semibold text-base-content">Tengo un código de invitación</p>
                  <p className="text-sm text-base-content/60 mt-0.5">
                    Ingresá como empleado para ver las mesas y QRs de tu local.
                  </p>
                </div>
              </button>

              {/* Input de código solo cuando se elige employee */}
              {selectedRole === "employee" && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content">Código de invitación</span>
                  </label>
                  <input
                    type="text"
                    placeholder="abc123..."
                    className="input w-full font-mono"
                    value={invitationCode}
                    onChange={(e) => {
                      setInvitationCode(e.target.value);
                      if (formError) setFormError("");
                    }}
                    autoComplete="off"
                    autoFocus
                    disabled={isLoading}
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full mt-2"
                disabled={
                  !selectedRole ||
                  isLoading ||
                  (selectedRole === "employee" && !invitationCode.trim())
                }
              >
                {isLoading ? (
                  <span className="loading loading-spinner" />
                ) : (
                  "Continuar"
                )}
              </button>
            </form>
          </div>
        </div>

        {!isOAuth && (
          <p className="text-center text-sm text-base-content/60 mt-4">
            ¿Querés usar otro email?{" "}
            <button
              className="text-primary font-medium hover:underline"
              onClick={() => navigate("/register")}
            >
              Volver al registro
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

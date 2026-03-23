import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useFetchAuth } from "../../hooks/useFetchAuth";
import { useEffect, useState, type FormEvent } from "react";
import { AuthLogo } from "../../components/AuthLogo";

interface Props {
  authType: "login" | "register";
}

export const AuthPage = ({ authType = "login" }: Props) => {
  const submitButtonText =
    authType === "login" ? "Iniciar sesión" : "Crear usuario";
  const secondaryActionText =
    authType === "login" ? "Crear usuario" : "Ya soy usuario";
  const secondaryActionLink = authType === "login" ? "/register" : "/login";

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, isLoading, error, clearError } = useFetchAuth();

  const googleError =
    searchParams.get("error") === "google_auth_failed"
      ? "No se pudo iniciar sesión con Google. Intentá de nuevo."
      : "";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    secondPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showSecondPassword, setShowSecondPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [secondPasswordTouched, setSecondPasswordTouched] = useState(false);

  useEffect(() => {
    clearError();
    setFormError("");
    setSecondPasswordTouched(false);
  }, [authType]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setFormError("");

    if (authType === "register") {
      // Validar que las contraseñas coincidan
      if (formData.password !== formData.secondPassword) {
        setFormError("Las contraseñas no coinciden");
        return;
      }

      // 1. Registrar usuario
      const registerResult = await register(formData);

      if (!registerResult.success) {
        return;
      }

      // 2. Auto-login con las mismas credenciales
      const loginResult = await login({
        email: formData.email,
        password: formData.password,
      });

      if (loginResult.success) {
        // 3. Redirigir al onboarding
        navigate("/dashboard/onboarding");
      }
    }

    if (authType === "login") {
      const result = await login(formData);

      if (result.success) {
        navigate("/dashboard");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (error) clearError();
    if (formError) setFormError("");
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4 py-8">
      <div className="w-full max-w-sm">
        <AuthLogo />

        {/* Form Card */}
        <div className="card w-full bg-base-100 border-base-300 border-2">
          <div className="card-body p-6">
            <h2 className="text-xl font-semibold mb-2">
              {authType === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </h2>

            {(error || formError || googleError) && (
              <div className="alert alert-error alert-soft">
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
                <span>{error || formError || googleError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="tu@email.com"
                  className="input w-full"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  autoFocus
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text text-base-content">
                    Contraseña
                  </span>
                  {authType === "login" && (
                    <Link
                      to="/forgot-password"
                      className="label-text-alt text-primary hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className={`input w-full ${
                      authType === "register" &&
                      formData.password.length > 0 &&
                      formData.password === formData.secondPassword
                        ? "input-success"
                        : ""
                    }`}
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete={authType === "login" ? "current-password" : "new-password"}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
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
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
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
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {authType === "register" && (
                  <p className="text-xs text-base-content/50 mt-1.5">
                    Mínimo 8 caracteres
                  </p>
                )}
              </div>

              {authType === "register" && (
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text text-base-content">
                      Repetir contraseña
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showSecondPassword ? "text" : "password"}
                      name="secondPassword"
                      placeholder="••••••••"
                      className={`input w-full ${
                        formData.secondPassword.length > 0
                          ? formData.password === formData.secondPassword
                            ? "input-success"
                            : secondPasswordTouched
                              ? "input-error"
                              : ""
                          : ""
                      }`}
                      value={formData.secondPassword}
                      onChange={handleChange}
                      onBlur={() => setSecondPasswordTouched(true)}
                      autoComplete="new-password"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                      onClick={() => setShowSecondPassword(!showSecondPassword)}
                      tabIndex={-1}
                    >
                      {showSecondPassword ? (
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
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
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
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {formData.secondPassword.length > 0 && (
                    <p className={`text-xs mt-1.5 ${
                      formData.password === formData.secondPassword
                        ? "text-success"
                        : secondPasswordTouched
                          ? "text-error"
                          : "text-base-content/50"
                    }`}>
                      {formData.password === formData.secondPassword
                        ? "Las contraseñas coinciden"
                        : "Las contraseñas no coinciden"}
                    </p>
                  )}
                </div>
              )}

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={
                    isLoading ||
                    formData.email === "" ||
                    formData.password === "" ||
                    (authType === "register" &&
                      (formData.secondPassword === "" ||
                        formData.password !== formData.secondPassword))
                  }
                >
                  {isLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    submitButtonText
                  )}
                </button>
              </div>
            </form>

            <div className="divider text-base-content/40 text-xs mt-2">o</div>

            <a
              href={`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/google`}
              className="btn btn-outline w-full gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </a>
          </div>
        </div>

        <p className="text-center text-sm text-base-content/60 mt-4">
          {authType === "login" ? "¿No tenés cuenta? " : "¿Ya tenés cuenta? "}
          <Link
            to={secondaryActionLink}
            className="text-primary font-medium hover:underline"
          >
            {secondaryActionText}
          </Link>
        </p>
      </div>
    </div>
  );
};

import { Link, useNavigate } from "react-router-dom";
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
  const { login, register, isLoading, error, clearError } = useFetchAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    secondPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showSecondPassword, setShowSecondPassword] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    clearError();
    setFormError("");
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-base-200 p-4 pt-16">
      <div className="w-full max-w-sm">
        <AuthLogo />

        {/* Form Card */}
        <div className="card w-full bg-base-100 border-base-300 border-2">
          <div className="card-body p-6">
            {(error || formError) && (
              <div
                //  className="alert alert-error text-red-400 bg-red-950 border-red-400 rounded-3xl"
                className="alert alert-error alert-soft"
              >
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
                <span>{error || formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content mb-4">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="tu@email.com"
                  className="input w-full rounded-3xl p-6"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text text-base-content mb-4">
                    Contraseña
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="input w-full rounded-3xl p-6"
                    value={formData.password}
                    onChange={handleChange}
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
              </div>

              {authType === "register" && (
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text text-base-content mb-4">
                      Repetir contraseña
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showSecondPassword ? "text" : "password"}
                      name="secondPassword"
                      placeholder="••••••••"
                      className="input w-full rounded-3xl p-6"
                      value={formData.secondPassword}
                      onChange={handleChange}
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
                </div>
              )}

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary w-full rounded-3xl p-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    submitButtonText
                  )}
                </button>
              </div>
            </form>

            <div className="divider">O</div>

            <Link
              to={secondaryActionLink}
              className="btn btn-secondary w-full rounded-3xl p-6"
              tabIndex={-1}
            >
              {secondaryActionText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

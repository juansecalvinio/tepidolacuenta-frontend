import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthLogo } from "../../components/AuthLogo";
import { useFetchAuth } from "../../hooks/useFetchAuth";

export const ForgotPassword = () => {
  const { forgotPassword, isLoading, error, clearError } = useFetchAuth();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await forgotPassword({ email });
    if (result.success) {
      setSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) clearError();
    setEmail(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4 py-8">
      <div className="w-full max-w-sm">
        <AuthLogo />

        <div className="card w-full bg-base-100 border-base-300 border-2">
          <div className="card-body p-6">
            {submitted ? (
              <div className="text-center py-2">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-success"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">Revisá tu correo</h2>
                <p className="text-sm text-base-content/60">
                  Si el email <span className="font-medium text-base-content">{email}</span> está
                  registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-1">Olvidé mi contraseña</h2>
                <p className="text-sm text-base-content/60 mb-2">
                  Ingresá tu email y te enviamos un enlace para restablecerla.
                </p>

                {error && (
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
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-base-content">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      className="input w-full"
                      value={email}
                      onChange={handleChange}
                      autoComplete="email"
                      autoFocus
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-control mt-6">
                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={isLoading || email === ""}
                    >
                      {isLoading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        "Enviar enlace"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-base-content/60 mt-4">
          <Link to="/login" className="text-primary font-medium hover:underline">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

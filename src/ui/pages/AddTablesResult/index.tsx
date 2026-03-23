import { useLocation, useNavigate } from "react-router-dom";

export const AddTablesResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quantity, status } = location.state || {};

  return (
    <div className="p-4 max-w-2xl mx-auto mt-12">
      <div className="flex flex-col items-center gap-8">
        {status === "success" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-16 text-success"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        )}

        {status === "error" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-16 text-error"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        )}

        <div className="flex flex-col items-center">
          <h2 className="text-3xl text-center font-bold mb-2">
            {status === "success"
              ? "Se crearon nuevas mesas para tu local"
              : "No se pudo realizar la creación de mesas"}
          </h2>
          {status === "success" && quantity && (
            <p className="text-xl font-light">
              Cantidad de mesas creadas: {quantity}
            </p>
          )}
          {status === "error" && (
            <>
              <p className="text-xl font-light text-center">
                Posiblemente exista un error en nuestros servidores.
              </p>
              <p className="text-xl font-light text-center">
                Por favor intentá nuevamente en unos minutos.
              </p>
            </>
          )}
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/dashboard")}
        >
          Volver al dashboard
        </button>
      </div>
    </div>
  );
};

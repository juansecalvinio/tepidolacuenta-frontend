import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchRestaurant } from "../../../hooks/useFetchRestaurant";
import { useFetchTables } from "../../../hooks/useFetchTables";
import { useTables } from "../../../hooks/useTables";

export const Onboarding = () => {
  const navigate = useNavigate();
  const { createRestaurant } = useFetchRestaurant();
  const { createTables } = useFetchTables();
  const { isLoading, error } = useTables();

  const [restaurantName, setRestaurantName] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar nombre del restaurante
    if (!restaurantName.trim()) {
      setValidationError("Ingresa el nombre de tu restaurante");
      return;
    }

    const numQuantity = Number(quantity);

    if (!quantity || isNaN(numQuantity)) {
      setValidationError("Ingresa una cantidad válida de mesas");
      return;
    }

    if (numQuantity < 1 || numQuantity > 100) {
      setValidationError("La cantidad de mesas debe estar entre 1 y 100");
      return;
    }

    setValidationError("");

    // 1. Crear restaurante primero
    const restaurantResult = await createRestaurant({
      name: restaurantName.trim(),
    });

    if (!restaurantResult.success || !restaurantResult.data) {
      setValidationError(
        restaurantResult.error || "Error al crear el restaurante"
      );
      return;
    }

    // 2. Crear las mesas pasando el restaurantId recién creado
    const tablesResult = await createTables(numQuantity, restaurantResult.data.id);

    if (tablesResult.success) {
      navigate("/dashboard");
    }
  };

  const handleRestaurantNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRestaurantName(e.target.value);
    setValidationError("");
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
    setValidationError("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-extrabold tracking-tighter text-center mb-2">
          tepidolacuenta
        </h1>
        <p className="text-center text-base-content/60 mb-8">
          Configuración inicial
        </p>

        <div className="card w-full bg-base-100 shadow-xl">
          <div className="card-body p-6">
            <h2 className="text-2xl font-bold text-center mb-2">
              Configurar tu restaurante
            </h2>
            <p className="text-sm text-center text-base-content/70 mb-6">
              Completa los datos para comenzar
            </p>

            {(error || validationError) && (
              <div className="alert alert-soft alert-error mb-4">
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
                <span>{validationError || error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nombre del restaurante</span>
                </label>
                <input
                  type="text"
                  name="restaurantName"
                  placeholder="Ej: Mi Restaurante"
                  className="input input-bordered w-full"
                  value={restaurantName}
                  onChange={handleRestaurantNameChange}
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Cantidad de mesas</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Ej: 10"
                  className="input input-bordered text-center text-2xl font-bold w-full"
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={isLoading}
                />
                <label className="label">
                  <span className="label-text-alt">Mínimo 1, máximo 100</span>
                </label>
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Comenzar"
                  )}
                </button>
              </div>
            </form>

            {restaurantName &&
              quantity &&
              Number(quantity) > 0 &&
              Number(quantity) <= 100 && (
                <div className="mt-6 p-4 bg-base-200 rounded-lg">
                  <p className="text-xs text-center text-base-content/60 mb-2">
                    <strong>{restaurantName}</strong>
                  </p>
                  <p className="text-xs text-center text-base-content/60">
                    Se crearán {quantity}{" "}
                    {Number(quantity) === 1 ? "mesa" : "mesas"} numeradas del 1
                    al {quantity}
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

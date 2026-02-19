import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchRestaurant } from "../../hooks/useFetchRestaurant";
import { useTables } from "../../hooks/useTables";
import { AuthLogo } from "../../components/AuthLogo";

export const Onboarding = () => {
  const navigate = useNavigate();
  const { createRestaurant } = useFetchRestaurant();
  const { isLoading, error } = useTables();

  const [restaurantName, setRestaurantName] = useState<string>("");
  const [cuit, setCuit] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar nombre del restaurante
    if (!restaurantName.trim()) {
      setValidationError("Ingresa el nombre de tu restaurante");
      return;
    }

    if (!cuit.trim()) {
      setValidationError("Ingresa el CUIT de tu restaurante");
      return;
    }

    if (!address.trim()) {
      setValidationError("Ingresa la dirección de tu restaurante");
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

    const restaurantResult = await createRestaurant({
      name: restaurantName.trim(),
      address: address.trim(),
      cuit: cuit.trim(),
      tableCount: numQuantity,
    });

    if (!restaurantResult.success || !restaurantResult.data) {
      setValidationError(
        restaurantResult.error || "Error al crear el restaurante",
      );
      return;
    }

    if (restaurantResult.success) {
      navigate("/dashboard");
    }
  };

  const handleRestaurantNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRestaurantName(e.target.value);
    setValidationError("");
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setValidationError("");
  };

  const handleCuitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cuitValue = e.target.value;
    // Permitir solo números
    if (!/^\d*$/.test(cuitValue)) {
      setValidationError("El CUIT debe contener solo números");
      return;
    }
    setCuit(cuitValue);
    setValidationError("");
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
    setValidationError("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-base-100 p-4 mt-4">
      <div className="w-full max-w-md">
        <AuthLogo />

        <div className="card w-full bg-base-100 shadow-xl">
          <div className="card-body p-6">
            <h2 className="text-2xl font-bold text-center mb-2">
              Configura tu local
            </h2>

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
                <span>{error || validationError}</span>
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
                  placeholder="Mi Restaurante"
                  className="input input-bordered w-full"
                  value={restaurantName}
                  onChange={handleRestaurantNameChange}
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Dirección de la sucursal</span>
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Mi dirección"
                  className="input input-bordered w-full"
                  value={address}
                  onChange={handleAddressChange}
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">
                    Ingresá el CUIT (sin guiones)
                  </span>
                </label>
                <input
                  type="text"
                  name="cuit"
                  placeholder="11222233334"
                  className="input input-bordered w-full"
                  value={cuit}
                  onChange={handleCuitChange}
                  disabled={isLoading}
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Cantidad de mesas</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="0"
                  className="input input-bordered text-center text-2xl font-bold w-full"
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={isLoading}
                />
                {/* <label className="label">
                  <span className="label-text-alt">Mínimo 1, máximo 100</span>
                </label> */}
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

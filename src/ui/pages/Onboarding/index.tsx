import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFetchRestaurant } from "../../hooks/useFetchRestaurant";
import { useFetchSubscription } from "../../hooks/useFetchSubscription";
import { useTables } from "../../hooks/useTables";
import { AuthLogo } from "../../components/AuthLogo";
import { Alert } from "../../components/Alert";
import type { Plan } from "../../../core/modules/subscription/domain/models/Subscription";

export const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlan = location.state?.plan as Plan | undefined;

  const { createRestaurant } = useFetchRestaurant();
  const { createSubscription } = useFetchSubscription();
  const { error } = useTables();

  const [restaurantName, setRestaurantName] = useState<string>("");
  const [cuit, setCuit] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedPlan) {
      navigate("/dashboard/select-plan", { replace: true });
    }
  }, [selectedPlan, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedPlan) return;

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

    if (
      selectedPlan.maxTables !== -1 &&
      numQuantity > selectedPlan.maxTables
    ) {
      setValidationError(
        `Tu plan permite hasta ${selectedPlan.maxTables} ${selectedPlan.maxTables === 1 ? "mesa" : "mesas"}`,
      );
      return;
    }

    setValidationError("");
    setIsSubmitting(true);

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
      setIsSubmitting(false);
      return;
    }

    const subResult = await createSubscription({
      restaurantId: restaurantResult.data.restaurant.id,
      planId: selectedPlan.id,
      startTrial: true,
    });

    if (!subResult.success) {
      setValidationError(
        subResult.error || "Error al activar el plan seleccionado",
      );
      setIsSubmitting(false);
      return;
    }

    navigate("/dashboard");
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

  const maxTablesHint =
    selectedPlan && selectedPlan.maxTables !== -1
      ? `Tu plan permite hasta ${selectedPlan.maxTables} ${selectedPlan.maxTables === 1 ? "mesa" : "mesas"}`
      : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-base-100 p-4 mt-4">
      <div className="w-full max-w-md">
        <AuthLogo />

        <div className="card w-full bg-base-100 shadow-xl">
          <div className="card-body p-6">
            <h2 className="font-display text-2xl font-semibold text-center mb-2">
              Configura tu local
            </h2>

            {selectedPlan && (
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="badge badge-primary badge-sm">
                  {selectedPlan.name}
                </span>
                {selectedPlan.trialDays > 0 && (
                  <span className="text-xs opacity-60">
                    {selectedPlan.trialDays} días de prueba gratis
                  </span>
                )}
              </div>
            )}

            {(error || validationError) && (
              <Alert className="mb-4">{error || validationError}</Alert>
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Cantidad de mesas</span>
                  {maxTablesHint && (
                    <span className="label-text-alt opacity-60">
                      {maxTablesHint}
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="0"
                  className="input input-bordered text-center text-2xl font-bold w-full"
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
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

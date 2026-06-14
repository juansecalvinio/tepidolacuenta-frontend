import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurants } from "../../hooks/useRestaurants";
import { useFetchTables } from "../../hooks/useFetchTables";
import { useTables } from "../../hooks/useTables";
import { useSubscription } from "../../hooks/useSubscription";
import { PlanLimitReached } from "../../components/PlanLimitReached";

export const AddTables = () => {
  const navigate = useNavigate();
  const { createTables } = useFetchTables();
  const { activeBranch } = useRestaurants();
  const { tables, isLoading } = useTables();
  const { currentPlan } = useSubscription();

  const [quantity, setQuantity] = useState(1);

  const maxTables = currentPlan?.maxTables ?? -1;
  const currentCount = tables.length;
  const isAtLimit = maxTables !== -1 && currentCount >= maxTables;
  const wouldExceedLimit = maxTables !== -1 && currentCount + quantity > maxTables;
  const remaining = maxTables !== -1 ? maxTables - currentCount : null;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(+e.target.value);
  };

  const onCancel = () => {
    navigate(-1);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (quantity < 1) return;

    const result = await createTables(quantity, activeBranch!.id);

    if (!result.success) {
      navigate("/dashboard/tables/add-tables/result", {
        state: { status: "error" },
      });
    }

    if (result.success) {
      navigate("/dashboard/tables/add-tables/result", {
        state: { status: "success", quantity: quantity },
      });
    }
  };

  if (isAtLimit) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <h2 className="font-display text-xl text-center font-semibold mb-6">
          Agregar mesas a {activeBranch?.address || "tu sucursal"}
        </h2>
        <PlanLimitReached
          title="Límite de mesas alcanzado"
          description={`Tu plan actual permite hasta ${maxTables} ${maxTables === 1 ? "mesa" : "mesas"}. Actualizá tu plan para poder agregar más.`}
        />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="font-display text-xl text-center font-semibold mb-6">
        Agregar mesas a {activeBranch?.address || "tu sucursal"}
      </h2>

      {wouldExceedLimit && remaining !== null && (
        <div role="alert" className="alert alert-soft alert-warning mb-4">
          <span>
            Con esa cantidad superarías el límite de tu plan. Solo podés
            agregar <strong>{remaining} {remaining === 1 ? "mesa" : "mesas"}</strong> más.
          </span>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="bg-base-100 border border-base-300 p-4 rounded-xl">
          <div className="form-control flex items-baseline justify-between gap-2 w-full">
            <label className="label">
              <span className="label-text text-base-content text-lg">
                Cantidad de mesas
              </span>
            </label>
            <input
              type="text"
              name="quantity"
              placeholder="1"
              className="input input-bordered text-center text-lg font-bold"
              value={quantity}
              onChange={handleQuantityChange}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex w-full gap-4 items-center mt-6">
          <button
            type="button"
            className="btn btn-ghost flex-1"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={quantity < 1 || isLoading || wouldExceedLimit}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Confirmar"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

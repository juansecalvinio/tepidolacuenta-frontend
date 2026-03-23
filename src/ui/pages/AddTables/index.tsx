import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurants } from "../../hooks/useRestaurants";
import { useFetchTables } from "../../hooks/useFetchTables";
import { useTables } from "../../hooks/useTables";

export const AddTables = () => {
  const navigate = useNavigate();
  const { createTables } = useFetchTables();
  const { activeBranch } = useRestaurants();
  const { isLoading } = useTables();

  const [quantity, setQuantity] = useState(1);

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

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl text-center font-bold mb-6">
        Agregar mesas a {activeBranch?.address || "tu sucursal"}
      </h2>

      <form onSubmit={onSubmit}>
        <div className="bg-base-100 border-2 border-base-300 p-4 rounded-xl">
          <div className="form-control flex items-baseline justify-between gap-2 w-full">
            <label className="label">
              <span className="label-text text-base-content text-xl">
                Cantidad de mesas
              </span>
            </label>
            <input
              type="text"
              name="quantity"
              placeholder="1"
              className="input input-bordered text-center text-2xl font-bold"
              value={quantity}
              onChange={handleQuantityChange}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex w-full gap-4 items-center mt-6">
          <button
            type="button"
            className="btn btn-neutral flex-1"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={quantity < 1 || isLoading}
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

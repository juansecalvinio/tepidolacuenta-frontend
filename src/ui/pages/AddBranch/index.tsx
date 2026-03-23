import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { CreateBranchRequest } from "../../../core/modules/restaurant/domain/models/Restaurant";
import { useFetchBranches } from "../../hooks/useFetchBranches";
import { useRestaurants } from "../../hooks/useRestaurants";

export const AddBranch = () => {
  const navigate = useNavigate();
  const { createBranch } = useFetchBranches();
  const { restaurant, isLoading } = useRestaurants();

  const [formData, setFormData] = useState<CreateBranchRequest>({
    restaurantId: restaurant?.id || "",
    name: "",
    address: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onCancel = () => {
    navigate(-1);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const createBranchResult = await createBranch(formData);
    console.log("🚀 ~ onSubmit ~ createBranchResult:", createBranchResult);

    if (!createBranchResult.success) {
      navigate("/dashboard/restaurant/add-branch/result", {
        state: { status: "error" },
      });
    }

    if (createBranchResult.success) {
      navigate("/dashboard/restaurant/add-branch/result", {
        state: { branch: createBranchResult.data, status: "success" },
      });
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-3xl text-center font-bold mb-6">
        Agregar nueva sucursal
      </h2>

      <form onSubmit={onSubmit}>
        <div className="bg-base-100 border-2 border-base-300 p-4 rounded-xl">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content mb-2">
                Dirección de la sucursal
              </span>
            </label>
            <input
              type="text"
              name="address"
              placeholder="Dirección de la sucursal"
              className="input input-lg w-full"
              value={formData.address}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content my-2">
                Nombre de la sucursal
              </span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Nombre de la sucursal"
              className="input input-lg w-full"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content my-2">
                Descripción
              </span>
            </label>
            <input
              type="text"
              name="description"
              className="textarea w-full"
              value={formData.description}
              onChange={handleChange}
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
          <button type="submit" className="btn btn-primary flex-1">
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

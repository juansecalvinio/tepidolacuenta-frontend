import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurants } from "../../hooks/useRestaurants";
import { useFetchBranches } from "../../hooks/useFetchBranches";
import type { Branch } from "../../../core/modules/restaurant/domain/models/Restaurant";

export const Restaurant = () => {
  const navigate = useNavigate();
  const { restaurant, activeBranch, branches } = useRestaurants();
  const { updateBranch, deleteBranch } = useFetchBranches();

  const editModalRef = useRef<HTMLDialogElement>(null);
  const deleteModalRef = useRef<HTMLDialogElement>(null);

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [editForm, setEditForm] = useState({ name: "", address: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const openEditModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setEditForm({ name: branch.name, address: branch.address, description: branch.description });
    setFormError("");
    editModalRef.current?.showModal();
  };

  const openDeleteModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setFormError("");
    deleteModalRef.current?.showModal();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranch) return;

    setIsSubmitting(true);
    setFormError("");

    const result = await updateBranch(selectedBranch.id, editForm);

    setIsSubmitting(false);

    if (result.success) {
      editModalRef.current?.close();
    } else {
      setFormError(result.error ?? "Ocurrió un error al guardar los cambios.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBranch) return;

    setIsSubmitting(true);
    setFormError("");

    const result = await deleteBranch(selectedBranch.id);

    setIsSubmitting(false);

    if (result.success) {
      deleteModalRef.current?.close();
    } else {
      setFormError(result.error ?? "Ocurrió un error al eliminar la sucursal.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Información de tu local</h2>

      <div className="bg-base-100 border-2 border-base-300 rounded-xl">
        <div className="p-4 flex items-center justify-between">
          <p className="text-2xl">{restaurant?.name}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/dashboard/restaurant/add-branch")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Agregar sucursal
          </button>
        </div>

        <ul className="list bg-base-100 rounded-box">
          <li className="px-4 pb-2 text-lg opacity-60 tracking-wide">
            Sucursales
          </li>

          {branches?.map((branch) => (
            <li
              className="list-row flex items-center justify-between"
              key={branch.id}
            >
              <div className="flex items-center gap-4">
                <div className="text-lg">{branch.address}</div>
                {activeBranch?.id === branch.id && (
                  <div className="badge badge-success mt-1">
                    Sucursal activa
                  </div>
                )}
              </div>

              <div>
                <button
                  className="btn btn-square btn-ghost"
                  onClick={() => openEditModal(branch)}
                  aria-label="Editar sucursal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>

                <button
                  className="btn btn-square btn-ghost text-error"
                  onClick={() => openDeleteModal(branch)}
                  aria-label="Eliminar sucursal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit modal */}
      <dialog ref={editModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Editar sucursal</h3>

          {formError && (
            <div className="alert alert-error alert-soft mb-4">
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleEditSubmit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Nombre</span>
              </label>
              <input
                type="text"
                className="input w-full"
                value={editForm.name}
                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Dirección</span>
              </label>
              <input
                type="text"
                className="input w-full"
                value={editForm.address}
                onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">Descripción</span>
              </label>
              <textarea
                className="textarea w-full"
                value={editForm.description}
                onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => editModalRef.current?.close()}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || !editForm.name || !editForm.address}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Guardar cambios"
                )}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>cerrar</button>
        </form>
      </dialog>

      {/* Delete modal */}
      <dialog ref={deleteModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-2">Eliminar sucursal</h3>
          <p className="text-base-content/70 mb-2">
            ¿Estás seguro que querés eliminar la sucursal{" "}
            <span className="font-semibold text-base-content">
              {selectedBranch?.address}
            </span>
            ?
          </p>
          <p className="text-sm text-error mb-6">
            Esta acción no se puede deshacer.
          </p>

          {formError && (
            <div className="alert alert-error alert-soft mb-4">
              <span>{formError}</span>
            </div>
          )}

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => deleteModalRef.current?.close()}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Eliminar"
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>cerrar</button>
        </form>
      </dialog>
    </div>
  );
};

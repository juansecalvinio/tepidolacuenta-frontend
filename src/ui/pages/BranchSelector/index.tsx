import { useRestaurants } from "../../hooks/useRestaurants";
import { useAuth } from "../../hooks/useAuth";

export const BranchSelector = () => {
  const { activeBranch, branches, setActiveBranch } = useRestaurants();
  const { isOwner, branchId } = useAuth();

  // Empleado: queda bloqueado a su sucursal, sin poder cambiarla.
  if (!isOwner) {
    const ownBranch =
      branches?.find((b) => b.id === branchId) ?? activeBranch ?? null;
    if (!ownBranch) return null;
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm">Sucursal</p>
        <span className="text-sm font-medium max-w-36 sm:max-w-52 truncate">
          {ownBranch.address}
        </span>
      </div>
    );
  }

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = branches?.find((b) => b.id === e.target.value) ?? null;
    setActiveBranch(selected);
  };

  const sortedBranches = activeBranch
    ? [
        activeBranch,
        ...(branches?.filter((b) => b.id !== activeBranch.id) ?? []),
      ]
    : (branches ?? []);

  if (!sortedBranches.length) return null;

  return (
    <div className="flex items-center gap-4">
      <p className="text-sm">Sucursal</p>
      <select
        value={activeBranch?.id ?? ""}
        className="select select-sm border-base-300 max-w-36 sm:max-w-52 text-sm"
        onChange={handleBranchChange}
      >
        {sortedBranches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.address}
          </option>
        ))}
      </select>
    </div>
  );
};

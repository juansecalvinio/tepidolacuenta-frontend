import { useRestaurants } from "../../hooks/useRestaurants";
import { useAuth } from "../../hooks/useAuth";
import { MapPinIcon, ChevronDownIcon, CheckIcon } from "../../components/icons";

export const BranchSelector = () => {
  const { activeBranch, branches, setActiveBranch } = useRestaurants();
  const { isOwner, branchId } = useAuth();

  // Empleado: chip estático con su sucursal (queda bloqueado, no la cambia).
  if (!isOwner) {
    const ownBranch =
      branches?.find((b) => b.id === branchId) ?? activeBranch ?? null;
    if (!ownBranch) return null;
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-base-300 text-sm max-w-40 sm:max-w-56">
        <MapPinIcon className="w-4 h-4 text-primary shrink-0" />
        <span className="truncate font-medium">{ownBranch.address}</span>
      </div>
    );
  }

  const sortedBranches = activeBranch
    ? [
        activeBranch,
        ...(branches?.filter((b) => b.id !== activeBranch.id) ?? []),
      ]
    : (branches ?? []);

  if (!sortedBranches.length) return null;

  const selectBranch = (branch: (typeof sortedBranches)[number]) => {
    setActiveBranch(branch);
    // daisyUI cierra el dropdown al perder el foco.
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <button
        tabIndex={0}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-base-300 text-sm hover:bg-base-200 transition-colors max-w-40 sm:max-w-56"
        aria-label="Cambiar de sucursal"
      >
        <MapPinIcon className="w-4 h-4 text-primary shrink-0" />
        <span className="truncate font-medium">{activeBranch?.address}</span>
        <ChevronDownIcon className="w-3.5 h-3.5 text-fg-soft shrink-0" />
      </button>

      <ul
        tabIndex={0}
        className="dropdown-content menu menu-sm mt-2 w-60 rounded-box bg-base-100 border border-base-300 p-1.5 z-50"
      >
        {sortedBranches.map((branch) => {
          const isActive = branch.id === activeBranch?.id;
          return (
            <li key={branch.id}>
              <button
                onClick={() => selectBranch(branch)}
                className={isActive ? "active font-medium" : ""}
              >
                <MapPinIcon className="w-4 h-4 shrink-0 text-fg-subtle" />
                <span className="truncate">{branch.address}</span>
                {isActive && (
                  <CheckIcon className="w-4 h-4 ml-auto text-primary shrink-0" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

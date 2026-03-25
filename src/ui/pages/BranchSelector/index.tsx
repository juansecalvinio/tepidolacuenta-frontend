import { useRestaurants } from "../../hooks/useRestaurants";

export const BranchSelector = () => {
  const { activeBranch, branches, setActiveBranch } = useRestaurants();

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
  );
};

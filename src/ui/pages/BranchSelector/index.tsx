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

  return (
    <select
      value={activeBranch?.id ?? ""}
      className="select select-lg border-base-300"
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

import { useTablesContext } from "../contexts/tables.context";

export const useTables = () => {
  const { tables, isLoading, error, hasSetupTables } = useTablesContext();

  return {
    tables,
    isLoading,
    error,
    hasSetupTables,
  };
};

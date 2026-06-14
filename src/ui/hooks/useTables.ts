import { useShallow } from "zustand/react/shallow";
import { useTablesContext } from "../contexts/tables.context";

export const useTables = () =>
  useTablesContext(
    useShallow((s) => ({
      tables: s.tables,
      isLoading: s.isLoading,
      error: s.error,
      hasSetupTables: s.hasSetupTables,
    })),
  );

import { create } from "zustand";
import type { Table } from "../../core/modules/tables/domain/models/Table";

interface TablesContext {
  tables: Table[];
  isLoading: boolean;
  error: string | null;
  hasSetupTables: boolean;

  setTables: (tables: Table[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setHasSetupTables: (hasSetup: boolean) => void;
}

export const useTablesContext = create<TablesContext>((set) => ({
  tables: [],
  isLoading: false,
  error: null,
  hasSetupTables: false,

  setTables: (tables) => set({ tables, hasSetupTables: tables.length > 0 }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setHasSetupTables: (hasSetup) => set({ hasSetupTables: hasSetup }),
}));

export type { TablesContext };

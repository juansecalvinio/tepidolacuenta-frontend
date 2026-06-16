import type { TableRepository } from "../../domain/repositories/TableRepository";
import { ApiTableRepository } from "./ApiTableRepository";
import { MockTableRepository } from "./MockTableRepository";

let instance: TableRepository | null = null;

export const getTableRepository = (): TableRepository => {
  if (!instance) {
    const useMock = import.meta.env.VITE_USE_MOCK === "true";
    instance = useMock ? new MockTableRepository() : new ApiTableRepository();
  }
  return instance;
};

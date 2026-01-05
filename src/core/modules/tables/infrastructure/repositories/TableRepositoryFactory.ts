import type { TableRepository } from "../../domain/repositories/TableRepository";
import { ApiTableRepository } from "./ApiTableRepository";
import { MockTableRepository } from "./MockTableRepository";

export const getTableRepository = (): TableRepository => {
  const useMock = import.meta.env.VITE_USE_MOCK === "true";
  return useMock ? new MockTableRepository() : new ApiTableRepository();
};

import { create } from "zustand";
import type { BillRequest } from "../../core/modules/bill-request/domain/models/BillRequest";

interface BillRequestContext {
  requests: BillRequest[];
  isLoading: boolean;
  isRequested: boolean;
  error: string | null;

  setRequests: (requests: BillRequest[]) => void;
  addRequest: (request: BillRequest) => void;
  updateRequest: (requestId: string, updates: Partial<BillRequest>) => void;
  removeRequest: (requestId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setIsRequested: (isRequested: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useBillRequestContext = create<BillRequestContext>((set) => ({
  requests: [],
  isLoading: false,
  isRequested: false,
  error: null,

  setRequests: (requests) => set({ requests }),
  addRequest: (request) =>
    set((state) => ({
      requests: [request, ...state.requests],
    })),
  updateRequest: (requestId, updates) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === requestId ? { ...req, ...updates } : req
      ),
    })),
  removeRequest: (requestId) =>
    set((state) => ({
      requests: state.requests.filter((req) => req.id !== requestId),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setIsRequested: (isRequested) => set({ isRequested }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export type { BillRequestContext };

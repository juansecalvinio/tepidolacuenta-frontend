export interface BillRequestWsResponse {
  id: string;
  restaurantId: string;
  branchId: string;
  tableId: string;
  tableNumber: number;
  status: "pending" | "attended";
  createdAt: string;
  updatedAt: string;
}

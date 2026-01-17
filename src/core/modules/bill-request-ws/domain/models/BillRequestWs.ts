export interface BillRequestWsResponse {
  id: string;
  restaurantId: string;
  tableId: string;
  tableNumber: number;
  status: "pending" | "attended";
  createdAt: string;
  updatedAt: string;
}

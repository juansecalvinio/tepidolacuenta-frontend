export interface Table {
  id: string;
  restaurantId: string;
  number: number;
  capacity: number;
  qrCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTablesRequest {
  restaurantId: string;
  count: number;
}

export interface CreateTablesResponse {
  success: boolean;
  message: string;
  data: Table[];
}

export interface GetTablesResponse {
  success: boolean;
  message: string;
  data: Table[];
}

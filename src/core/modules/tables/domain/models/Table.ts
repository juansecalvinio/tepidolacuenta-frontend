export interface Table {
  id: string;
  branchId: string;
  number: number;
  qrCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTablesRequest {
  branchId: string;
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

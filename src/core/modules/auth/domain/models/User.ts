export type UserRole = "owner" | "employee";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  restaurantId?: string;
  branchId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

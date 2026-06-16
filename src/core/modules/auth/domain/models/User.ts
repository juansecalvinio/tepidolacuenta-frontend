export type UserRole = "owner" | "employee";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  restaurantId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

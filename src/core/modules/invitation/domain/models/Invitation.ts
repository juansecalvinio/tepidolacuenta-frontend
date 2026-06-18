import type { User } from "../../../auth/domain/models/User";

export interface GenerateInvitationRequest {
  restaurantId: string;
  branchId: string;
}

export interface GenerateInvitationResponse {
  success: boolean;
  message: string;
  data: {
    code: string;
    expiresAt: string;
  };
}

export interface AcceptInvitationRequest {
  code: string;
}

export interface AcceptInvitationResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token?: string;
  };
}

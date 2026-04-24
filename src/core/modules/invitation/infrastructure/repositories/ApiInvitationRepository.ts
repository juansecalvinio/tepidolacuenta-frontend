import { api } from "../../../../api/http-client";
import type {
  GenerateInvitationRequest,
  GenerateInvitationResponse,
  AcceptInvitationRequest,
  AcceptInvitationResponse,
} from "../../domain/models/Invitation";
import type { InvitationRepository } from "../../domain/repositories/InvitationRepository";

export const ApiInvitationRepository: InvitationRepository = {
  async generateInvitation(request: GenerateInvitationRequest): Promise<GenerateInvitationResponse> {
    return await api.post<GenerateInvitationResponse>("/api/v1/invitations/generate", request);
  },

  async acceptInvitation(request: AcceptInvitationRequest): Promise<AcceptInvitationResponse> {
    return await api.post<AcceptInvitationResponse>("/api/v1/invitations/accept", request);
  },
};

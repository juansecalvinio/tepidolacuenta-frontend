import type {
  GenerateInvitationRequest,
  GenerateInvitationResponse,
  AcceptInvitationRequest,
  AcceptInvitationResponse,
} from "../models/Invitation";

export interface InvitationRepository {
  generateInvitation: (request: GenerateInvitationRequest) => Promise<GenerateInvitationResponse>;
  acceptInvitation: (request: AcceptInvitationRequest) => Promise<AcceptInvitationResponse>;
}

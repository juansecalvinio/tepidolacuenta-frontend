import type { InvitationRepository } from "../domain/repositories/InvitationRepository";
import type { AcceptInvitationRequest, AcceptInvitationResponse } from "../domain/models/Invitation";

export function AcceptInvitation(repository: InvitationRepository) {
  return async function (request: AcceptInvitationRequest): Promise<AcceptInvitationResponse> {
    return await repository.acceptInvitation(request);
  };
}

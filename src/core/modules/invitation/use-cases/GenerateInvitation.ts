import type { InvitationRepository } from "../domain/repositories/InvitationRepository";
import type { GenerateInvitationRequest, GenerateInvitationResponse } from "../domain/models/Invitation";

export function GenerateInvitation(repository: InvitationRepository) {
  return async function (request: GenerateInvitationRequest): Promise<GenerateInvitationResponse> {
    return await repository.generateInvitation(request);
  };
}

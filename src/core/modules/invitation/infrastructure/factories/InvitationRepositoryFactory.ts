import type { InvitationRepository } from "../../domain/repositories/InvitationRepository";
import { ApiInvitationRepository } from "../repositories/ApiInvitationRepository";

export const getInvitationRepository = (): InvitationRepository => {
  return ApiInvitationRepository;
};

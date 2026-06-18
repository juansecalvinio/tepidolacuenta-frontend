import type { TeamRepository } from "../../domain/repositories/TeamRepository";
import { ApiTeamRepository } from "../repositories/ApiTeamRepository";

export const getTeamRepository = (): TeamRepository => {
  return ApiTeamRepository;
};

import type {
  GetVenueInfoResponse,
  VenueInfoParams,
} from "../domain/models/BillRequest";
import type { BillRequestRepository } from "../domain/repositories/BillRequestRepository";

export const GetVenueInfo = (repository: BillRequestRepository) => {
  return async (params: VenueInfoParams): Promise<GetVenueInfoResponse> => {
    return await repository.getVenueInfo(params);
  };
};

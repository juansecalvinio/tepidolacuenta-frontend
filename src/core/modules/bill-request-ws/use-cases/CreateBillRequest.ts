import type {
  CreateBillRequestBody,
  CreateBillRequestResponse,
} from "../domain/models/BillRequest";
import type { BillRequestRepository } from "../domain/repositories/BillRequestRepository";

export const CreateBillRequest = (repository: BillRequestRepository) => {
  return async (
    request: CreateBillRequestBody
  ): Promise<CreateBillRequestResponse> => {
    return await repository.createBillRequest(request);
  };
};

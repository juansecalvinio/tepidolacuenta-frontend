import type { BillRequest } from "../../../core/modules/bill-request/domain/models/BillRequest";
import { TimeUtils } from "../../utils/time.utils";

interface Props {
  request: BillRequest;
  onClick: () => void;
}

export const PendingRequestCard = ({ request, onClick }: Props) => {
  return (
    <div
      key={request.id}
      className="card bg-base-100 shadow-md border-l-4 border-success"
    >
      <div className="card-body p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <div>
              <div className="font-bold text-lg">
                Mesa {request.tableNumber}
              </div>
              <div className="text-sm text-base-content/60">
                {TimeUtils.formatTime(request.createdAt)} •{" "}
                {TimeUtils.getTimeAgo(request.createdAt)}
              </div>
            </div>
          </div>
          <button className="btn btn-soft btn-success btn-sm" onClick={onClick}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

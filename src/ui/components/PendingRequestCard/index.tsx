import type { BillRequest } from "../../../core/modules/bill-request/domain/models/BillRequest";
import { TimeUtils } from "../../utils/time.utils";

interface Props {
  request: BillRequest;
  onClick: () => void;
}

export const PendingRequestCard = ({ request, onClick }: Props) => {
  return (
    <div key={request.id} className="card bg-base-100 border-2 border-base-300">
      <div className="card-body p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
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
          <button className="btn btn-primary" onClick={onClick}>
            Entregar cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

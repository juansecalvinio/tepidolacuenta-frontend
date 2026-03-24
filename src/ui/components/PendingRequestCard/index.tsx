import { memo } from "react";
import type {
  BillRequest,
  PaymentMethod,
} from "../../../core/modules/bill-request/domain/models/BillRequest";
import { TimeUtils } from "../../utils/time.utils";

const PAYMENT_METHOD_LABELS: Record<
  PaymentMethod,
  { icon: string; label: string }
> = {
  cash: { icon: "💵", label: "efectivo" },
  debit_card: { icon: "💳", label: "tarjeta de débito" },
  credit_card: { icon: "💳", label: "tarjeta de crédito" },
};

interface Props {
  request: BillRequest;
  onMarkAsAttended: (requestId: string) => void;
}

export const PendingRequestCard = memo(
  ({ request, onMarkAsAttended }: Props) => {
    return (
      <div
        key={request.id}
        className="card bg-base-100 border-2 border-base-300"
      >
        <div className="card-body p-4">
          <div className="flex flex-col sm:flex-row justify-items-normal sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
              <div>
                <div className="font-bold text-2xl">
                  Mesa {request.tableNumber}
                </div>
                <div className="font-bold text-lg text-base-content/90">
                  Paga con {PAYMENT_METHOD_LABELS[request.paymentMethod].label}{" "}
                  {PAYMENT_METHOD_LABELS[request.paymentMethod].icon}
                </div>
                <div className="text-sm text-base-content/60">
                  {TimeUtils.formatTime(request.createdAt)} •{" "}
                  {TimeUtils.getTimeAgo(request.createdAt)}
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => onMarkAsAttended(request.id)}
            >
              Entregar cuenta
            </button>
          </div>
        </div>
      </div>
    );
  },
);

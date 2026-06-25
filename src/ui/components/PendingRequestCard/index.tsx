import { memo, type ReactElement } from "react";
import type {
  BillRequest,
  PaymentMethod,
} from "../../../core/modules/bill-request/domain/models/BillRequest";
import { TimeUtils } from "../../utils/time.utils";
import { CashIcon, CardIcon } from "../icons";

const PAYMENT_METHOD_LABELS: Record<
  PaymentMethod,
  { Icon: (props: { className?: string }) => ReactElement; label: string }
> = {
  cash: { Icon: CashIcon, label: "efectivo" },
  debit_card: { Icon: CardIcon, label: "tarjeta de débito" },
  credit_card: { Icon: CardIcon, label: "tarjeta de crédito" },
};

interface Props {
  request: BillRequest;
  onMarkAsAttended: (requestId: string) => void;
}

export const PendingRequestCard = memo(
  ({ request, onMarkAsAttended }: Props) => {
    const { Icon, label } = PAYMENT_METHOD_LABELS[request.paymentMethod];
    return (
      <div
        key={request.id}
        className="card bg-base-100 border border-base-300"
      >
        <div className="card-body p-4">
          <div className="flex flex-col sm:flex-row justify-items-normal sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-2 h-2 bg-brand rounded-full animate-pulse"></div>
              <div>
                <div className="font-bold text-2xl">
                  Mesa {request.tableNumber}
                </div>
                <div className="font-bold text-lg text-fg flex items-center gap-1.5">
                  <span>Paga con {label}</span>
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
                <div className="text-sm text-fg-soft">
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

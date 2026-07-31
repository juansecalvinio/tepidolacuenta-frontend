import { useTranslation } from "react-i18next";
import type { BillingCycle } from "../../../core/modules/payment/domain/models/Payment";

interface Props {
  value: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}

// Selector segmentado Mensual / Anual. El anual muestra el gancho "2 meses gratis".
export const BillingCycleToggle = ({ value, onChange }: Props) => {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t("billing.monthly") + " / " + t("billing.annual")}
      className="inline-flex items-center rounded-full border border-base-300 bg-base-100 p-1"
    >
      <button
        type="button"
        onClick={() => onChange("monthly")}
        aria-pressed={value === "monthly"}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          value === "monthly"
            ? "bg-primary text-primary-content"
            : "text-fg-soft"
        }`}
      >
        {t("billing.monthly")}
      </button>
      <button
        type="button"
        onClick={() => onChange("annual")}
        aria-pressed={value === "annual"}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors flex items-center gap-2 ${
          value === "annual" ? "bg-primary text-primary-content" : "text-fg-soft"
        }`}
      >
        {t("billing.annual")}
        <span
          className={`text-xs rounded-full px-1.5 py-0.5 ${
            value === "annual"
              ? "bg-primary-content/20"
              : "bg-success/15 text-success"
          }`}
        >
          {t("billing.freeMonths")}
        </span>
      </button>
    </div>
  );
};

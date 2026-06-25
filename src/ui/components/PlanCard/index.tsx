import type { Plan } from "../../../core/modules/subscription/domain/models/Subscription";
import { PriceUtils } from "../../utils/price.utils";
import { getPlanFeatures } from "../../utils/plan.utils";
import { CheckIcon } from "../icons";

interface Props {
  plan: Plan;
  isRecommended?: boolean;
  isCurrent?: boolean;
  ctaLabel: string;
  onSelect: (plan: Plan) => void;
  loading?: boolean;
}

export const PlanCard = ({
  plan,
  isRecommended = false,
  isCurrent = false,
  ctaLabel,
  onSelect,
  loading = false,
}: Props) => (
  <div
    className={`card card-border w-full h-full relative transition-shadow ${
      isRecommended
        ? "border-primary border-2 bg-base-100 md:shadow-lg"
        : "border-base-300 bg-base-100"
    }`}
  >
    {isRecommended && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="badge badge-primary badge-sm font-semibold px-3">
          Recomendado
        </span>
      </div>
    )}

    <div className="card-body p-6">
      <h3 className="font-display text-xl font-semibold">{plan.name}</h3>

      <div className="my-2">
        <span className="font-host text-3xl font-black whitespace-nowrap tabular-nums">
          $ {PriceUtils.getFormattedPrice(plan.price)}
        </span>
        <span className="text-sm text-fg-soft">/mes</span>
      </div>

      {plan.trialDays > 0 && (
        <p className="text-xs text-fg-soft -mt-1">
          {plan.trialDays} días gratis al comenzar
        </p>
      )}

      <ul className="space-y-2 mt-4 mb-6">
        {getPlanFeatures(plan).map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <CheckIcon className="w-4 h-4 text-success shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* mt-auto empuja el CTA al pie: con las cards a igual altura, los botones
          quedan alineados sin importar cuánto contenido tenga cada plan. */}
      <div className="card-actions mt-auto">
        {isCurrent ? (
          <button className="btn btn-outline w-full" disabled>
            Plan actual
          </button>
        ) : (
          <button
            className={`btn w-full ${isRecommended ? "btn-primary" : "btn-secondary"}`}
            onClick={() => onSelect(plan)}
            disabled={loading}
          >
            {loading ? (
              <span
                className="loading loading-spinner loading-sm"
                aria-label="Cargando…"
              />
            ) : (
              ctaLabel
            )}
          </button>
        )}
      </div>
    </div>
  </div>
);

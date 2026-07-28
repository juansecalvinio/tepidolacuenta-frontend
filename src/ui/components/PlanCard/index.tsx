import { useState } from "react";
import type { Plan } from "../../../core/modules/subscription/domain/models/Subscription";
import type { BillingCycle } from "../../../core/modules/payment/domain/models/Payment";
import { PriceUtils } from "../../utils/price.utils";
import {
  getPlanFeatures,
  priceForBranches,
  supportsBranchAddon,
} from "../../utils/plan.utils";
import { CheckIcon } from "../icons";

interface Props {
  plan: Plan;
  cycle?: BillingCycle;
  isRecommended?: boolean;
  isCurrent?: boolean;
  ctaLabel: string;
  onSelect: (plan: Plan, branches: number) => void;
  loading?: boolean;
}

export const PlanCard = ({
  plan,
  cycle = "monthly",
  isRecommended = false,
  isCurrent = false,
  ctaLabel,
  onSelect,
  loading = false,
}: Props) => {
  const addon = supportsBranchAddon(plan);
  const [branches, setBranches] = useState(plan.includedBranches);
  const price = priceForBranches(plan, branches, cycle);

  return (
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
            $ {PriceUtils.getFormattedPrice(price)}
          </span>
          <span className="text-sm text-fg-soft">
            {cycle === "annual" ? "/año" : "/mes"}
          </span>
        </div>

        {cycle === "annual" ? (
          <p className="text-xs text-success -mt-1">Equivale a 2 meses gratis</p>
        ) : (
          plan.trialDays > 0 && (
            <p className="text-xs text-fg-soft -mt-1">
              {plan.trialDays} días gratis al comenzar
            </p>
          )
        )}

        {addon && (
          <div className="mt-4 flex items-center justify-between gap-2 rounded-lg border border-base-300 px-3 py-2">
            <span className="text-sm">Sucursales</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="btn btn-xs btn-circle btn-ghost"
                aria-label="Quitar sucursal"
                disabled={branches <= plan.includedBranches}
                onClick={() =>
                  setBranches((b) => Math.max(plan.includedBranches, b - 1))
                }
              >
                −
              </button>
              <span className="text-sm font-semibold tabular-nums w-6 text-center">
                {branches}
              </span>
              <button
                type="button"
                className="btn btn-xs btn-circle btn-ghost"
                aria-label="Agregar sucursal"
                onClick={() => setBranches((b) => b + 1)}
              >
                +
              </button>
            </div>
          </div>
        )}

        <ul className="space-y-2 mt-4 mb-6">
          {getPlanFeatures(plan).map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-success shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="card-actions mt-auto">
          {isCurrent ? (
            <button className="btn btn-outline w-full" disabled>
              Plan actual
            </button>
          ) : (
            <button
              className={`btn w-full ${
                isRecommended ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => onSelect(plan, branches)}
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
};

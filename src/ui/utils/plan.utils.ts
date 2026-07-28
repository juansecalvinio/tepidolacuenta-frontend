import type {
  Plan,
  ReportsTier,
} from "../../core/modules/subscription/domain/models/Subscription";
import type { BillingCycle } from "../../core/modules/payment/domain/models/Payment";

// Email de contacto para el plan Enterprise (cotización a medida). Ajustable.
export const ENTERPRISE_CONTACT_EMAIL = "hola@tepidolacuenta.site";

export const getEnterpriseMailto = (): string =>
  `mailto:${ENTERPRISE_CONTACT_EMAIL}?subject=${encodeURIComponent(
    "Consulta plan a medida — muchas sucursales — TePidoLaCuenta",
  )}`;

// Monto ARS a mostrar/cobrar según el ciclo.
export const priceForCycle = (plan: Plan, cycle: BillingCycle): number =>
  cycle === "annual" ? plan.priceAnnual : plan.price;

// El ciclo anual cobra 10 meses (2 gratis).
export const ANNUAL_MULTIPLIER = 10;

// Un plan admite sumar sucursales extra si tiene precio por sucursal (> 0).
export const supportsBranchAddon = (plan: Plan): boolean =>
  plan.extraBranchPriceUsd > 0;

// Monto ARS para el ciclo y la cantidad de sucursales elegida. Suma cada
// sucursal por encima de las incluidas; en anual, base y extras aplican el 10×.
export const priceForBranches = (
  plan: Plan,
  branches: number,
  cycle: BillingCycle,
): number => {
  const extras = Math.max(0, branches - plan.includedBranches);
  const base = cycle === "annual" ? plan.priceAnnual : plan.price;
  const extraUnit =
    cycle === "annual"
      ? plan.extraBranchPrice * ANNUAL_MULTIPLIER
      : plan.extraBranchPrice;
  return base + extras * extraUnit;
};

// Etiqueta de reportes por tier (null = no mostrar la línea).
export const getReportsLabel = (tier: ReportsTier): string | null => {
  switch (tier) {
    case "included":
      return "Reportes y estadísticas";
    case "advanced":
      return "Reportes avanzados";
    case "consolidated":
      return "Reportes avanzados + consolidado";
    default:
      return null;
  }
};

export const getPlanFeatures = (plan: Plan): string[] => {
  const branches = supportsBranchAddon(plan)
    ? `Incluye ${plan.includedBranches} sucursales · sumás más a US$${plan.extraBranchPriceUsd} c/u`
    : plan.maxBranches === -1
      ? "Sucursales ilimitadas"
      : `Hasta ${plan.maxBranches} sucursal${plan.maxBranches > 1 ? "es" : ""}`;

  // El límite de mesas es POR sucursal: lo aclaramos salvo que el plan tenga una
  // sola sucursal (donde "en cada sucursal" sería redundante).
  const perBranch = plan.maxBranches === 1 ? "" : " en cada sucursal";
  const tables =
    plan.maxTables === -1
      ? `Mesas ilimitadas${perBranch}`
      : `Hasta ${plan.maxTables} mesas${perBranch}`;

  const features = [
    branches,
    tables,
    "Equipo ilimitado",
    "Pedidos de cuenta por QR",
  ];

  const reports = getReportsLabel(plan.reportsTier);
  if (reports) features.push(reports);

  return features;
};

// Resumen compacto de los límites del plan, para mostrar inline junto al nombre
// (ej. "3 sucursales · 50 mesas c/u"). El "c/u" solo aplica con varias sucursales
// y un tope finito de mesas.
export const getPlanSummary = (plan: Plan): string => {
  const branches = supportsBranchAddon(plan)
    ? `${plan.includedBranches}+ sucursales`
    : plan.maxBranches === -1
      ? "Sucursales ilimitadas"
      : `${plan.maxBranches} sucursal${plan.maxBranches > 1 ? "es" : ""}`;

  const tables =
    plan.maxTables === -1 ? "mesas ilimitadas" : `${plan.maxTables} mesas`;
  const perBranch =
    plan.maxBranches !== 1 && plan.maxTables !== -1 ? " c/u" : "";

  return `${branches} · ${tables}${perBranch}`;
};

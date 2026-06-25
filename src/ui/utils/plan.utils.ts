import type { Plan } from "../../core/modules/subscription/domain/models/Subscription";

export const getPlanFeatures = (plan: Plan): string[] => {
  const branches =
    plan.maxBranches === -1
      ? "Sucursales ilimitadas"
      : `Hasta ${plan.maxBranches} sucursal${plan.maxBranches > 1 ? "es" : ""}`;

  // El límite de mesas es POR sucursal: lo aclaramos salvo que el plan tenga una
  // sola sucursal (donde "en cada sucursal" sería redundante).
  const perBranch = plan.maxBranches === 1 ? "" : " en cada sucursal";
  const tables =
    plan.maxTables === -1
      ? `Mesas ilimitadas${perBranch}`
      : `Hasta ${plan.maxTables} mesas${perBranch}`;

  return [
    branches,
    tables,
    "Pedidos de cuenta por QR",
    "Panel de administración",
  ];
};

// Resumen compacto de los límites del plan, para mostrar inline junto al nombre
// (ej. "3 sucursales · 50 mesas c/u"). El "c/u" solo aplica con varias sucursales
// y un tope finito de mesas.
export const getPlanSummary = (plan: Plan): string => {
  const branches =
    plan.maxBranches === -1
      ? "Sucursales ilimitadas"
      : `${plan.maxBranches} sucursal${plan.maxBranches > 1 ? "es" : ""}`;

  const tables =
    plan.maxTables === -1 ? "mesas ilimitadas" : `${plan.maxTables} mesas`;
  const perBranch =
    plan.maxBranches !== 1 && plan.maxTables !== -1 ? " c/u" : "";

  return `${branches} · ${tables}${perBranch}`;
};

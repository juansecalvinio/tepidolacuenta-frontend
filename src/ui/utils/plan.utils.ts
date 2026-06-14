import type { Plan } from "../../core/modules/subscription/domain/models/Subscription";

export const getPlanFeatures = (plan: Plan): string[] => {
  const tables =
    plan.maxTables === -1 ? "Mesas ilimitadas" : `Hasta ${plan.maxTables} mesas`;
  const branches =
    plan.maxBranches === -1
      ? "Sucursales ilimitadas"
      : `${plan.maxBranches} sucursal${plan.maxBranches > 1 ? "es" : ""}`;

  return [
    tables,
    branches,
    "Solicitudes de cuenta por QR",
    "Panel de administración",
  ];
};

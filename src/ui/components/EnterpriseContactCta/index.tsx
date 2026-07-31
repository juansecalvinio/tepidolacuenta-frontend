import { useTranslation } from "react-i18next";
import { getEnterpriseMailto } from "../../utils/plan.utils";

// Bloque de contacto para cadenas grandes. Reemplaza al viejo plan Enterprise:
// no es una card ni un tier, es una invitación a escribir.
export const EnterpriseContactCta = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-10 rounded-2xl border border-base-300 bg-base-200/40 px-6 py-8 text-center">
      <p className="font-display text-lg font-semibold mb-1 text-balance">
        {t("enterprise.title")}
      </p>
      <p className="text-fg-soft text-sm mb-4">{t("enterprise.subtitle")}</p>
      <a href={getEnterpriseMailto()} className="btn btn-outline">
        {t("enterprise.button")}
      </a>
    </div>
  );
};

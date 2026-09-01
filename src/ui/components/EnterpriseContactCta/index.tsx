import { useTranslation } from "react-i18next";
import {
  getEnterpriseMailto,
  getWhatsappLink,
  hasWhatsapp,
} from "../../utils/plan.utils";
import { WhatsappIcon } from "../icons";

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
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a href={getEnterpriseMailto()} className="btn btn-outline">
          {t("enterprise.button")}
        </a>
        {/* WhatsApp solo si hay número configurado (ver WHATSAPP_NUMBER). */}
        {hasWhatsapp() && (
          <a
            href={getWhatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success gap-2"
          >
            <WhatsappIcon className="w-5 h-5" />
            {t("enterprise.whatsapp")}
          </a>
        )}
      </div>
    </div>
  );
};

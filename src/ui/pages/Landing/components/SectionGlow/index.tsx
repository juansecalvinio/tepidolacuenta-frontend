// Blob radial verde (primary) difuminado, el mismo recurso del hero, reutilizable
// para darle vida y ritmo a otras secciones sin repetir markup. Decorativo:
// aria-hidden y sin captura de eventos. El contenedor de la sección debe ser
// `relative overflow-hidden` para recortarlo.
type GlowPosition = "center" | "left" | "right" | "top";
type GlowIntensity = "soft" | "strong";

interface Props {
  position?: GlowPosition;
  intensity?: GlowIntensity;
}

const POSITION_CLASSES: Record<GlowPosition, string> = {
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  left: "top-1/2 left-0 -translate-y-1/2 -translate-x-1/3",
  right: "top-1/2 right-0 -translate-y-1/2 translate-x-1/3",
  top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/3",
};

const INTENSITY_CLASSES: Record<GlowIntensity, string> = {
  soft: "bg-primary/10",
  strong: "bg-primary/15",
};

export const SectionGlow = ({
  position = "center",
  intensity = "soft",
}: Props) => (
  <div
    aria-hidden="true"
    className="absolute inset-0 pointer-events-none overflow-hidden"
  >
    <div
      className={`absolute w-175 h-87.5 rounded-full blur-3xl ${POSITION_CLASSES[position]} ${INTENSITY_CLASSES[intensity]}`}
    />
  </div>
);

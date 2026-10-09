import { AbsoluteFill, Series } from "remotion";
import { Caption } from "./Caption";
import { EndCard } from "./EndCard";
import { Shot, ShotProps } from "./Shot";

type Plano = ShotProps & {
  readonly frames: number;
  readonly text?: string;
  readonly textPosition?: "top" | "bottom";
};

// Material: public/mate.mp4, un giro de 360° del mate filmado a 60 fps.
// Bandera en la virola: 0-1 s y 12,5-14 s. Costura: 1,5-6 s.
// Número 8: 2,5-5 s. Escudo: 7-9,5 s.

const cuerpo: Plano[] = [
  {
    frames: 75,
    from: 2.0,
    rate: 0.5,
    zoom: [1.25, 1.3],
    focus: [50, 50],
    text: "Costuras a la vista.",
  },
  {
    frames: 75,
    from: 10.0,
    rate: 0.5,
    zoom: [1.4, 1.45],
    focus: [50, 88],
    text: "Terminación en cada detalle.",
    textPosition: "top",
  },
  {
    frames: 90,
    from: 6.4,
    rate: 1,
    zoom: [1.12, 1.16],
    focus: [50, 35],
    text: "Para el mate de todos los días. O para regalar.",
  },
];

const cierre: ShotProps & { frames: number } = {
  frames: 150,
  from: 0,
  rate: 1,
  zoom: [1, 1.05],
  focus: [50, 45],
};

const hooks: Record<"A" | "B", Plano> = {
  // A: arranca en el detalle de la virola, en cámara lenta.
  A: {
    frames: 60,
    from: 12.7,
    rate: 0.5,
    zoom: [1.45, 1.5],
    focus: [50, 20],
    text: "No es un mate más.",
  },
  // B: arranca con el producto completo girando.
  B: {
    frames: 60,
    from: 11.4,
    rate: 1,
    zoom: [1, 1.03],
    focus: [50, 45],
    text: "Mirá cómo está hecho.",
  },
};

export type AdProps = {
  readonly hook: "A" | "B";
  readonly brand: string;
  readonly cta: string;
};

export const AD_FRAMES = [hooks.A, ...cuerpo, cierre].reduce(
  (total, p) => total + p.frames,
  0,
);

export const Ad: React.FC<AdProps> = ({ hook, brand, cta }) => {
  const planos = [hooks[hook], ...cuerpo];

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Series>
        {planos.map((p, i) => (
          <Series.Sequence key={i} durationInFrames={p.frames}>
            <Shot {...p} />
            {p.text ? (
              <Caption text={p.text} position={p.textPosition} />
            ) : null}
          </Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={cierre.frames}>
          <Shot {...cierre} />
          <EndCard brand={brand} cta={cta} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

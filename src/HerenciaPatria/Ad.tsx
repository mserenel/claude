import { AbsoluteFill, Series } from "remotion";
import { Caption } from "./Caption";
import { EndCard } from "./EndCard";
import { Shot, ShotProps } from "./Shot";

type Plano = ShotProps & {
  readonly frames: number;
  readonly text?: string;
  readonly textPosition?: "top" | "bottom";
};

// Material: public/mate-hq.mp4 (escalado desde public/mate.mp4), un giro de
// 360° del mate filmado a 60 fps. Apliques de la virola, cuando pasan por el
// centro: número 8 ≈ 4,1 s, escudo ≈ 8,1 s, bandera ≈ 12,9 s.
// Costura: 1,5-6 s. Base y patas: todo el giro.

const numero: Plano = {
  frames: 60,
  from: 3.6,
  rate: 0.5,
  zoom: [1.3, 1.34],
  focus: [50, 20],
  text: "Tu número.",
};

const escudo: Plano = {
  frames: 60,
  from: 7.6,
  rate: 0.5,
  zoom: [1.3, 1.34],
  focus: [50, 20],
  text: "Tu escudo.",
};

const bandera: Plano = {
  frames: 60,
  from: 12.4,
  rate: 0.5,
  zoom: [1.3, 1.34],
  focus: [50, 20],
  text: "Tus colores.",
};

const costura: Plano = {
  frames: 75,
  from: 1.6,
  rate: 0.5,
  zoom: [1.15, 1.2],
  focus: [50, 50],
  text: "Terminación en cada detalle.",
};

const base: Plano = {
  frames: 75,
  from: 10.0,
  rate: 0.5,
  zoom: [1.25, 1.3],
  focus: [50, 88],
  text: "Hecho a tu gusto.",
  textPosition: "top",
};

const cierre: ShotProps & { frames: number } = {
  frames: 120,
  from: 0,
  rate: 1,
  zoom: [1, 1.05],
  focus: [50, 45],
};

const versiones: Record<"A" | "B", Plano[]> = {
  // A: arranca con una pregunta sobre el detalle personalizado.
  A: [
    { ...numero, text: "¿Cuál es tu número?" },
    escudo,
    bandera,
    costura,
    base,
  ],
  // B: arranca con el producto completo y la promesa.
  B: [
    {
      frames: 60,
      from: 9.4,
      rate: 1,
      zoom: [1, 1.03],
      focus: [50, 45],
      text: "Un mate hecho a tu gusto.",
    },
    numero,
    escudo,
    bandera,
    { ...costura, frames: 90 },
  ],
};

export type AdProps = {
  readonly hook: "A" | "B";
  readonly brand: string;
  readonly cta: string;
};

export const AD_FRAMES = [...versiones.A, cierre].reduce(
  (total, p) => total + p.frames,
  0,
);

export const Ad: React.FC<AdProps> = ({ hook, brand, cta }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Series>
        {versiones[hook].map((p, i) => (
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

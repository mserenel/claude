import { AbsoluteFill, Series } from "remotion";
import { Caption } from "./Caption";
import { Clip } from "./Clip";
import { EndCard } from "./EndCard";
import { Photo } from "./Photo";

// Material:
// - public/escena.jpg: foto real del mate en la mesa, con luz de ventana.
// - public/giro-escena.mp4: el giro real del mate (public/giro.mp4) recortado
//   cuadro a cuadro y apoyado sobre su base en la misma escena
//   (tools/compose_escena.py). Mismos tiempos que el video original.
//   Se evitan los tramos donde el recorte incluyó la base real:
//   3,7-4,7 s, 6,2-7,8 s, 10-11,3 s, 17,2-18,2 s y 20-21,1 s.
// - public/logo-herencia-patria.png: logo original.

type Plano = {
  readonly from: number; // segundo del giro
  readonly frames: number;
  readonly zoom: [number, number];
  readonly focus: [number, number];
  readonly text: string;
};

const planos: Plano[] = [
  // El 8 pasa por el frente a los 5 s.
  {
    from: 4.75,
    frames: 42,
    zoom: [1.32, 1.36],
    focus: [50, 30],
    text: "Tu número.",
  },
  // El escudo llega al frente a los 23 s (segunda vuelta).
  {
    from: 21.4,
    frames: 63,
    zoom: [1, 1.04],
    focus: [50, 55],
    text: "Tu escudo.",
  },
  // La bandera pasa por el frente a los 14,7 s.
  {
    from: 13.2,
    frames: 75,
    zoom: [1.3, 1.34],
    focus: [50, 30],
    text: "Tus colores.",
  },
  {
    from: 18.2,
    frames: 54,
    zoom: [1.18, 1.22],
    focus: [50, 75],
    text: "Terminación en cada detalle.",
  },
];

const HOOK = 75;
const CIERRE = 90;
export const AD_FRAMES =
  HOOK + planos.reduce((total, p) => total + p.frames, 0) + CIERRE;

export type AdProps = {
  readonly hook: "A" | "B";
  readonly cta: string;
};

const hooks: Record<AdProps["hook"], string> = {
  A: "Un mate hecho a tu gusto.",
  B: "¿Cómo sería el tuyo?",
};

export const Ad: React.FC<AdProps> = ({ hook, cta }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Series>
        <Series.Sequence durationInFrames={HOOK}>
          {/* Arranca cerca del escudo con el sol encima y se abre. */}
          <Photo src="escena.jpg" zoom={[1.45, 1.12]} focus={[52, 38]} />
          <Caption text={hooks[hook]} />
        </Series.Sequence>
        {planos.map((p) => (
          <Series.Sequence key={p.text} durationInFrames={p.frames}>
            <Clip
              src="giro-escena.mp4"
              from={p.from}
              zoom={p.zoom}
              focus={p.focus}
            />
            <Caption text={p.text} />
          </Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={CIERRE}>
          <Photo src="escena.jpg" zoom={[1.05, 1]} focus={[50, 50]} />
          <EndCard cta={cta} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

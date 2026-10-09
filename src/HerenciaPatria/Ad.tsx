import { AbsoluteFill, Series } from "remotion";
import { Caption } from "./Caption";
import { EndCard } from "./EndCard";
import { Photo } from "./Photo";

// Material (todo real, sin recortes ni composición):
// - public/escena.jpg: foto del mate en la mesa, con luz de ventana.
// - public/lado-*.jpg: capturas del video del giro (public/giro.mp4), una por
//   cada lado del mate, elegidas por nitidez y escaladas con Lanczos:
//   número (cuadro 341), escudo (1381), bandera (901) y pata (721).
// - public/logo-herencia-patria.png: logo original.

type Plano = {
  readonly src: string;
  readonly frames: number;
  readonly zoom: [number, number];
  readonly focus: [number, number];
  readonly text: string;
};

const lados: Plano[] = [
  {
    src: "lado-numero.jpg",
    frames: 60,
    zoom: [1.06, 1.12],
    focus: [50, 35],
    text: "Tu número.",
  },
  {
    src: "lado-escudo.jpg",
    frames: 60,
    zoom: [1.12, 1.06],
    focus: [50, 35],
    text: "Tu escudo.",
  },
  {
    src: "lado-bandera.jpg",
    frames: 60,
    zoom: [1.06, 1.12],
    focus: [50, 35],
    text: "Tus colores.",
  },
  {
    src: "lado-pata.jpg",
    frames: 66,
    zoom: [1.12, 1.06],
    focus: [50, 70],
    text: "Terminación en cada detalle.",
  },
];

const HOOK = 75;
const CIERRE = 90;
export const AD_FRAMES =
  HOOK + lados.reduce((total, p) => total + p.frames, 0) + CIERRE;

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
        {lados.map((p) => (
          <Series.Sequence key={p.src} durationInFrames={p.frames}>
            <Photo src={p.src} zoom={p.zoom} focus={p.focus} />
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

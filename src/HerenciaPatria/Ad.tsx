import { AbsoluteFill, Series } from "remotion";
import { Caption } from "./Caption";
import { EndCard } from "./EndCard";
import { Photo } from "./Photo";

// Material:
// - public/escena.jpg: foto del mate en la mesa, con luz de ventana.
// - public/lado-*.jpg: una captura real de cada lado del mate (cuadros 341,
//   1381, 901 y 721 de public/giro.mp4), recortada con BiRefNet, revisada a
//   mano y apoyada en la mesa de la escena (tools/compose_foto.py; máscaras
//   en tools/mascaras/).
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

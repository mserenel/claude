import { AbsoluteFill, Series } from "remotion";
import { Caption } from "./Caption";
import { EndCard } from "./EndCard";
import { Photo } from "./Photo";

// Todo el anuncio sale de una sola foto real: public/escena.jpg (el mate en la
// mesa, con luz de ventana). Cada plano es un encuadre distinto de esa foto
// con un movimiento lento de cámara; nada se recorta ni se compone, así que
// el mate, su posición, su luz y su apoyo en la mesa son siempre los reales.
// Logo original: public/logo-herencia-patria.png.

type Plano = {
  readonly frames: number;
  readonly zoom: [number, number];
  readonly focus: [number, number] | [[number, number], [number, number]];
  readonly text?: string;
  readonly textPosition?: "top" | "bottom";
};

// Puntos de la foto, en % del cuadro 9:16: escudo (50, 37), cuero (50, 58),
// base plateada (50, 78).
const cuerpo: Plano[] = [
  {
    // Paneo lento por la virola cincelada, de izquierda al escudo.
    frames: 66,
    zoom: [1.75, 1.75],
    focus: [
      [30, 37],
      [55, 37],
    ],
    text: "Tu escudo.",
  },
  {
    // Textura del cuero, con la luz rasante del sol.
    frames: 54,
    zoom: [1.7, 1.6],
    focus: [55, 60],
    text: "Elegí cada detalle.",
  },
  {
    // La base plateada apoyada en la madera.
    frames: 60,
    zoom: [1.6, 1.7],
    focus: [50, 80],
    text: "Terminación en cada detalle.",
  },
  {
    // Se abre al mate completo en la mesa.
    frames: 75,
    zoom: [1.35, 1.05],
    focus: [50, 55],
    text: "Un mate hecho a tu gusto.",
    textPosition: "top",
  },
];

const hooks: Record<"A" | "B", Plano> = {
  // A: arranca en el escudo con el destello del sol.
  A: {
    frames: 60,
    zoom: [1.9, 1.75],
    focus: [50, 37],
    text: "No es un mate más.",
  },
  // B: arranca con el mate completo y se acerca.
  B: {
    frames: 60,
    zoom: [1.05, 1.25],
    focus: [50, 50],
    text: "¿Cómo sería el tuyo?",
  },
};

const CIERRE = 90;
export const AD_FRAMES =
  hooks.A.frames + cuerpo.reduce((total, p) => total + p.frames, 0) + CIERRE;

export type AdProps = {
  readonly hook: "A" | "B";
  readonly cta: string;
};

export const Ad: React.FC<AdProps> = ({ hook, cta }) => {
  const planos = [hooks[hook], ...cuerpo];
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Series>
        {planos.map((p, i) => (
          <Series.Sequence key={i} durationInFrames={p.frames}>
            <Photo src="escena.jpg" zoom={p.zoom} focus={p.focus} />
            {p.text ? (
              <Caption text={p.text} position={p.textPosition} />
            ) : null}
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

import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Caption } from "./Caption";
import { EndCard } from "./EndCard";

// public/mate-crudo.mp4: IMG_3449.MOV (iPhone, 4K HDR) convertido a SDR,
// con corrección de luz (curva en S, calidez moderada, saturación leve) y
// escalado a 1620x2880, con margen para acercar la cámara sin perder
// nitidez. Dura 14,1 s; el último cuadro se sostiene 1 s debajo del cierre
// para llegar a 15 s sin estirar el movimiento. Sonido ambiente real.

export const CRUDO_FRAMES = 450;

// Cámara: acercamientos y alejamientos suaves. El punto de escala sigue al
// mate (medido cada 0,5 s), así queda fijo en pantalla mientras crece.
const zoomKeys: [number, number][] = [
  [0, 1],
  [75, 1.15],
  [95, 1.15],
  [135, 1.33],
  [200, 1.38],
  [240, 1.1],
  [285, 1.05],
  [360, 1.3],
  [450, 1.15],
];
const mate: [number, number, number][] = [
  [0, 44, 49],
  [30, 47, 49],
  [60, 47, 51],
  [90, 38, 53],
  [120, 41, 58],
  [150, 41, 57],
  [180, 47, 58],
  [210, 41, 55],
  [240, 47, 53],
  [270, 53, 55],
  [300, 47, 54],
  [330, 47, 54],
  [360, 47, 53],
  [390, 44, 53],
  [450, 44, 53],
];

const textos: { from: number; frames: number; text: string }[] = [
  { from: 6, frames: 69, text: "Hay piezas que llevan nuestra esencia." },
  { from: 75, frames: 60, text: "La nobleza de los materiales." },
  { from: 135, frames: 75, text: "El oficio detrás de cada terminación." },
  { from: 210, frames: 75, text: "Ningún detalle está librado al azar." },
  { from: 285, frames: 75, text: "Una pieza con identidad propia." },
];

const ease = { easing: Easing.inOut(Easing.sin) };

export const Crudo: React.FC<{ readonly cta: string }> = ({ cta }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(
    frame,
    zoomKeys.map((k) => k[0]),
    zoomKeys.map((k) => k[1]),
    ease,
  );
  const fx = interpolate(
    frame,
    mate.map((k) => k[0]),
    mate.map((k) => k[1]),
  );
  const fy = interpolate(
    frame,
    mate.map((k) => k[0]),
    mate.map((k) => k[2]),
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("mate-crudo.mp4")}
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale})`,
          transformOrigin: `${fx}% ${fy}%`,
        }}
      />
      {textos.map((t) => (
        <Sequence key={t.text} from={t.from} durationInFrames={t.frames}>
          {/* Arriba, sobre los árboles: abajo están el mate y las manos. */}
          <Caption text={t.text} position="top" />
        </Sequence>
      ))}
      <Sequence from={360}>
        <EndCard cta={cta} />
      </Sequence>
    </AbsoluteFill>
  );
};

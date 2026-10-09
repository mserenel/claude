import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { Caption } from "./Caption";
import { EndCard } from "./EndCard";

// public/mate-crudo.mp4: IMG_3449.MOV (iPhone, 4K HDR) convertido a SDR,
// con corrección de luz (curva en S, calidez moderada, saturación leve) y
// escalado a 1080x1920. Dura 14,1 s; el último cuadro se sostiene 1 s debajo
// del cierre para llegar a 15 s sin estirar el movimiento. Sonido ambiente
// real del lugar.

export const CRUDO_FRAMES = 450;

const textos: { from: number; frames: number; text: string }[] = [
  { from: 8, frames: 82, text: "No es un mate más." },
  { from: 95, frames: 85, text: "Mirá de cerca." },
  { from: 185, frames: 85, text: "Terminación en cada detalle." },
  { from: 275, frames: 85, text: "Un mate hecho a tu gusto." },
];

export const Crudo: React.FC<{ readonly cta: string }> = ({ cta }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <OffthreadVideo src={staticFile("mate-crudo.mp4")} />
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

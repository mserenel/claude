import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { BigTitle } from "./BigTitle";
import { Caption } from "./Caption";
import { EndCard } from "./EndCard";

// Reel pensado para interacción: el mate en el balcón con la ciudad de fondo.
// public/balcon.mp4: IMG_6966 (1080x1920, sin sonido) a 30 fps con la misma
// corrección de luz que el resto de la serie. El video no trae audio: se
// publica con un audio de la biblioteca de Instagram.

export const BALCON_FRAMES = 450;
const HOOK = 75;
const CIERRE = 120;

// La toma ya se mueve sola (un paneo lento alrededor del mate): la cámara
// solo agrega un acercamiento suave, centrado en el mate.
const Camera: React.FC = () => {
  const f = useCurrentFrame();
  const scale = interpolate(
    f,
    [0, HOOK, BALCON_FRAMES - CIERRE, BALCON_FRAMES],
    [1.18, 1.04, 1.12, 1.06],
    { easing: Easing.inOut(Easing.sin) },
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("balcon.mp4")}
        muted
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale})`,
          transformOrigin: "50% 66%",
        }}
      />
    </AbsoluteFill>
  );
};

// El gancho es una pregunta: invita a comentar, y los comentarios le dan
// alcance al Reel.
const hook = ["¿Con qué vista", "tomás tus", "mates hoy?"];

const captionTexts = [
  "Guarda griega en la virola.",
  "Detalles en metal hasta en las patas.",
  "Un mate para cada momento del día.",
];

const benefits = [
  "Envío gratis",
  "3 cuotas sin interés",
  "20% de descuento en transferencia",
];

export const Balcon: React.FC<{ readonly cta: string }> = ({ cta }) => {
  const each = (BALCON_FRAMES - CIERRE - HOOK) / captionTexts.length;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Camera />
      <Sequence durationInFrames={HOOK}>
        <BigTitle lines={hook} />
      </Sequence>
      {captionTexts.map((text, i) => {
        const from = Math.round(HOOK + i * each);
        const to = Math.round(HOOK + (i + 1) * each);
        return (
          <Sequence key={text} from={from} durationInFrames={to - from}>
            <Caption
              text={text}
              position="top"
              last={i === captionTexts.length - 1}
            />
          </Sequence>
        );
      })}
      <Sequence from={BALCON_FRAMES - CIERRE}>
        <EndCard cta={cta} benefits={benefits} />
      </Sequence>
    </AbsoluteFill>
  );
};

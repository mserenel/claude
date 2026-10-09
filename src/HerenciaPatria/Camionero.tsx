import {
  AbsoluteFill,
  Audio,
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

// Mate Camionero Cuero Crudo. public/camionero.mp4: IMG_3451.MOV (iPhone 15,
// 4K Dolby Vision, achicado a 1080x1920 en el celular), a 30 fps y con la
// misma corrección de luz que el Torpedo. Dura 10,75 s. Sonido:
// public/camionero-ambiente.m4a, el ambiente real del parque extendido a 15 s.

export const CAMIONERO_FRAMES = 450;
const HOOK = 60;
const CIERRE = 120;
const CUERPO = CAMIONERO_FRAMES - HOOK - CIERRE; // 270 cuadros del video

type Key = [number, number];

// Dónde está el mate (% del cuadro), cada 0,5 s del video.
const mate: [number, number, number][] = [
  [0, 37, 46],
  [15, 40, 46],
  [30, 42, 44],
  [45, 50, 47],
  [60, 45, 50],
  [75, 42, 50],
  [90, 42, 48],
  [105, 47, 47],
  [120, 47, 47],
  [135, 52, 48],
  [150, 52, 52],
  [165, 42, 55],
  [180, 40, 55],
  [195, 45, 58],
  [210, 47, 58],
  [225, 42, 60],
  [240, 45, 60],
  [255, 45, 58],
  [270, 50, 58],
  [300, 52, 58],
  [323, 52, 58],
];

// Cámara: `from` y las claves de zoom en cuadros del video; el punto de escala
// sigue al mate. El video es 1080x1920, así que el zoom no pasa de 1,3.
const Camera: React.FC<{ readonly from: number; readonly zoom: Key[] }> = ({
  from,
  zoom,
}) => {
  const f = useCurrentFrame() + from;
  const scale = interpolate(
    f,
    zoom.map((k) => k[0]),
    zoom.map((k) => k[1]),
    {
      easing: Easing.inOut(Easing.sin),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const at = (i: 1 | 2) =>
    interpolate(
      f,
      mate.map((k) => k[0]),
      mate.map((k) => k[i]),
    );
  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("camionero.mp4")}
        trimBefore={from}
        muted
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale})`,
          transformOrigin: `${at(1)}% ${at(2)}%`,
        }}
      />
    </AbsoluteFill>
  );
};

const hook = ["Un mate", "que se elige", "para siempre."];

const captionTexts = [
  "Cuero crudo, al natural.",
  "Boca ancha para cebar sin apuro.",
  "Cada trenza, en su lugar.",
  "Un clásico que no pasa de moda.",
];

const benefits = [
  "Envío gratis",
  "3 cuotas sin interés",
  "20% de descuento en transferencia",
];

export const Camionero: React.FC<{ readonly cta: string }> = ({ cta }) => {
  const each = CUERPO / captionTexts.length;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Audio src={staticFile("camionero-ambiente.m4a")} />
      {/* Gancho: el mate inclinado, con la boca y la virola a la vista. */}
      <Sequence durationInFrames={HOOK}>
        <Camera
          from={45}
          zoom={[
            [45, 1.3],
            [105, 1.2],
          ]}
        />
        <BigTitle lines={hook} />
      </Sequence>
      <Sequence from={HOOK} durationInFrames={CUERPO}>
        <Camera
          from={0}
          zoom={[
            [0, 1.04],
            [45, 1.15],
            [100, 1.25],
            [150, 1.1],
            [210, 1.2],
            [270, 1.12],
          ]}
        />
      </Sequence>
      {/* Cierre: corte, mientras entra el oscurecido, a los últimos 4 s del
          video (el mate de frente), en movimiento hasta el final. */}
      <Sequence from={HOOK + CUERPO}>
        <Camera
          from={203}
          zoom={[
            [203, 1.04],
            [323, 1.12],
          ]}
        />
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
      <Sequence from={HOOK + CUERPO}>
        <EndCard cta={cta} benefits={benefits} />
      </Sequence>
    </AbsoluteFill>
  );
};

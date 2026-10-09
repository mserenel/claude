import {
  AbsoluteFill,
  Audio,
  Easing,
  Freeze,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BigTitle } from "./BigTitle";
import { Caption } from "./Caption";
import { EndCard } from "./EndCard";

// public/mate-crudo.mp4: IMG_3449.MOV (iPhone, 4K HDR, Parque Lillo,
// Necochea) convertido a SDR, con corrección de luz (curva en S, calidez
// moderada, saturación leve) y escalado a 1620x2880, con margen para acercar
// la cámara sin perder nitidez. El último cuadro se sostiene 1 s. Sonido
// ambiente real del parque, filtrado y normalizado a -20 LUFS.
//
// Versión de 20 s: el video completo a velocidad real (sin cámara lenta: la
// interpolación de cuadros dejaba contornos dobles en la pata del mate). El
// último cuadro queda quieto debajo del cierre. El sonido es
// public/ambiente-20s.m4a: el ambiente limpio del parque extendido a 20 s con
// un fundido entre dos tramos.

export const CRUDO_FRAMES = 450;
export const CRUDO_FRAMES_20 = 600;
// Último cuadro con movimiento de mate-crudo.mp4 (14,1 s).
const ULTIMO = 423;

type Key = [number, number];

// Dónde está el mate en el video original (% del cuadro), cada 0,5 s.
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

// Cámara en tiempo del video original: el punto de escala sigue al mate.
const Camera: React.FC<{
  readonly muted?: boolean;
  readonly from: number;
  readonly zoom: Key[];
  readonly focusY?: number;
  // Cuadro (del plano) desde el que el sonido baja hasta cero en 20 cuadros.
  readonly fadeOutAt?: number;
}> = ({ muted, from, zoom, focusY, fadeOutAt }) => {
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
        src={staticFile("mate-crudo.mp4")}
        trimBefore={from}
        muted={muted}
        volume={(f) =>
          fadeOutAt === undefined
            ? 1
            : interpolate(f, [fadeOutAt, fadeOutAt + 20], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
        }
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale})`,
          transformOrigin: `${at(1)}% ${focusY ?? at(2)}%`,
        }}
      />
    </AbsoluteFill>
  );
};

const hook = ["Hay piezas", "que llevan", "nuestra esencia."];

// Cierre: logo, frase y beneficios de compra (4 s; 5 s en la de 20 s).
const CIERRE = 120;
const benefits = [
  "Envío gratis",
  "3 cuotas sin interés",
  "20% de descuento en transferencia",
];

const captionTexts = [
  "La nobleza de los materiales.",
  "El oficio detrás de cada terminación.",
  "Ningún detalle está librado al azar.",
  "Una pieza con identidad propia.",
];

// Los cuatro textos se reparten el tiempo entre el gancho y el cierre.
const Texts: React.FC<{ readonly offset: number; readonly cierre: number }> = ({
  offset,
  cierre,
}) => {
  const { durationInFrames } = useVideoConfig();
  const each = (durationInFrames - cierre - offset) / captionTexts.length;
  return (
    <>
      {captionTexts.map((text, i) => {
        const from = Math.round(offset + i * each);
        const to = Math.round(offset + (i + 1) * each);
        return (
          <Sequence key={text} from={from} durationInFrames={to - from}>
            {/* Arriba, sobre los árboles: abajo están el mate y las manos. */}
            <Caption
              text={text}
              position="top"
              last={i === captionTexts.length - 1}
            />
          </Sequence>
        );
      })}
    </>
  );
};

const Cierre: React.FC<{ readonly cta: string; readonly cierre: number }> = ({
  cta,
  cierre,
}) => {
  const { durationInFrames } = useVideoConfig();
  return (
    <Sequence from={durationInFrames - cierre}>
      <EndCard cta={cta} benefits={benefits} />
    </Sequence>
  );
};

// A: abre con 2 s del mejor plano (el mate inclinado, la virola cincelada y
// la boca) bien cerca, y corta al comienzo del video.
const HOOK_A = 60;
const CrudoA: React.FC<{ readonly cta: string }> = ({ cta }) => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Sequence durationInFrames={HOOK_A}>
      <Camera
        from={140}
        zoom={[
          [140, 1.55],
          [200, 1.42],
        ]}
      />
      <BigTitle lines={hook} />
    </Sequence>
    <Sequence from={HOOK_A}>
      <Camera
        from={0}
        fadeOutAt={CRUDO_FRAMES - HOOK_A - 20}
        zoom={[
          [0, 1],
          [75, 1.15],
          [135, 1.3],
          [210, 1.38],
          [255, 1.08],
          [300, 1.25],
          [390, 1.15],
        ]}
      />
    </Sequence>
    <Texts offset={HOOK_A} cierre={CIERRE} />
    <Cierre cta={cta} cierre={CIERRE} />
  </AbsoluteFill>
);

// B: sin corte. Arranca pegado al cincelado de la virola y se abre hasta
// mostrar el mate entero en la mano.
const HOOK_B = 75;
const CrudoB: React.FC<{ readonly cta: string }> = ({ cta }) => {
  const f = useCurrentFrame();
  // Durante la apertura el encuadre baja de la virola al centro del mate.
  const focusY = interpolate(f, [0, HOOK_B], [37, 52], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Camera
        from={0}
        focusY={f < HOOK_B ? focusY : undefined}
        zoom={[
          [0, 1.85],
          [HOOK_B, 1.05],
          [135, 1.3],
          [200, 1.38],
          [240, 1.1],
          [285, 1.05],
          [360, 1.3],
          [450, 1.15],
        ]}
      />
      <Sequence durationInFrames={HOOK_B}>
        <BigTitle lines={hook} delay={8} />
      </Sequence>
      <Texts offset={HOOK_B} cierre={CIERRE} />
      <Cierre cta={cta} cierre={CIERRE} />
    </AbsoluteFill>
  );
};

// A de 20 s: mismo gancho; el resto del video a velocidad real, ahora
// completo (incluye el giro de frente del final), cada texto ~3,3 s y el
// cierre con los beneficios 5 s.
const CIERRE_20 = 150;
const zoom20: Key[] = [
  [0, 1],
  [75, 1.15],
  [135, 1.3],
  [210, 1.38],
  [255, 1.08],
  [300, 1.25],
  [360, 1.12],
  [ULTIMO, 1.22],
];
const CrudoA20: React.FC<{ readonly cta: string }> = ({ cta }) => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Audio src={staticFile("ambiente-20s.m4a")} />
    <Sequence durationInFrames={HOOK_A}>
      <Camera
        muted
        from={140}
        zoom={[
          [140, 1.55],
          [200, 1.42],
        ]}
      />
      <BigTitle lines={hook} />
    </Sequence>
    <Sequence from={HOOK_A} durationInFrames={ULTIMO}>
      <Camera muted from={0} zoom={zoom20} />
    </Sequence>
    {/* Debajo del cierre: el último cuadro quieto. */}
    <Sequence from={HOOK_A + ULTIMO}>
      <Freeze frame={ULTIMO - 1}>
        <Camera muted from={0} zoom={zoom20} />
      </Freeze>
    </Sequence>
    <Texts offset={HOOK_A} cierre={CIERRE_20} />
    <Cierre cta={cta} cierre={CIERRE_20} />
  </AbsoluteFill>
);

export const Crudo: React.FC<{
  readonly hook: "A" | "B" | "A20";
  readonly cta: string;
}> = ({ hook: version, cta }) =>
  version === "A" ? (
    <CrudoA cta={cta} />
  ) : version === "B" ? (
    <CrudoB cta={cta} />
  ) : (
    <CrudoA20 cta={cta} />
  );

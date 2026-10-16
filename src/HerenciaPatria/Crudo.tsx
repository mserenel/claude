import {
  AbsoluteFill,
  Audio,
  Easing,
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
import { CierreTipo, Frase, type Parte } from "./Tipografia";

// public/mate-crudo.mp4: IMG_3449.MOV (iPhone, 4K HDR, Parque Lillo,
// Necochea) convertido a SDR, con corrección de luz (curva en S, calidez
// moderada, saturación leve) y escalado a 1620x2880, con margen para acercar
// la cámara sin perder nitidez. El último cuadro se sostiene 1 s. Sonido
// ambiente real del parque, filtrado y normalizado a -20 LUFS.
//
// Versión de 20 s: el video completo a velocidad real (sin cámara lenta: la
// interpolación de cuadros dejaba contornos dobles en la pata del mate). El
// cierre va sobre un plano abierto del comienzo, en movimiento. El sonido es
// public/ambiente-20s.m4a: el ambiente limpio del parque extendido a 20 s con
// un fundido entre dos tramos.

export const CRUDO_FRAMES = 450;
export const CRUDO_FRAMES_20 = 600;

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
          // En 9:16 no cambia nada; en la versión 4:5 recorta arriba y abajo.
          objectFit: "cover",
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

// Textos de la de 20 s: centrados y con mezcla de letras (Tipografia.tsx).
// La palabra grande es siempre la idea importante de la frase.
const hookTipo: Parte[] = [
  { t: "Hay piezas", k: "italica" },
  { t: "que llevan nuestra", k: "chica" },
  { t: "esencia.", k: "grande" },
];
const textosTipo: Parte[][] = [
  [
    { t: "La", k: "chica" },
    { t: "nobleza", k: "grande" },
    { t: "de los materiales.", k: "italica" },
  ],
  [
    { t: "El", k: "chica" },
    { t: "oficio", k: "grande" },
    { t: "detrás de cada terminación.", k: "italica" },
  ],
  [
    { t: "Ningún", k: "chica" },
    { t: "detalle", k: "grande" },
    { t: "está librado al azar.", k: "italica" },
  ],
  [
    { t: "Una pieza con", k: "chica" },
    { t: "identidad", k: "grande" },
    { t: "propia.", k: "italica" },
  ],
];
const ctaTipo: Parte[] = [
  { t: "Tradición", k: "grande" },
  { t: "que se lleva en las manos.", k: "italica" },
];

// Versión de venta (para pauta): en el gancho se entiende qué es, después de
// qué está hecho y la oferta aparece antes del cierre, para quien no llega al
// final. Materiales confirmados por la marca.
const ventaHook: Parte[] = [
  { t: "Mate Torpedo", k: "italica" },
  { t: "de cuero crudo,", k: "chica" },
  { t: "hecho a mano.", k: "grande" },
];
const ventaTextos: Parte[][] = [
  [
    { t: "Cuerpo de", k: "chica" },
    { t: "calabaza", k: "grande" },
    { t: "forrado en cuero crudo.", k: "italica" },
  ],
  [
    { t: "Costura de", k: "chica" },
    { t: "tiento", k: "grande" },
    { t: "y virola de alpaca.", k: "italica" },
  ],
  [
    { t: "Cada uno es", k: "chica" },
    { t: "único.", k: "grande" },
    { t: "Una pieza con identidad.", k: "italica" },
  ],
  [
    { t: "Envío gratis", k: "grande" },
    { t: "y 3 cuotas sin interés.", k: "italica" },
  ],
];

type Guion = {
  readonly hook: Parte[];
  readonly textos: Parte[][];
  readonly cta: Parte[];
  readonly accion?: string;
  readonly precio?: { readonly lista: string; readonly transferencia: string };
  readonly beneficios?: string[];
};
const guiones: Record<"A20" | "VENTA", Guion> = {
  A20: { hook: hookTipo, textos: textosTipo, cta: ctaTipo },
  VENTA: {
    hook: ventaHook,
    textos: ventaTextos,
    cta: ctaTipo,
    accion: "Comprá el tuyo online.",
    // Precios de la tienda (herenciapatria.com.ar): $128.750 de lista y
    // $103.000 con transferencia (20% menos). El descuento ya va en el precio.
    precio: {
      lista: "$128.750",
      transferencia: "o $103.000 con transferencia",
    },
    beneficios: ["Envío gratis", "3 cuotas sin interés"],
  },
};

const TextosTipo: React.FC<{
  readonly offset: number;
  readonly cierre: number;
  readonly textos: Parte[][];
}> = ({ offset, cierre, textos }) => {
  const { durationInFrames } = useVideoConfig();
  const each = (durationInFrames - cierre - offset) / textos.length;
  return (
    <>
      {textos.map((partes, i) => {
        const from = Math.round(offset + i * each);
        const to = Math.round(offset + (i + 1) * each);
        return (
          <Sequence key={from} from={from} durationInFrames={to - from}>
            <Frase partes={partes} last={i === textos.length - 1} />
          </Sequence>
        );
      })}
    </>
  );
};

// A de 20 s: mismo gancho; el resto del video a velocidad real, ahora
// completo (incluye el giro de frente del final), cada texto ~3,3 s y el
// cierre con los beneficios 5 s, con movimiento real debajo hasta el final.
const CIERRE_20 = 150;
const zoom20: Key[] = [
  [0, 1],
  [75, 1.15],
  [135, 1.3],
  [210, 1.38],
  [255, 1.08],
  [300, 1.25],
  [360, 1.12],
  [390, 1.18],
];
const CrudoA20: React.FC<{ readonly g: Guion }> = ({ g }) => (
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
      <Frase partes={g.hook} max={150} instant />
    </Sequence>
    <Sequence
      from={HOOK_A}
      durationInFrames={CRUDO_FRAMES_20 - HOOK_A - CIERRE_20}
    >
      <Camera muted from={0} zoom={zoom20} />
    </Sequence>
    {/* Plano final debajo del cierre: corte limpio (un fundido mostraba dos
        mates superpuestos) a un plano abierto del comienzo, con el mate de
        frente y en movimiento real hasta el último cuadro. */}
    <Sequence from={CRUDO_FRAMES_20 - CIERRE_20}>
      <Camera
        muted
        from={0}
        zoom={[
          [0, 1.02],
          [CIERRE_20, 1.12],
        ]}
      />
    </Sequence>
    <TextosTipo offset={HOOK_A} cierre={CIERRE_20} textos={g.textos} />
    <Sequence from={CRUDO_FRAMES_20 - CIERRE_20}>
      <CierreTipo
        partes={g.cta}
        benefits={g.beneficios ?? benefits}
        accion={g.accion}
        precio={g.precio}
      />
    </Sequence>
  </AbsoluteFill>
);

export const Crudo: React.FC<{
  readonly hook: "A" | "B" | "A20" | "VENTA";
  readonly cta: string;
}> = ({ hook: version, cta }) =>
  version === "A" ? (
    <CrudoA cta={cta} />
  ) : version === "B" ? (
    <CrudoB cta={cta} />
  ) : (
    <CrudoA20 g={guiones[version]} />
  );

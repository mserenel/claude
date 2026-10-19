import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
} from "remotion";
import { Camera } from "./Crudo";
import {
  ChicaCursivaContext,
  CierreTipo,
  Frase,
  type Parte,
} from "./Tipografia";

// Retargeting del Torpedo (9:16, 12 s): para quien visitó la tienda y no
// compró. Ya conoce el producto, así que va directo al cupón de bienvenida
// (HERENCIA15) y su combinación con el 20% por transferencia. Mismas tomas
// (4K) y letras que el video de venta.

export const RETARGETING_FRAMES = 360;
const T = 90;

const textos: Parte[][] = [
  [
    { t: "¿Te quedaste", k: "chica" },
    { t: "con ganas?", k: "grande" },
  ],
  [
    { t: "15% OFF", k: "grande" },
    { t: "en tu primera compra", k: "chica" },
  ],
  [
    { t: "con el código", k: "chica" },
    { t: "HERENCIA15", k: "grande" },
    { t: "+ 20% off en transferencia", k: "chica" },
  ],
];

const cta: Parte[] = [
  { t: "Tradición", k: "grande" },
  { t: "que se lleva en las manos.", k: "italica" },
];

// [cuadro del video original donde empieza cada toma, zoom inicial y final]
const tomas: [number, number, number][] = [
  [140, 1.55, 1.42],
  [0, 1.05, 1.18],
  [300, 1.25, 1.15],
  [330, 1.02, 1.1],
];

export const Retargeting: React.FC = () => (
  <ChicaCursivaContext.Provider value>
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* Ambiente del parque, con fundido en los últimos 2/3 de segundo. */}
      <Audio
        src={staticFile("ambiente-20s.m4a")}
        volume={(f) =>
          interpolate(
            f,
            [RETARGETING_FRAMES - 20, RETARGETING_FRAMES],
            [1, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          )
        }
      />
      {tomas.map(([from, z0, z1], i) => (
        <Sequence key={from} from={i * T} durationInFrames={T}>
          <Camera
            hq
            muted
            from={from}
            zoom={[
              [from, z0],
              [from + T, z1],
            ]}
          />
        </Sequence>
      ))}
      {textos.map((partes, i) => (
        <Sequence key={i} from={i * T} durationInFrames={T}>
          <Frase
            partes={partes}
            delay={2}
            instant={i === 0}
            last={i === textos.length - 1}
          />
        </Sequence>
      ))}
      <Sequence from={3 * T}>
        <CierreTipo
          partes={cta}
          benefits={[]}
          accion="Comprá el tuyo online."
        />
      </Sequence>
    </AbsoluteFill>
  </ChicaCursivaContext.Provider>
);

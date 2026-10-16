import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Camera } from "./Crudo";
import { PortadaFeed } from "./PortadaFeed";
import { CierreTipo, Frase, type Parte } from "./Tipografia";

// Torpedo para pauta de venta (9:16 y 4:5). Abre con la portada del feed
// medio segundo (misma foto y título, así el anuncio y el perfil se
// reconocen) y sigue con las mismas tomas del Torpedo de 20 s (sin acercarse
// a cada parte), con una característica por texto en el orden que pidió la
// marca. Materiales confirmados por la marca. Sin precios en el video.

export const TORPEDO_VENTA_FRAMES = 600;
const PORTADA = 15;
const GANCHO = 60;
const CIERRE = 150;
// Las cinco características y la oferta se reparten por igual el tiempo entre
// la portada y el cierre.
const TEXTO = (TORPEDO_VENTA_FRAMES - CIERRE - PORTADA) / 6;

// Cámara del Torpedo de 20 s, en cuadros del video original.
const zoom20: [number, number][] = [
  [0, 1],
  [75, 1.15],
  [135, 1.3],
  [210, 1.38],
  [255, 1.08],
  [300, 1.25],
  [360, 1.12],
  [390, 1.18],
];

type Toma = { partes: Parte[] };
const tomas: Toma[] = [
  { partes: [{ t: "Hecho a mano.", k: "grande" }] },
  {
    partes: [
      { t: "Cuerpo de", k: "chica" },
      { t: "calabaza", k: "grande" },
    ],
  },
  {
    partes: [
      { t: "Forrado en", k: "chica" },
      { t: "cuero crudo", k: "grande" },
    ],
  },
  {
    partes: [
      { t: "Costura de", k: "chica" },
      { t: "tiento", k: "grande" },
    ],
  },
  {
    partes: [
      { t: "Virola de", k: "chica" },
      { t: "alpaca", k: "grande" },
    ],
  },
];

const oferta: Parte[] = [
  { t: "Envío gratis", k: "grande" },
  { t: "3 cuotas sin interés", k: "chica" },
  { t: "20% off en transferencia", k: "chica" },
];

const cta: Parte[] = [
  { t: "Tradición", k: "grande" },
  { t: "que se lleva en las manos.", k: "italica" },
];
const beneficios = [
  "Envío gratis",
  "3 cuotas sin interés",
  "20% off en transferencia",
];

// La portada del feed, tal cual, con un acercamiento mínimo. Está diseñada
// en 1080x1920: en la versión 4:5 se muestra su franja central.
const Portada: React.FC = () => {
  const f = useCurrentFrame();
  const { height } = useVideoConfig();
  const z = interpolate(f, [0, PORTADA], [1, 1.03]);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: (height - 1920) / 2,
          width: 1080,
          height: 1920,
          transform: `scale(${z})`,
          transformOrigin: "50% 45%",
        }}
      >
        <PortadaFeed
          src="portada-raiz-feed.png"
          kicker="Mate"
          name="TORPEDO"
          sub="Cuero Crudo"
          family="caslon"
          top={430}
          titleScale={0.92}
        />
      </div>
    </AbsoluteFill>
  );
};

export const TorpedoVenta: React.FC = () => {
  const cierre = TORPEDO_VENTA_FRAMES - CIERRE;
  const textos = [...tomas.map((t) => t.partes), oferta];
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Audio src={staticFile("ambiente-20s.m4a")} />
      {/* Las tomas del Torpedo de 20 s: el plano cercano de la virola y la
          boca, y después el video entero a velocidad real. */}
      <Sequence durationInFrames={GANCHO}>
        <Camera
          muted
          from={140}
          zoom={[
            [140, 1.55],
            [200, 1.42],
          ]}
        />
      </Sequence>
      <Sequence from={GANCHO} durationInFrames={cierre - GANCHO}>
        <Camera muted from={0} zoom={zoom20} />
      </Sequence>
      <Sequence from={cierre}>
        <Camera
          muted
          from={0}
          zoom={[
            [0, 1.02],
            [CIERRE, 1.12],
          ]}
        />
      </Sequence>
      <Sequence durationInFrames={PORTADA}>
        <Portada />
      </Sequence>
      {textos.map((partes, i) => {
        const from = Math.round(PORTADA + i * TEXTO);
        const to = Math.round(PORTADA + (i + 1) * TEXTO);
        return (
          <Sequence key={from} from={from} durationInFrames={to - from}>
            <Frase partes={partes} delay={2} last={i === textos.length - 1} />
          </Sequence>
        );
      })}
      <Sequence from={cierre}>
        <CierreTipo
          partes={cta}
          benefits={beneficios}
          accion="Comprá el tuyo online."
        />
      </Sequence>
    </AbsoluteFill>
  );
};

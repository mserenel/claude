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

// Torpedo para pauta de venta (9:16 y 4:5). Orden pedido por la marca:
// abre con la portada del feed (misma foto y título, así el anuncio y el
// perfil se reconocen), y después una característica por toma, cada una
// sobre el plano del video que la muestra. Materiales confirmados por la
// marca. Sin precios en el video.

export const TORPEDO_VENTA_FRAMES = 600;
const PORTADA = 60;
const TEXTO = 63;
const OFERTA = 75;
const CIERRE = 150;

// [texto, cuadro del video original donde empieza la toma, zoom inicial y final]
type Toma = { partes: Parte[]; from: number; zoom: [number, number] };
const tomas: Toma[] = [
  // Las manos sosteniendo el mate de frente.
  { partes: [{ t: "Hecho a mano.", k: "grande" }], from: 0, zoom: [1.1, 1.2] },
  // El mate girando: se ve la forma de la calabaza.
  {
    partes: [
      { t: "Cuerpo de", k: "chica" },
      { t: "calabaza", k: "grande" },
    ],
    from: 216,
    zoom: [1.15, 1.25],
  },
  // Inclinado, con el cuero a la vista.
  {
    partes: [
      { t: "Forrado en", k: "chica" },
      { t: "cuero crudo", k: "grande" },
    ],
    from: 84,
    zoom: [1.25, 1.35],
  },
  // De frente, con la costura trenzada.
  {
    partes: [
      { t: "Costura de", k: "chica" },
      { t: "tiento", k: "grande" },
    ],
    from: 330,
    zoom: [1.35, 1.45],
  },
  // La boca y la virola de cerca.
  {
    partes: [
      { t: "Virola de", k: "chica" },
      { t: "alpaca", k: "grande" },
    ],
    from: 147,
    zoom: [1.45, 1.55],
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
  const inicioOferta = PORTADA + tomas.length * TEXTO;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Audio src={staticFile("ambiente-20s.m4a")} />
      <Sequence durationInFrames={PORTADA}>
        <Portada />
      </Sequence>
      {tomas.map((t, i) => (
        <Sequence
          key={t.from}
          from={PORTADA + i * TEXTO}
          durationInFrames={TEXTO}
        >
          <Camera
            muted
            from={t.from}
            zoom={[
              [t.from, t.zoom[0]],
              [t.from + TEXTO, t.zoom[1]],
            ]}
          />
          <Frase partes={t.partes} delay={2} />
        </Sequence>
      ))}
      {/* La oferta, antes del cierre, sobre un plano abierto. */}
      <Sequence from={inicioOferta} durationInFrames={OFERTA}>
        <Camera
          muted
          from={270}
          zoom={[
            [270, 1.02],
            [270 + OFERTA, 1.1],
          ]}
        />
        <Frase partes={oferta} delay={2} last />
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
        <CierreTipo
          partes={cta}
          benefits={beneficios}
          accion="Comprá el tuyo online."
        />
      </Sequence>
    </AbsoluteFill>
  );
};

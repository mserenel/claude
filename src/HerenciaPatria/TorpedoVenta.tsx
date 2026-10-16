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
import { colors, fonts } from "./brand";
import { Scrim } from "./Caption";
import {
  ChicaCursivaContext,
  CierreTipo,
  Frase,
  LetraGrandeContext,
  type LetraGrande,
  type Parte,
} from "./Tipografia";

// Torpedo para pauta de venta (9:16 y 4:5). Abre sobre el video con el
// título de la portada del feed ("Mate / TORPEDO / Cuero Crudo"), así el
// anuncio y el perfil se reconocen, y sigue con las mismas tomas del Torpedo
// de 20 s, con una característica por texto en el orden que pidió la marca.
// Materiales confirmados por la marca. Sin precios en el video.

export const TORPEDO_VENTA_FRAMES = 600;
const GANCHO = 60;
const CIERRE = 150;
// Las cinco características y la oferta se reparten por igual el tiempo entre
// el gancho y el cierre.
const TEXTO = (TORPEDO_VENTA_FRAMES - CIERRE - GANCHO) / 6;

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

// La oferta aparece una sola vez (el cierre no la repite). Sin envío gratis.
const oferta: Parte[] = [
  { t: "20% off en transferencia", k: "grande", tam: 80 },
  { t: "o", k: "chica" },
  { t: "3 cuotas sin interés", k: "grande", tam: 80 },
];

const cta: Parte[] = [
  { t: "Tradición", k: "grande" },
  { t: "que se lleva en las manos.", k: "italica" },
];

// El título de la portada del feed (mismas letras, tamaños y disposición que
// PortadaFeed), completo desde el primer cuadro y dentro de la zona visible.
const TituloPortada: React.FC = () => {
  const f = useCurrentFrame();
  const { height } = useVideoConfig();
  const exit = interpolate(f, [GANCHO - 8, GANCHO], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sombra = "0 2px 4px rgba(0,0,0,0.55), 0 4px 26px rgba(0,0,0,0.55)";
  const k = 0.92;
  return (
    <AbsoluteFill>
      <Scrim position="top" />
      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: height > 1500 ? 330 : 70,
          opacity: exit,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: colors.crema,
            textShadow: sombra,
            fontFamily: fonts.serif,
          }}
        >
          <div
            style={{
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 96 * k,
              lineHeight: 1.05,
              marginLeft: 8,
            }}
          >
            Mate
          </div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 138 * k,
              lineHeight: 1,
              letterSpacing: 1,
            }}
          >
            TORPEDO
          </div>
          <div
            style={{
              alignSelf: "flex-end",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 96 * k,
              lineHeight: 1.15,
            }}
          >
            Cuero Crudo
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TorpedoVenta: React.FC<{ readonly letra?: LetraGrande }> = ({
  letra = "addington",
}) => {
  const cierre = TORPEDO_VENTA_FRAMES - CIERRE;
  const textos = [...tomas.map((t) => t.partes), oferta];
  return (
    <LetraGrandeContext.Provider value={letra}>
      <ChicaCursivaContext.Provider value>
        <AbsoluteFill style={{ backgroundColor: "black" }}>
          <Audio src={staticFile("ambiente-20s.m4a")} />
          {/* Las tomas del Torpedo de 20 s: el plano cercano de la virola y la
          boca, y después el video entero a velocidad real. */}
          <Sequence durationInFrames={GANCHO}>
            <Camera
              hq
              muted
              from={140}
              zoom={[
                [140, 1.55],
                [200, 1.42],
              ]}
            />
          </Sequence>
          <Sequence from={GANCHO} durationInFrames={cierre - GANCHO}>
            <Camera hq muted from={0} zoom={zoom20} />
          </Sequence>
          <Sequence from={cierre}>
            <Camera
              hq
              muted
              from={0}
              zoom={[
                [0, 1.02],
                [CIERRE, 1.12],
              ]}
            />
          </Sequence>
          <Sequence durationInFrames={GANCHO}>
            <TituloPortada />
          </Sequence>
          {textos.map((partes, i) => {
            const from = Math.round(GANCHO + i * TEXTO);
            const to = Math.round(GANCHO + (i + 1) * TEXTO);
            return (
              <Sequence key={from} from={from} durationInFrames={to - from}>
                <Frase
                  partes={partes}
                  delay={2}
                  last={i === textos.length - 1}
                  // La oferta entra entera de una vez: las dos líneas se ven
                  // iguales desde el primer cuadro.
                  escalonado={partes === oferta ? 0 : 7}
                />
              </Sequence>
            );
          })}
          <Sequence from={cierre}>
            <CierreTipo
              partes={cta}
              benefits={[]}
              accion="Comprá el tuyo online."
            />
          </Sequence>
        </AbsoluteFill>
      </ChicaCursivaContext.Provider>
    </LetraGrandeContext.Provider>
  );
};

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

// Velocidad del video: real (1). Con 0.8 va al 80% (mate-crudo-4k-lento.mp4)
// y dura 23,5 s; la marca lo prefirió a velocidad real.
const V: 1 | 0.8 = 1;
const GANCHO = 60;
const CIERRE = 120;
// El video original entero (420 cuadros sin el cuadro final sostenido), en
// cuadros de este video.
const CUERPO = Math.round(420 / V);
export const TORPEDO_VENTA_FRAMES = GANCHO + CUERPO + CIERRE;
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
  {
    partes: [
      { t: "Cincelado", k: "chica" },
      { t: "en lacre", k: "grande" },
    ],
  },
];

// La oferta aparece una sola vez (el cierre no la repite). Sin envío gratis.
const oferta: Parte[] = [
  { t: "20% off en transferencia", k: "chica" },
  { t: "3 cuotas sin interés", k: "chica" },
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
          {/* Ambiente real del parque (extendido a 20 s o, para la versión
              lenta, a 23,5 s). */}
          <Audio
            src={staticFile(
              V === 1 ? "ambiente-20s.m4a" : "ambiente-venta.m4a",
            )}
          />
          {/* Las tomas del Torpedo de 20 s: el plano cercano de la virola y la
          boca, y después el video entero. */}
          <Sequence durationInFrames={GANCHO}>
            <Camera
              hq
              velocidad={V}
              muted
              from={140}
              zoom={[
                [140, 1.55],
                [140 + GANCHO * V, 1.42],
              ]}
            />
          </Sequence>
          <Sequence from={GANCHO} durationInFrames={cierre - GANCHO}>
            <Camera hq velocidad={V} muted from={0} zoom={zoom20} />
          </Sequence>
          <Sequence from={cierre}>
            <Camera
              hq
              velocidad={V}
              muted
              from={0}
              zoom={[
                [0, 1.02],
                [CIERRE * V, 1.12],
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
                  // La oferta entra línea por línea, como los demás textos.
                  escalonado={partes === oferta ? 12 : 7}
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

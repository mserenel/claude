import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "./brand";

// Anuncios del mate personalizado (alpaca y bronce, cincelado alrededor de
// cada dije) para una campaña de Ventas con WhatsApp como destino. Tres
// enfoques sobre el mismo video original: A emocional, B producto y
// C conversión directa; cada uno en 9:16 y 4:5. Sólo se reordenan y
// encuadran las tomas reales: el mate no se toca. Sin promociones (no aplican
// a los personalizados). Material: public/hp-personalizado/.

export type Version = "A" | "B" | "C";
export type Formato = "9x16" | "4x5";

export const PERSONALIZADO_FRAMES = 450; // 15 s

// Tipografías: las de la marca, o provisorias mientras no estén en esta
// máquina (Libre Caslon en lugar de Addington, Inter en lugar de Helvetica
// Neue; ambas de licencia libre). Se elige con la prop `provisoria`.
type Tipos = {
  readonly serif: string;
  readonly sans: string;
  readonly cursiva: number;
};
const tiposMarca: Tipos = {
  serif: fonts.serif,
  sans: fonts.sans,
  cursiva: 500,
};
const tiposProvisorios: Tipos = {
  serif: '"Libre Caslon Text", serif',
  sans: '"Inter", sans-serif',
  cursiva: 400,
};

let cargaProvisoria: Promise<void> | null = null;
const cargarProvisoria = () => {
  if (cargaProvisoria) return;
  const espera = delayRender("Tipografías provisorias");
  const archivos: [string, string, string, string][] = [
    [
      "Libre Caslon Text",
      "provisoria/libre-caslon-text-latin-400-normal.woff2",
      "400",
      "normal",
    ],
    [
      "Libre Caslon Text",
      "provisoria/libre-caslon-text-latin-400-italic.woff2",
      "400",
      "italic",
    ],
    [
      "Libre Caslon Text",
      "provisoria/libre-caslon-text-latin-700-normal.woff2",
      "700",
      "normal",
    ],
    ["Inter", "ventas/fonts/inter-latin-500-normal.woff2", "500", "normal"],
    ["Inter", "ventas/fonts/inter-latin-700-normal.woff2", "700", "normal"],
  ];
  cargaProvisoria = Promise.all(
    archivos.map(([family, file, weight, style]) => {
      const font = new FontFace(family, `url(${staticFile(file)})`, {
        weight,
        style,
      });
      return font.load().then(() => {
        document.fonts.add(font);
      });
    }),
  )
    .then(() => continueRender(espera))
    .catch((err) => cancelRender(err));
};

// Tomas del video original (segundos) y su encuadre: zoom y punto de foco
// en % del cuadro (el mate está centrado, un poco arriba).

const T = {
  lav: { ini: 0.3, z0: 1.18, z1: 1.28, fy: 40 },
  sol: { ini: 2.0, z0: 1.15, z1: 1.3, fy: 40 },
  hojas: { ini: 4.3, z0: 1.3, z1: 1.42, fy: 40 },
  mam: { ini: 6.4, z0: 1.2, z1: 1.32, fy: 41 },
  escudo: { ini: 9.0, z0: 1.18, z1: 1.3, fy: 41 },
  arriba: { ini: 13.6, z0: 1.16, z1: 1.24, fy: 46, vel: 0.8, dy: 110 },
} as const;

type Plano = keyof typeof T;

// Guion de cada versión: tomas en orden con su duración y el texto.
type Paso = {
  readonly toma: Plano;
  readonly dur: number;
  readonly kicker?: string;
  readonly texto?: string;
  readonly cursiva?: string;
};

const guiones: Record<Version, Paso[]> = {
  A: [
    { toma: "sol", dur: 72, texto: "Hay cosas", cursiva: "que se heredan." },
    {
      toma: "hojas",
      dur: 60,
      kicker: "CINCELADO A MANO",
      texto: "Alrededor de cada dije",
    },
    {
      toma: "mam",
      dur: 66,
      texto: "Con tus iniciales,",
      cursiva: "tu historia.",
    },
    {
      toma: "escudo",
      dur: 60,
      texto: "Tus colores,",
      cursiva: "para siempre.",
    },
    { toma: "arriba", dur: 192 },
  ],
  B: [
    { toma: "lav", dur: 66, texto: "Mirá", cursiva: "este detalle." },
    {
      toma: "hojas",
      dur: 60,
      kicker: "VIROLA DE ALPACA",
      texto: "Cincelada a mano",
    },
    {
      toma: "sol",
      dur: 66,
      kicker: "DIJES DE BRONCE",
      texto: "El Sol de Mayo",
    },
    {
      toma: "mam",
      dur: 66,
      kicker: "PERSONALIZADO",
      texto: "Letras y escudos",
      cursiva: "a tu gusto.",
    },
    { toma: "arriba", dur: 192 },
  ],
  C: [
    { toma: "escudo", dur: 66, texto: "Tu escudo.", cursiva: "En tu mate." },
    { toma: "mam", dur: 54, texto: "Tus iniciales." },
    { toma: "sol", dur: 54, texto: "Tu símbolo." },
    {
      toma: "hojas",
      dur: 60,
      kicker: "PERSONALIZADO",
      texto: "En alpaca y bronce",
    },
    { toma: "arriba", dur: 216 },
  ],
};

const cierre: Record<Version, { titulo: string; cursiva: string }> = {
  A: { titulo: "Un mate que es parte", cursiva: "de tu historia." },
  B: { titulo: "Hecho a mano,", cursiva: "hecho para vos." },
  C: { titulo: "Hacé el tuyo", cursiva: "a tu medida." },
};

const FUNDIDO = 8;

const Clip: React.FC<{
  readonly toma: Plano;
  readonly dur: number;
  readonly formato: Formato;
  readonly primero?: boolean;
}> = ({ toma, dur, formato, primero }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = T[toma];
  const vel = "vel" in t ? t.vel : 0.9;
  const k = interpolate(f, [0, dur], [t.z0, t.z1], {
    easing: Easing.inOut(Easing.quad),
  });
  const entra = primero
    ? 1
    : interpolate(f, [0, FUNDIDO], [0, 1], { extrapolateRight: "clamp" });
  // En 4:5 la toma vertical se ve entera de ancho y recortada arriba y abajo,
  // centrada en el mate (no se deforma).
  const fy = formato === "4x5" ? t.fy + 2 : t.fy;
  // En el cierre el mate baja un poco para dejar lugar al logo y al texto.
  const dy = "dy" in t ? (formato === "9x16" ? t.dy : t.dy * 0.4) : 0;
  return (
    <AbsoluteFill style={{ opacity: entra, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("hp-personalizado/mate-personalizado.mp4")}
        trimBefore={Math.round(t.ini * fps)}
        playbackRate={vel}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `50% ${fy}%`,
          transform: `translateY(${dy}px) scale(${k})`,
          transformOrigin: `50% ${fy}%`,
        }}
      />
    </AbsoluteFill>
  );
};

const Texto: React.FC<{
  readonly paso: Paso;
  readonly dur: number;
  readonly top: number;
  readonly gancho?: boolean;
  readonly tp: Tipos;
}> = ({ paso, dur, top, gancho, tp }) => {
  const f = useCurrentFrame();
  if (!paso.texto) return null;
  const e = interpolate(f, gancho ? [-10, 2] : [4, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const s = interpolate(f, [dur - 8, dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top,
        textAlign: "center",
        color: colors.crema,
        opacity: e * s,
        transform: `translateY(${(1 - e) * 18}px)`,
        textShadow: "0 3px 24px rgba(0,0,0,0.55)",
      }}
    >
      {paso.kicker ? (
        <div
          style={{
            fontFamily: tp.sans,
            fontWeight: 500,
            fontSize: 30,
            letterSpacing: 8,
            marginBottom: 14,
            opacity: 0.9,
          }}
        >
          {paso.kicker}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: tp.serif,
          fontWeight: 700,
          fontSize: 84,
          lineHeight: 1.05,
        }}
      >
        {paso.texto}
      </div>
      {paso.cursiva ? (
        <div
          style={{
            fontFamily: tp.serif,
            fontStyle: "italic",
            fontWeight: tp.cursiva,
            fontSize: 84,
            lineHeight: 1.1,
          }}
        >
          {paso.cursiva}
        </div>
      ) : null}
    </div>
  );
};

// Cierre: logo, frase y llamado a WhatsApp, sobre la vista desde arriba.
const Cierre: React.FC<{
  readonly version: Version;
  readonly formato: Formato;
  readonly tp: Tipos;
}> = ({ version, formato, tp }) => {
  const f = useCurrentFrame();
  const e = (a: number) =>
    interpolate(f, [a, a + 16], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  const c = cierre[version];
  const alto = formato === "9x16";
  return (
    <>
      <AbsoluteFill
        style={{
          background: alto
            ? "linear-gradient(to bottom, rgba(20,35,59,0.85) 0%, rgba(20,35,59,0.55) 34%, rgba(20,35,59,0) 52%)"
            : "linear-gradient(to bottom, rgba(20,35,59,0.85) 0%, rgba(20,35,59,0.5) 40%, rgba(20,35,59,0) 60%)",
          opacity: e(0),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: alto ? 300 : 70,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          color: colors.crema,
        }}
      >
        <Img
          src={staticFile("logo-herencia-patria.png")}
          style={{
            width: alto ? 150 : 120,
            height: alto ? 150 : 120,
            opacity: e(4),
            marginBottom: alto ? 22 : 14,
          }}
        />
        <div
          style={{
            opacity: e(14),
            transform: `translateY(${(1 - e(14)) * 16}px)`,
          }}
        >
          <div
            style={{
              fontFamily: tp.serif,
              fontWeight: 700,
              fontSize: alto ? 76 : 66,
              lineHeight: 1.05,
            }}
          >
            {c.titulo}
          </div>
          <div
            style={{
              fontFamily: tp.serif,
              fontStyle: "italic",
              fontWeight: tp.cursiva,
              fontSize: alto ? 76 : 66,
              lineHeight: 1.1,
            }}
          >
            {c.cursiva}
          </div>
        </div>
        <div
          style={{
            marginTop: alto ? 34 : 24,
            padding: alto ? "24px 46px" : "20px 40px",
            borderRadius: 60,
            background: colors.crema,
            color: colors.azul,
            fontFamily: tp.sans,
            fontWeight: 700,
            fontSize: alto ? 40 : 36,
            opacity: e(30),
            transform: `scale(${0.94 + 0.06 * e(30)})`,
            boxShadow: "0 12px 34px rgba(0,0,0,0.35)",
          }}
        >
          Pedí el tuyo por WhatsApp
        </div>
        {version !== "A" ? null : (
          <div
            style={{
              marginTop: 18,
              fontFamily: tp.sans,
              fontWeight: 500,
              fontSize: alto ? 30 : 28,
              opacity: e(40) * 0.9,
            }}
          >
            Personalizado en alpaca y bronce
          </div>
        )}
      </div>
    </>
  );
};

export const MatePersonalizado: React.FC<{
  readonly version: Version;
  readonly formato: Formato;
  readonly provisoria?: boolean;
}> = ({ version, formato, provisoria }) => {
  if (provisoria) cargarProvisoria();
  const tp = provisoria ? tiposProvisorios : tiposMarca;
  const pasos = guiones[version];
  const alto = formato === "9x16";
  // Texto arriba del mate, dentro de la zona segura (Reels: 270–1250).
  const top = alto ? 330 : 80;
  let t = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {pasos.map((p, i) => {
        const desde = t;
        t += p.dur;
        const ultimo = i === pasos.length - 1;
        return (
          <Sequence
            key={i}
            from={Math.max(0, desde - (i ? FUNDIDO : 0))}
            durationInFrames={p.dur + (i ? FUNDIDO : 0)}
          >
            <Clip
              toma={p.toma}
              dur={p.dur + FUNDIDO}
              formato={formato}
              primero={i === 0}
            />
            {/* Sombra suave arriba para leer el texto */}
            {!ultimo ? (
              <AbsoluteFill
                style={{
                  background: alto
                    ? "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.12) 32%, rgba(0,0,0,0) 45%)"
                    : "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0) 50%)",
                }}
              />
            ) : null}
            <Sequence from={i ? FUNDIDO : 0} layout="none">
              {ultimo ? (
                <Cierre version={version} formato={formato} tp={tp} />
              ) : (
                <Texto
                  paso={p}
                  dur={p.dur}
                  top={top}
                  gancho={i === 0}
                  tp={tp}
                />
              )}
            </Sequence>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

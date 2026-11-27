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

// El video original es un solo giro continuo del mate. Para que fluya, cada
// versión usa tramos largos de ese giro (en vez de muchos cortes) y sólo
// pasa a otro tramo con un fundido lento. Los textos cambian mientras el
// mate gira, cuando aparece cada detalle. En el original: letras «LAV»
// 0–2 s, Sol de Mayo 2–4,4 s, cincelado 4,4–6,3 s, «MAM» 6,3–8,9 s, escudo
// 9–11,4 s, vista de arriba 13,6–15,3 s.

type Rotulo = {
  readonly desde: number; // cuadro del anuncio
  readonly hasta: number;
  readonly kicker?: string;
  readonly texto?: string;
  readonly cursiva?: string;
};

// Sin cortes ni fundidos: el video original corre de corrido, a velocidad
// real, desde el segundo 0,3. Sólo se superponen los textos y el cierre.
const INICIO = 0.3;
// Cuadro del anuncio en el que se ve un segundo del original.
const en = (seg: number) => Math.round((seg - INICIO) * 30);
// El cierre (logo, frase y WhatsApp) entra sobre el último giro.
const CIERRE = en(11.6);
const SUAVE = 18;

const rotulos: Record<Version, Rotulo[]> = {
  A: [
    {
      desde: 0,
      hasta: en(4.3),
      texto: "Hay cosas",
      cursiva: "que se heredan.",
    },
    {
      desde: en(4.4),
      hasta: en(6.2),
      kicker: "CINCELADO A MANO",
      texto: "Alrededor de cada dije",
    },
    {
      desde: en(6.3),
      hasta: en(8.9),
      texto: "Con tus iniciales,",
      cursiva: "tu historia.",
    },
    {
      desde: en(9.0),
      hasta: CIERRE - 4,
      texto: "Tus colores,",
      cursiva: "para siempre.",
    },
  ],
  B: [
    { desde: 0, hasta: en(2.0), texto: "Mirá", cursiva: "este detalle." },
    {
      desde: en(2.1),
      hasta: en(4.3),
      kicker: "DIJES DE BRONCE",
      texto: "El Sol de Mayo",
    },
    {
      desde: en(4.4),
      hasta: en(6.2),
      kicker: "VIROLA DE ALPACA",
      texto: "Cincelada a mano",
    },
    {
      desde: en(6.3),
      hasta: CIERRE - 4,
      kicker: "PERSONALIZADO",
      texto: "Letras y escudos",
      cursiva: "a tu gusto.",
    },
  ],
  C: [
    {
      desde: 0,
      hasta: en(4.3),
      texto: "Tus iniciales.",
      cursiva: "En tu mate.",
    },
    {
      desde: en(4.4),
      hasta: en(8.9),
      kicker: "PERSONALIZADO",
      texto: "En alpaca y bronce",
    },
    {
      desde: en(9.0),
      hasta: CIERRE - 4,
      texto: "Tu escudo.",
      cursiva: "Tus colores.",
    },
  ],
};

const cierre: Record<Version, { titulo: string; cursiva: string }> = {
  A: { titulo: "Un mate que es parte", cursiva: "de tu historia." },
  B: { titulo: "Hecho a mano,", cursiva: "hecho para vos." },
  C: { titulo: "Hacé el tuyo", cursiva: "a tu medida." },
};

const Clip: React.FC<{ readonly formato: Formato }> = ({ formato }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Acercamiento muy lento y parejo durante todo el video.
  const k = interpolate(f, [0, PERSONALIZADO_FRAMES], [1.16, 1.26]);
  // Al llegar el cierre, el mate baja despacio para dejar lugar al logo.
  const dy = interpolate(
    f,
    [CIERRE, CIERRE + 60],
    [0, formato === "9x16" ? 110 : 44],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.sin),
    },
  );
  const fy = formato === "4x5" ? 44 : 42;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("hp-personalizado/mate-personalizado.mp4")}
        trimBefore={Math.round(INICIO * fps)}
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
  readonly paso: Rotulo;
  readonly dur: number;
  readonly top: number;
  readonly gancho?: boolean;
  readonly tp: Tipos;
}> = ({ paso, dur, top, gancho, tp }) => {
  const f = useCurrentFrame();
  if (!paso.texto) return null;
  const e = interpolate(f, gancho ? [-10, 2] : [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const s = interpolate(f, [dur - 12, dur], [1, 0], {
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
    interpolate(f, [a, a + 24], [0, 1], {
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
  const alto = formato === "9x16";
  // Texto arriba del mate, dentro de la zona segura (Reels: 270–1250).
  const top = alto ? 330 : 80;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Clip formato={formato} />
      {/* Sombra suave arriba para leer el texto; se va al llegar el cierre */}
      <Sequence durationInFrames={CIERRE + SUAVE}>
        <SombraArriba alto={alto} hasta={CIERRE} />
      </Sequence>
      {rotulos[version].map((r, i) => (
        <Sequence key={i} from={r.desde} durationInFrames={r.hasta - r.desde}>
          <Texto
            paso={r}
            dur={r.hasta - r.desde}
            top={top}
            gancho={i === 0}
            tp={tp}
          />
        </Sequence>
      ))}
      <Sequence from={CIERRE}>
        <Cierre version={version} formato={formato} tp={tp} />
      </Sequence>
    </AbsoluteFill>
  );
};

const SombraArriba: React.FC<{
  readonly alto: boolean;
  readonly hasta: number;
}> = ({ alto, hasta }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [hasta, hasta + SUAVE], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        background: alto
          ? "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.12) 32%, rgba(0,0,0,0) 45%)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0) 50%)",
      }}
    />
  );
};

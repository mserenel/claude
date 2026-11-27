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

type Tramo = {
  readonly ini: number; // segundo del original
  readonly vel: number;
  readonly desde: number; // cuadro del anuncio
  readonly hasta: number;
  readonly cierre?: boolean;
};

// Cuadro del anuncio en el que aparece un segundo del original dentro de un
// tramo (para ubicar los textos sobre cada detalle).
const en = (t: Tramo, seg: number) =>
  Math.round(t.desde + ((seg - t.ini) / t.vel) * 30);

const VEL = 0.85;
const FUNDIDO = 18;

const tramos: Record<Version, Tramo[]> = {
  A: [
    { ini: 2.0, vel: VEL, desde: 0, hasta: 332 },
    {
      ini: 13.6,
      vel: 0.7,
      desde: 332 - FUNDIDO,
      hasta: PERSONALIZADO_FRAMES,
      cierre: true,
    },
  ],
  B: [
    { ini: 0.3, vel: VEL, desde: 0, hasta: 304 },
    {
      ini: 13.6,
      vel: 0.6,
      desde: 304 - FUNDIDO,
      hasta: PERSONALIZADO_FRAMES,
      cierre: true,
    },
  ],
  C: [
    { ini: 8.8, vel: VEL, desde: 0, hasta: 166 },
    { ini: 2.0, vel: VEL, desde: 166 - FUNDIDO, hasta: 251 },
    {
      ini: 13.6,
      vel: 0.55,
      desde: 251 - FUNDIDO,
      hasta: PERSONALIZADO_FRAMES,
      cierre: true,
    },
  ],
};

const rotulos: Record<Version, Rotulo[]> = {
  A: (() => {
    const t = tramos.A[0];
    return [
      {
        desde: 0,
        hasta: en(t, 4.3),
        texto: "Hay cosas",
        cursiva: "que se heredan.",
      },
      {
        desde: en(t, 4.4),
        hasta: en(t, 6.2),
        kicker: "CINCELADO A MANO",
        texto: "Alrededor de cada dije",
      },
      {
        desde: en(t, 6.3),
        hasta: en(t, 8.9),
        texto: "Con tus iniciales,",
        cursiva: "tu historia.",
      },
      {
        desde: en(t, 9.0),
        hasta: 326,
        texto: "Tus colores,",
        cursiva: "para siempre.",
      },
    ];
  })(),
  B: (() => {
    const t = tramos.B[0];
    return [
      { desde: 0, hasta: en(t, 2.0), texto: "Mirá", cursiva: "este detalle." },
      {
        desde: en(t, 2.1),
        hasta: en(t, 4.3),
        kicker: "DIJES DE BRONCE",
        texto: "El Sol de Mayo",
      },
      {
        desde: en(t, 4.4),
        hasta: en(t, 6.2),
        kicker: "VIROLA DE ALPACA",
        texto: "Cincelada a mano",
      },
      {
        desde: en(t, 6.3),
        hasta: 298,
        kicker: "PERSONALIZADO",
        texto: "Letras y escudos",
        cursiva: "a tu gusto.",
      },
    ];
  })(),
  C: (() => {
    const [t1, t2] = tramos.C;
    return [
      {
        desde: 0,
        hasta: en(t1, 11.4),
        texto: "Tu escudo.",
        cursiva: "En tu mate.",
      },
      { desde: en(t1, 11.5), hasta: 160, texto: "Tus iniciales." },
      { desde: t2.desde + 10, hasta: 245, texto: "Tu símbolo." },
    ];
  })(),
};

const cierre: Record<Version, { titulo: string; cursiva: string }> = {
  A: { titulo: "Un mate que es parte", cursiva: "de tu historia." },
  B: { titulo: "Hecho a mano,", cursiva: "hecho para vos." },
  C: { titulo: "Hacé el tuyo", cursiva: "a tu medida." },
};

const Clip: React.FC<{
  readonly tramo: Tramo;
  readonly formato: Formato;
  readonly primero: boolean;
}> = ({ tramo, formato, primero }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = tramo.hasta - tramo.desde;
  // Acercamiento muy lento y parejo, sin saltos de escala entre tramos.
  const k = tramo.cierre
    ? interpolate(f, [0, dur], [1.16, 1.22])
    : interpolate(f, [0, dur], [1.2, 1.28]);
  const entra = primero
    ? 1
    : interpolate(f, [0, FUNDIDO], [0, 1], {
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.sin),
      });
  const fy = formato === "4x5" ? 42 : 40;
  // En el cierre el mate baja un poco para dejar lugar al logo y al texto.
  const dy = tramo.cierre ? (formato === "9x16" ? 110 : 44) : 0;
  return (
    <AbsoluteFill style={{ opacity: entra, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("hp-personalizado/mate-personalizado.mp4")}
        trimBefore={Math.round(tramo.ini * fps)}
        playbackRate={tramo.vel}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `50% ${tramo.cierre ? 46 : fy}%`,
          transform: `translateY(${dy}px) scale(${k})`,
          transformOrigin: `50% ${tramo.cierre ? 46 : fy}%`,
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
  const alto = formato === "9x16";
  // Texto arriba del mate, dentro de la zona segura (Reels: 270–1250).
  const top = alto ? 330 : 80;
  const lista = tramos[version];
  const cierreDesde = lista[lista.length - 1].desde;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {lista.map((tr, i) => (
        <Sequence
          key={`t${i}`}
          from={tr.desde}
          durationInFrames={tr.hasta - tr.desde}
        >
          <Clip tramo={tr} formato={formato} primero={i === 0} />
        </Sequence>
      ))}
      {/* Sombra suave arriba para leer el texto, se va al llegar al cierre */}
      <Sequence durationInFrames={cierreDesde + FUNDIDO}>
        <SombraArriba alto={alto} hasta={cierreDesde} />
      </Sequence>
      {rotulos[version].map((r, i) => (
        <Sequence
          key={`r${i}`}
          from={r.desde}
          durationInFrames={r.hasta - r.desde}
        >
          <Texto
            paso={r}
            dur={r.hasta - r.desde}
            top={top}
            gancho={i === 0}
            tp={tp}
          />
        </Sequence>
      ))}
      <Sequence from={cierreDesde + FUNDIDO}>
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
  const o = interpolate(f, [hasta, hasta + FUNDIDO], [1, 0], {
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

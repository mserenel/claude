import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// TikTok de café (9:16, 20 s): "3 errores que arruinan tu café". Gancho en
// el primer segundo, barra de progreso arriba (retiene hasta el final), un
// error por bloque con su corrección, y cierre que vuelve a la taza del
// principio para que el video loopee. Todo animado por código; tipografías
// libres (Anton y Archivo, licencia OFL) en public/cafe/fonts.

export const CAFE_FRAMES = 600;

export const c = {
  fondo: "#1C120C",
  brillo: "#3B2417",
  crema: "#F4E9DC",
  caramelo: "#E39A4F",
  cafe: "#4A2B1B",
  espresso: "#2A170E",
  rojo: "#E5533C",
  verde: "#7CC07A",
  metal: "#C9CDD3",
};

export const titular = '"Anton", sans-serif';
export const texto = '"Archivo", sans-serif';

// ---- Tipografías ----
const fuentes: [string, string, string][] = [
  ["Anton", "anton-latin-400-normal.woff2", "400"],
  ["Archivo", "archivo-latin-400-normal.woff2", "400"],
  ["Archivo", "archivo-latin-700-normal.woff2", "700"],
  ["Archivo", "archivo-latin-800-normal.woff2", "800"],
  ["Archivo", "archivo-latin-900-normal.woff2", "900"],
];
const espera = delayRender("Tipografías del video de café");
Promise.all(
  fuentes.map(([family, file, weight]) => {
    const font = new FontFace(
      family,
      `url(${staticFile(`cafe/fonts/${file}`)})`,
      { weight },
    );
    return font.load().then(() => document.fonts.add(font));
  }),
)
  .then(() => continueRender(espera))
  .catch((err) => cancelRender(err));

// ---- Utilidades ----
export const iv = (
  f: number,
  de: number[],
  a: number[],
  ease = Easing.inOut(Easing.cubic),
) =>
  interpolate(f, de, a, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

const useSp = (desde: number, damping = 12) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return Math.max(0, spring({ frame: f - desde, fps, config: { damping } }));
};

// Bloques del video.
export const B = {
  gancho: [0, 60],
  e1: [60, 220],
  e2: [220, 380],
  e3: [380, 540],
  cierre: [540, CAFE_FRAMES],
} as const;

// ---- Fondo ----
const Fondo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, ${c.brillo} 0%, ${c.fondo} 62%, #0E0806 100%)`,
      }}
    >
      <svg width={1080} height={1920}>
        {/* Granos de café que flotan, desenfocados */}
        {new Array(14).fill(0).map((_, i) => {
          const x = random(`gx${i}`) * 1080;
          const y =
            ((((random(`gy${i}`) * 2200 - f * (0.6 + random(`gv${i}`))) %
              2200) +
              2200) %
              2200) -
            140;
          const r = 18 + random(`gr${i}`) * 26;
          return (
            <g
              key={i}
              transform={`translate(${x} ${y}) rotate(${random(`ga${i}`) * 360 + f * 0.4})`}
              opacity={0.12 + random(`go${i}`) * 0.12}
            >
              <ellipse rx={r} ry={r * 0.7} fill={c.cafe} />
              <path
                d={`M${-r * 0.8},0 C${-r * 0.3},${-r * 0.35} ${r * 0.3},${r * 0.35} ${r * 0.8},0`}
                stroke={c.espresso}
                strokeWidth={r * 0.14}
                fill="none"
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ---- Barra de progreso (3 errores) ----
export const Progreso: React.FC = () => {
  const f = useCurrentFrame();
  const tramos = [B.e1, B.e2, B.e3];
  const o = iv(f, [50, 62], [0, 1]) * iv(f, [540, 552], [1, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top: 190,
        left: 90,
        right: 90,
        display: "flex",
        gap: 14,
        opacity: o,
      }}
    >
      {tramos.map(([a, b], i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 12,
            borderRadius: 6,
            background: "rgba(244,233,220,0.18)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${iv(f, [a, b], [0, 100], Easing.linear)}%`,
              height: "100%",
              background: c.caramelo,
            }}
          />
        </div>
      ))}
    </div>
  );
};

// ---- Títulos ----
export const TituloError: React.FC<{
  readonly n: number;
  readonly titulo: string;
  readonly desde: number;
  readonly hasta: number;
}> = ({ n, titulo, desde, hasta }) => {
  const f = useCurrentFrame();
  const s = useSp(desde, 11);
  if (f < desde || f >= hasta) return null;
  const sale = iv(f, [hasta - 8, hasta], [1, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top: 270,
        left: 60,
        right: 60,
        textAlign: "center",
        opacity: sale,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "10px 26px",
          borderRadius: 40,
          background: c.rojo,
          color: c.crema,
          fontFamily: texto,
          fontWeight: 900,
          fontSize: 34,
          letterSpacing: 4,
          transform: `scale(${s})`,
        }}
      >
        ERROR {n}/3
      </div>
      <div
        style={{
          marginTop: 18,
          fontFamily: titular,
          fontSize: 118,
          lineHeight: 1,
          color: c.crema,
          textTransform: "uppercase",
          transform: `translateY(${(1 - s) * 40}px)`,
          opacity: Math.min(1, s),
          textShadow: "0 6px 30px rgba(0,0,0,0.5)",
        }}
      >
        {titulo}
      </div>
    </div>
  );
};

// ---- Subtítulos palabra por palabra (estilo TikTok) ----
type Linea = {
  readonly desde: number;
  readonly hasta: number;
  readonly t: string;
};

const lineas: Linea[] = [
  { desde: 8, hasta: 60, t: "Si hacés esto, tu café sale *amargo" },
  { desde: 66, hasta: 140, t: "El agua hirviendo *quema el café" },
  { desde: 140, hasta: 220, t: "Usala entre *90 *y *96 °C" },
  { desde: 226, hasta: 300, t: "Molido hace semanas *pierde *el *aroma" },
  { desde: 300, hasta: 380, t: "Molelo *justo *antes de prepararlo" },
  { desde: 386, hasta: 460, t: "A ojo, *cada *taza *sale *distinta" },
  { desde: 460, hasta: 540, t: "*1 *gramo de café cada *16 *ml de agua" },
  { desde: 548, hasta: CAFE_FRAMES, t: "¿Cuál cometías *vos?" },
];

export const Subtitulos: React.FC = () => {
  const f = useCurrentFrame();
  const l = lineas.find((x) => f >= x.desde && f < x.hasta);
  if (!l) return null;
  const local = f - l.desde;
  const palabras = l.t.split(" ");
  const sale =
    l.hasta === CAFE_FRAMES
      ? 1
      : iv(local, [l.hasta - l.desde - 5, l.hasta - l.desde], [1, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top: 1190,
        left: 90,
        right: 150,
        textAlign: "center",
        opacity: sale,
        fontFamily: texto,
        fontWeight: 900,
        fontSize: 70,
        lineHeight: 1.12,
        color: c.crema,
        textShadow: "0 4px 0 rgba(0,0,0,0.55), 0 8px 26px rgba(0,0,0,0.5)",
      }}
    >
      {palabras.map((w, i) => {
        const t = local - i * 3;
        const clave = w.startsWith("*");
        const pop = iv(t, [0, 3, 6], [0.6, 1.12, 1], Easing.out(Easing.quad));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.24em",
              color: clave ? c.caramelo : c.crema,
              opacity: t < 0 ? 0 : 1,
              transform: `scale(${pop})`,
            }}
          >
            {clave ? w.slice(1) : w}
          </span>
        );
      })}
    </div>
  );
};

// ---- Sellos de mal / bien ----
export const Sello: React.FC<{
  readonly bien: boolean;
  readonly desde: number;
  readonly hasta: number;
  readonly x: number;
  readonly y: number;
}> = ({ bien, desde, hasta, x, y }) => {
  const f = useCurrentFrame();
  const s = useSp(desde, 9);
  if (f < desde || f >= hasta) return null;
  const o = iv(f, [hasta - 6, hasta], [1, 0]);
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s}) rotate(${(1 - Math.min(1, s)) * -30 + (bien ? 0 : -8)})`}
      opacity={o}
    >
      <circle r={92} fill={bien ? c.verde : c.rojo} />
      <circle r={92} fill="none" stroke={c.crema} strokeWidth={8} />
      {bien ? (
        <path
          d="M-42,4 L-12,34 L46,-30"
          stroke={c.crema}
          strokeWidth={20}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ) : (
        <path
          d="M-36,-36 L36,36 M36,-36 L-36,36"
          stroke={c.crema}
          strokeWidth={20}
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

// ---- Taza (gancho y cierre) ----
const Vapor: React.FC<{ readonly x: number; readonly y: number }> = ({
  x,
  y,
}) => {
  const f = useCurrentFrame();
  return (
    <>
      {[0, 1, 2].map((i) => {
        const t = ((f + i * 14) % 42) / 42;
        return (
          <path
            key={i}
            d={`M${x - 60 + i * 60},${y} c-30,-40 30,-70 0,-110`}
            stroke={c.crema}
            strokeWidth={10}
            strokeLinecap="round"
            fill="none"
            opacity={iv(t, [0, 0.3, 1], [0, 0.45, 0])}
            transform={`translate(${Math.sin(f / 9 + i) * 8} ${-t * 40})`}
          />
        );
      })}
    </>
  );
};

const Taza: React.FC<{ readonly k: number }> = ({ k }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(540 860) scale(${k})`}>
      <ellipse cx={0} cy={250} rx={330} ry={46} fill="rgba(0,0,0,0.45)" />
      <ellipse cx={0} cy={232} rx={300} ry={52} fill="#EDE3D6" />
      <ellipse cx={0} cy={226} rx={250} ry={36} fill="#D9CDBE" />
      {/* Asa */}
      <path
        d="M200,-40 C330,-40 330,140 190,150"
        stroke="#F2EADF"
        strokeWidth={46}
        fill="none"
        strokeLinecap="round"
      />
      {/* Cuerpo */}
      <path
        d="M-230,-120 L230,-120 C226,60 170,210 0,214 C-170,210 -226,60 -230,-120 Z"
        fill="#F7F0E6"
      />
      <path
        d="M-200,-80 C-196,40 -150,150 -70,190"
        stroke="rgba(255,255,255,0.8)"
        strokeWidth={22}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M120,-90 C120,40 90,140 30,190"
        stroke="rgba(0,0,0,0.06)"
        strokeWidth={60}
        strokeLinecap="round"
        fill="none"
      />
      {/* Café con crema y corazón de latte art que gira apenas */}
      <ellipse cx={0} cy={-120} rx={230} ry={46} fill="#E8DCCB" />
      <ellipse cx={0} cy={-116} rx={208} ry={38} fill={c.cafe} />
      <g transform={`translate(0 -116) scale(1 0.2) rotate(${f * 0.6})`}>
        <path
          d="M0,110 C-130,20 -150,-80 -70,-110 C-30,-124 0,-90 0,-60 C0,-90 30,-124 70,-110 C150,-80 130,20 0,110 Z"
          fill="#E9C9A0"
        />
      </g>
      <Vapor x={0} y={-170} />
    </g>
  );
};

const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  // Arranca ya armado en el primer cuadro: TikTok decide en un segundo.
  const s = useSp(-6, 10);
  if (f >= B.gancho[1] + 6) return null;
  // Golpe de zoom al arrancar: el ojo se queda.
  const k = iv(f, [0, 10], [1.25, 1], Easing.out(Easing.cubic));
  const sale = iv(f, [56, 66], [1, 0]);
  return (
    <AbsoluteFill style={{ opacity: sale }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <Taza k={k} />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `scale(${0.7 + 0.3 * s})`,
          opacity: Math.min(1, s),
        }}
      >
        <div
          style={{
            fontFamily: titular,
            fontSize: 190,
            lineHeight: 0.95,
            color: c.caramelo,
            textShadow: "0 8px 40px rgba(0,0,0,0.55)",
          }}
        >
          3 ERRORES
        </div>
        <div
          style={{
            fontFamily: texto,
            fontWeight: 800,
            fontSize: 62,
            color: c.crema,
            marginTop: 6,
          }}
        >
          que arruinan tu café
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- Error 1: agua hirviendo ----
const Error1: React.FC = () => {
  const f = useCurrentFrame();
  if (f < B.e1[0] || f >= B.e1[1]) return null;
  const temp = 60 + iv(f, [70, 110], [0, 40]) - iv(f, [145, 175], [0, 7]);
  const hierve = f >= 100 && f < 145 ? 1 : 0;
  const tiembla = hierve ? Math.sin(f * 2.2) * 3 : 0;
  const y0 = 1000;
  const yT = (t: number) => iv(t, [40, 100], [y0, 560], Easing.linear);
  const o = iv(f, [60, 70], [0, 1]) * iv(f, [212, 220], [1, 0]);
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute" }}
      opacity={o}
    >
      {/* Pava */}
      <g transform={`translate(380 ${880 + tiembla})`}>
        <ellipse cx={0} cy={150} rx={200} ry={26} fill="rgba(0,0,0,0.4)" />
        <path
          d="M-170,140 C-190,20 -150,-90 0,-100 C150,-90 190,20 170,140 Z"
          fill="#B9BEC6"
        />
        <path
          d="M-120,110 C-140,30 -110,-50 -40,-70"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth={18}
          strokeLinecap="round"
          fill="none"
        />
        <path d="M150,0 L270,-90 L284,-74 L172,40 Z" fill="#AEB3BB" />
        <path
          d="M-90,-100 C-90,-210 90,-210 90,-100"
          stroke="#2A2A2A"
          strokeWidth={22}
          fill="none"
        />
        <g transform={`rotate(${tiembla * 2})`}>
          <rect
            x={-60}
            y={-122}
            width={120}
            height={28}
            rx={12}
            fill="#2A2A2A"
          />
        </g>
        {/* Vapor a borbotones del pico */}
        {new Array(7).fill(0).map((_, i) => {
          const t = ((f - 96 + i * 5) % 30) / 30;
          return (
            <circle
              key={i}
              cx={280 + t * 60 + i * 4}
              cy={-90 - t * 160}
              r={14 + t * 36}
              fill={c.crema}
              opacity={hierve * iv(t, [0, 0.2, 1], [0, 0.5, 0])}
            />
          );
        })}
      </g>
      {/* Termómetro */}
      <g>
        <rect x={720} y={520} width={70} height={520} rx={35} fill={c.crema} />
        <circle cx={755} cy={1040} r={62} fill={c.crema} />
        <rect
          x={739}
          y={yT(temp)}
          width={32}
          height={1040 - yT(temp)}
          rx={16}
          fill={temp > 97 ? c.rojo : c.caramelo}
        />
        <circle
          cx={755}
          cy={1040}
          r={44}
          fill={temp > 97 ? c.rojo : c.caramelo}
        />
        <rect
          x={700}
          y={yT(96)}
          width={110}
          height={yT(90) - yT(96)}
          rx={8}
          fill={c.verde}
          opacity={iv(f, [150, 165], [0, 0.55])}
        />
        <text
          x={830}
          y={yT(temp) + 22}
          fontFamily={titular}
          fontSize={76}
          fill={temp > 97 ? c.rojo : c.crema}
        >
          {Math.round(temp)}°
        </text>
      </g>
      <Sello bien={false} desde={108} hasta={142} x={380} y={620} />
      <Sello bien desde={168} hasta={220} x={380} y={620} />
    </svg>
  );
};

// ---- Error 2: café molido hace semanas ----
const Aroma: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly fuerza: number;
}> = ({ x, y, fuerza }) => {
  const f = useCurrentFrame();
  return (
    <>
      {[0, 1, 2, 3].map((i) => {
        const t = ((f + i * 11) % 44) / 44;
        return (
          <path
            key={i}
            d={`M${x - 75 + i * 50},${y} c-26,-34 26,-60 0,-94 c-26,-34 26,-60 0,-94`}
            stroke={c.caramelo}
            strokeWidth={9}
            strokeLinecap="round"
            fill="none"
            opacity={fuerza * iv(t, [0, 0.3, 1], [0, 0.7, 0])}
            transform={`translate(0 ${-t * 70})`}
          />
        );
      })}
    </>
  );
};

const Error2: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSp(296, 12);
  if (f < B.e2[0] || f >= B.e2[1]) return null;
  const o = iv(f, [220, 230], [0, 1]) * iv(f, [372, 380], [1, 0]);
  const bolsa = iv(f, [285, 300], [1, 0]);
  const molinillo = iv(f, [296, 312], [0, 1]);
  const manivela = (f - 300) * 14;
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute" }}
      opacity={o}
    >
      {/* Bolsa vieja que ya no huele */}
      <g opacity={bolsa} transform="translate(470 860)">
        <ellipse cx={0} cy={230} rx={200} ry={26} fill="rgba(0,0,0,0.4)" />
        <path d="M-160,-170 L160,-170 L180,220 L-180,220 Z" fill="#6B4630" />
        <path d="M-160,-170 L160,-170 L150,-220 L-150,-220 Z" fill="#8A5E42" />
        <path
          d="M-150,-200 L150,-200"
          stroke="rgba(0,0,0,0.25)"
          strokeWidth={6}
          strokeDasharray="14 10"
        />
        <circle cx={0} cy={10} r={92} fill={c.crema} />
        <ellipse cx={0} cy={10} rx={40} ry={56} fill={c.cafe} />
        <path
          d="M0,-44 C-18,-10 18,30 0,64"
          stroke={c.crema}
          strokeWidth={8}
          fill="none"
        />
        <Aroma x={0} y={-230} fuerza={iv(f, [230, 280], [1, 0.08])} />
        {/* Calendario */}
        <g transform="translate(220 -150) rotate(10)">
          <rect
            x={-90}
            y={-70}
            width={180}
            height={150}
            rx={18}
            fill={c.crema}
          />
          <rect x={-90} y={-70} width={180} height={44} rx={18} fill={c.rojo} />
          <rect x={-90} y={-44} width={180} height={18} fill={c.rojo} />
          <text
            x={0}
            y={40}
            textAnchor="middle"
            fontFamily={titular}
            fontSize={70}
            fill={c.espresso}
          >
            -21
          </text>
          <text
            x={0}
            y={70}
            textAnchor="middle"
            fontFamily={texto}
            fontWeight={800}
            fontSize={22}
            fill={c.espresso}
          >
            DÍAS
          </text>
        </g>
      </g>
      {/* Molinillo de mano: recién molido */}
      <g opacity={molinillo} transform={`translate(540 ${880 + (1 - s) * 60})`}>
        <ellipse cx={0} cy={250} rx={170} ry={24} fill="rgba(0,0,0,0.4)" />
        <path d="M-120,40 L120,40 L130,236 L-130,236 Z" fill="#7A4A2C" />
        <path d="M-120,40 L120,40 L120,70 L-120,70 Z" fill="#5C3620" />
        <rect
          x={-100}
          y={-140}
          width={200}
          height={180}
          rx={20}
          fill={c.metal}
        />
        <rect
          x={-80}
          y={-130}
          width={30}
          height={160}
          rx={12}
          fill="rgba(255,255,255,0.55)"
        />
        <ellipse cx={0} cy={-140} rx={100} ry={22} fill="#E3E6EA" />
        <rect x={-10} y={-200} width={20} height={64} fill="#8E949C" />
        <g transform={`translate(0 -196) rotate(${manivela})`}>
          <rect x={-8} y={-8} width={170} height={16} rx={8} fill="#5E646C" />
          <circle cx={160} cy={0} r={26} fill={c.cafe} />
        </g>
        {/* Molienda que cae */}
        {new Array(16).fill(0).map((_, i) => {
          const t = ((f - 300 + i * 3) % 24) / 24;
          return (
            <circle
              key={i}
              cx={-40 + random(`m${i}`) * 80}
              cy={80 + t * 130}
              r={5}
              fill={c.espresso}
              opacity={f > 300 ? iv(t, [0, 0.1, 0.9, 1], [0, 1, 1, 0]) : 0}
            />
          );
        })}
        <Aroma x={0} y={-230} fuerza={iv(f, [305, 330], [0, 1])} />
      </g>
      <Sello bien={false} desde={262} hasta={292} x={760} y={1080} />
      <Sello bien desde={330} hasta={380} x={780} y={1060} />
    </svg>
  );
};

// ---- Error 3: medir a ojo ----
const Error3: React.FC = () => {
  const f = useCurrentFrame();
  if (f < B.e3[0] || f >= B.e3[1]) return null;
  const o = iv(f, [380, 390], [0, 1]) * iv(f, [532, 540], [1, 0]);
  const cuchara = iv(f, [445, 460], [1, 0]);
  const balanza = iv(f, [456, 470], [0, 1]);
  const gramos = Math.round(
    iv(f, [468, 500], [0, 18], Easing.out(Easing.cubic)),
  );
  const ml = Math.round(iv(f, [500, 525], [0, 288], Easing.out(Easing.cubic)));
  const vaiven = Math.sin(f / 4) * 18;
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute" }}
      opacity={o}
    >
      {/* Cucharas a ojo: una llena, otra a medias, otra rebasada */}
      <g opacity={cuchara}>
        {[0, 1, 2].map((i) => {
          const llenado = [0.4, 1, 1.6][i];
          return (
            <g
              key={i}
              transform={`translate(${250 + i * 290} 860) rotate(${vaiven * (i % 2 ? -1 : 1) - 20})`}
            >
              <rect
                x={-12}
                y={-260}
                width={24}
                height={220}
                rx={12}
                fill={c.metal}
              />
              <ellipse cx={0} cy={0} rx={72} ry={52} fill={c.metal} />
              <ellipse
                cx={0}
                cy={6 - 10 * llenado}
                rx={58}
                ry={30 * llenado}
                fill={c.cafe}
              />
              <text
                x={0}
                y={150}
                textAnchor="middle"
                fontFamily={titular}
                fontSize={90}
                fill={c.caramelo}
              >
                ?
              </text>
            </g>
          );
        })}
      </g>
      {/* Balanza con display */}
      <g opacity={balanza} transform="translate(540 990)">
        <ellipse cx={0} cy={150} rx={300} ry={34} fill="rgba(0,0,0,0.45)" />
        <rect x={-280} y={40} width={560} height={110} rx={30} fill="#2B2B2E" />
        <rect x={-260} y={0} width={520} height={56} rx={18} fill="#3A3A3E" />
        <rect x={-130} y={66} width={260} height={66} rx={10} fill="#1A2A1E" />
        <text
          x={110}
          y={122}
          textAnchor="end"
          fontFamily={titular}
          fontSize={58}
          fill="#9BF0A2"
        >
          {f < 500 ? `${gramos} g` : `${ml} ml`}
        </text>
        {/* Taza sobre la balanza */}
        <path
          d="M-120,-200 L120,-200 C116,-60 80,0 0,2 C-80,0 -116,-60 -120,-200 Z"
          fill="#F7F0E6"
        />
        <ellipse cx={0} cy={-200} rx={120} ry={24} fill="#E8DCCB" />
        <ellipse
          cx={0}
          cy={-198}
          rx={106}
          ry={18}
          fill={c.cafe}
          opacity={f >= 500 ? 1 : 0}
        />
      </g>
      {/* La proporción */}
      <g opacity={iv(f, [505, 515], [0, 1])}>
        <text
          x={540}
          y={720}
          textAnchor="middle"
          fontFamily={titular}
          fontSize={150}
          fill={c.caramelo}
        >
          1 : 16
        </text>
      </g>
      <Sello bien={false} desde={420} hasta={452} x={540} y={620} />
      <Sello bien desde={512} hasta={540} x={860} y={860} />
    </svg>
  );
};

// ---- Cierre: vuelve a la taza del principio (loop) ----
const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSp(B.cierre[0] + 4, 12);
  if (f < B.cierre[0]) return null;
  return (
    <AbsoluteFill style={{ opacity: iv(f, [540, 550], [0, 1]) }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <Taza k={0.85 + 0.15 * s} />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily: texto,
          fontWeight: 800,
          fontSize: 50,
          color: c.crema,
          opacity: Math.min(1, s),
        }}
      >
        Guardalo para tu
        <div
          style={{
            fontFamily: titular,
            fontSize: 140,
            lineHeight: 1,
            color: c.caramelo,
          }}
        >
          PRÓXIMO CAFÉ
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CafeTikTok: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: c.fondo }}>
    <Fondo />
    <Gancho />
    <Error1 />
    <Error2 />
    <Error3 />
    <Cierre />
    <TituloError
      n={1}
      titulo="Agua hirviendo"
      desde={B.e1[0]}
      hasta={B.e1[1]}
    />
    <TituloError n={2} titulo="Café viejo" desde={B.e2[0]} hasta={B.e2[1]} />
    <TituloError n={3} titulo="Medir a ojo" desde={B.e3[0]} hasta={B.e3[1]} />
    <Progreso />
    <Subtitulos />
  </AbsoluteFill>
);

import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "./brand";
import { Arabescos, Linea, Sombra, TrazoFiltro } from "./Trazo";

// "Cómo cebar un buen mate": video explicativo animado (9:16, 19 s), al estilo
// de los reels educativos con ilustración plana y subtítulo palabra por
// palabra. El mate del dibujo es genérico (no es un producto de la marca);
// cierra con el logo original. Sólo letras de la marca.

export const CEBAR_FRAMES = 570;

const yerba = "#8C9A56";
const yerbaOscura = "#5E7038";
export const agua = "#9CC3E0";
const alpaca = "#4E5A72";

export type Palabra = { readonly t: string; readonly k?: boolean };
export type Paso = {
  readonly desde: number;
  readonly hasta: number;
  readonly num?: number;
  readonly frase: Palabra[];
};

export const p = (s: string): Palabra[] =>
  s
    .split(" ")
    .map((t) => (t.startsWith("*") ? { t: t.slice(1), k: true } : { t }));

// Las palabras con * van en cursiva: son las que hay que recordar.
const pasos: Paso[] = [
  { desde: 0, hasta: 60, frase: p("¿Lo estás *cebando *bien?") },
  { desde: 60, hasta: 150, num: 1, frase: p("Llená *dos *tercios con yerba.") },
  {
    desde: 150,
    hasta: 230,
    num: 2,
    frase: p("Inclinalo y formá una *montañita."),
  },
  {
    desde: 230,
    hasta: 310,
    num: 3,
    frase: p("Un chorrito de agua *tibia en el hueco."),
  },
  {
    desde: 310,
    hasta: 390,
    num: 4,
    frase: p("Clavá la bombilla del *lado *mojado."),
  },
  {
    desde: 390,
    hasta: 490,
    num: 5,
    frase: p("Cebá a *75°, nunca con agua *hervida."),
  },
  {
    desde: 490,
    hasta: CEBAR_FRAMES,
    frase: p("Guardalo para la *próxima *ronda."),
  },
];

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

// Ubicación del mate en pantalla: su dibujo mide 600x700 y gira desde la base.
const M = { x: 240, y: 430, k: 1, px: 300, py: 620 };
const enPantalla = (x: number, y: number, ang: number) => {
  const r = (ang * Math.PI) / 180;
  const dx = x - M.px;
  const dy = y - M.py;
  return [
    M.x + M.k * (M.px + dx * Math.cos(r) - dy * Math.sin(r)),
    M.y + M.k * (M.py + dx * Math.sin(r) + dy * Math.cos(r)),
  ];
};

const cuerpo =
  "M150,130 C120,220 80,300 80,400 C80,540 180,620 300,620 C420,620 520,540 520,400 C520,300 480,220 450,130 Z";
const interior =
  "M175,150 C150,230 115,305 115,400 C115,520 200,585 300,585 C400,585 485,520 485,400 C485,305 450,230 425,150 Z";

export const Fondo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, #1E3456 0%, ${colors.azul} 55%, #0C1626 100%)`,
      }}
    >
      <svg width={1080} height={1920}>
        {new Array(55).fill(0).map((_, i) => {
          const x = random(`x${i}`) * 1080;
          const y0 = random(`y${i}`) * 1920;
          const y =
            (((y0 - f * (0.3 + random(`v${i}`) * 0.5)) % 1920) + 1920) % 1920;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={1.5 + random(`r${i}`) * 2.5}
              fill={colors.crema}
              opacity={0.12 + random(`o${i}`) * 0.35}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Escena: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entra = iv(f, [0, 28], [0, 1]);
  const sale = iv(f, [490, 515], [1, 0]);
  const ang = iv(f, [155, 190], [0, -26]) + iv(f, [395, 425], [0, 26]);
  const nivel = iv(f, [65, 140], [620, 295], Easing.out(Easing.quad));
  const pendiente = iv(f, [160, 200], [0, 1]);
  const yL = nivel - 75 * pendiente;
  const yR = nivel + 85 * pendiente;
  const mojado = iv(f, [245, 300], [0, 1]);
  const bombilla = iv(f, [318, 360], [-420, 0], Easing.out(Easing.back(1.2)));
  const pava = iv(f, [395, 420], [0, 1], Easing.out(Easing.cubic));
  const chorro = iv(f, [420, 435], [0, 1]) * iv(f, [470, 480], [1, 0]);
  const termo = spring({ frame: f - 425, fps, config: { damping: 11 } });

  const [bx, by] = enPantalla(300, 620, 0);
  const [hx, hy] = enPantalla(395, yR + 6, ang);
  const [ox, oy] = enPantalla(330, 130, ang);

  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, opacity: sale }}
    >
      <defs>
        <TrazoFiltro id="trazo-cebar" />
        <clipPath id="interior">
          <path d={interior} />
        </clipPath>
      </defs>

      {/* Sombra en el piso */}
      <ellipse
        cx={bx}
        cy={by + 8}
        rx={230 * entra}
        ry={22 * entra}
        fill="rgba(0,0,0,0.35)"
      />

      {/* Yerba que cae (paso 1) */}
      {new Array(36).fill(0).map((_, i) => {
        const t0 = 62 + i * 2;
        const y = iv(
          f,
          [t0, t0 + 18],
          [400, nivel * M.k + M.y - 10],
          Easing.in(Easing.quad),
        );
        const vis = f >= t0 && f < t0 + 18 ? 1 : 0;
        return (
          <rect
            key={i}
            x={540 + (random(`c${i}`) - 0.5) * 170}
            y={y}
            width={7}
            height={5}
            rx={1.5}
            transform={`rotate(${random(`g${i}`) * 90} ${540} ${y})`}
            fill={i % 3 ? yerba : yerbaOscura}
            opacity={vis}
          />
        );
      })}

      <g
        transform={`translate(${M.x} ${M.y}) scale(${M.k}) rotate(${ang} ${M.px} ${M.py})`}
        filter="url(#trazo-cebar)"
      >
        <Linea d={cuerpo} t={entra} w={6} fill={colors.madera} />
        <Sombra d="M112,260 C92,330 92,420 116,490" t={entra} paso={16} />
        <Linea d={interior} t={entra} w={4} fill="#3A2214" />
        <g clipPath="url(#interior)">
          <path
            d={`M0,${yL} C200,${yL - 10} 380,${(yL + yR) / 2} 600,${yR} L600,700 L0,700 Z`}
            fill={yerba}
          />
          {new Array(40).fill(0).map((_, i) => (
            <circle
              key={i}
              cx={130 + random(`px${i}`) * 340}
              cy={nivel + 20 + random(`py${i}`) * 260}
              r={3 + random(`pr${i}`) * 3}
              fill={yerbaOscura}
              opacity={nivel < 580 ? 0.8 : 0}
            />
          ))}
          <ellipse
            cx={395}
            cy={yR + 30}
            rx={70}
            ry={45}
            fill={yerbaOscura}
            opacity={mojado}
          />
        </g>
        {/* Bombilla */}
        <g transform={`translate(0 ${bombilla})`} opacity={f > 318 ? 1 : 0}>
          <Linea d="M395,470 L395,40 C395,10 410,-5 440,-10" w={12} />
          <Linea
            d="M378,450 C378,438 412,438 412,450 L412,490 C412,502 378,502 378,490 Z"
            w={5}
            fill={alpaca}
          />
        </g>
        {/* Virola */}
        <Linea
          d="M140,112 L460,112 L452,152 L148,152 Z"
          t={entra}
          w={6}
          fill={alpaca}
        />
        <Linea d="M142,124 L458,124" t={entra} w={3} />
        <Arabescos x={170} y={136} n={10} t={entra} />
      </g>

      {/* Agua tibia en el hueco (paso 3) */}
      {new Array(6).fill(0).map((_, i) => {
        const t0 = 236 + i * 9;
        const y = iv(f, [t0, t0 + 16], [hy - 260, hy], Easing.in(Easing.quad));
        return (
          <path
            key={i}
            d={`M${hx},${y - 14} C${hx + 9},${y} ${hx + 9},${y + 8} ${hx},${y + 8} C${hx - 9},${y + 8} ${hx - 9},${y} ${hx},${y - 14} Z`}
            fill={agua}
            opacity={f >= t0 && f < t0 + 16 ? 1 : 0}
            transform={`scale(1.6) translate(${-hx * 0.375} ${-y * 0.375})`}
          />
        );
      })}

      {/* Pava y chorro (paso 5) */}
      <path
        d={`M${ox + 134},${oy - 44} Q${ox + 50},${oy - 50} ${ox},${oy + 10}`}
        stroke={agua}
        strokeWidth={10}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={400}
        strokeDashoffset={400 * (1 - chorro)}
        opacity={chorro > 0 ? 0.9 : 0}
      />
      <g
        transform={`translate(${ox + 270 + 300 * (1 - pava)} ${oy - 150}) rotate(${-28 * pava})`}
        opacity={pava * sale}
      >
        <path
          d="M-90,-60 L90,-60 C110,40 100,90 0,90 C-100,90 -110,40 -90,-60 Z"
          fill="#B9BDC4"
        />
        <path d="M-95,-30 L-170,30 L-160,40 L-88,0 Z" fill="#B9BDC4" />
        <path
          d="M-60,-60 C-60,-130 60,-130 60,-60"
          stroke="#2A2A2A"
          strokeWidth={14}
          fill="none"
        />
        <rect x={-30} y={-78} width={60} height={20} rx={8} fill="#2A2A2A" />
      </g>
      <g
        transform={`translate(${ox + 230} ${oy + 150}) scale(${Math.max(0, termo)})`}
        opacity={sale}
      >
        <circle r={78} fill={colors.crema} />
        <text
          textAnchor="middle"
          y={22}
          fontFamily={fonts.serif}
          fontWeight={800}
          fontSize={62}
          fill={colors.azul}
          style={{ fontVariantNumeric: "lining-nums" }}
        >
          75°
        </text>
      </g>
    </svg>
  );
};

// Subtítulo palabra por palabra; la última frase (el cierre) queda fija más
// arriba, bajo el logo.
export const Subtitulo: React.FC<{
  readonly pasos: Paso[];
  readonly total: number;
}> = ({ pasos, total }) => {
  const f = useCurrentFrame();
  const paso = pasos.find((s) => f >= s.desde && f < s.hasta);
  if (!paso) return null;
  const local = f - paso.desde;
  const fuera =
    paso.hasta === total
      ? 1
      : iv(
          local,
          [paso.hasta - paso.desde - 6, paso.hasta - paso.desde],
          [1, 0],
        );
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        right: 120,
        top: paso.hasta === total ? 1010 : 1110,
        textAlign: "center",
        opacity: fuera,
      }}
    >
      {paso.num ? (
        <div
          style={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 8,
            color: colors.crema,
            opacity: 0.65 * iv(local, [0, 8], [0, 1]),
            marginBottom: 14,
          }}
        >
          PASO {paso.num}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: fonts.serif,
          fontSize: 72,
          lineHeight: 1.18,
          color: colors.crema,
          fontVariantNumeric: "lining-nums",
          textShadow: "0 3px 18px rgba(0,0,0,0.45)",
        }}
      >
        {paso.frase.map((w, i) => {
          const t = local - 3 - i * 4;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: "0.25em",
                fontWeight: w.k ? 600 : 700,
                fontStyle: w.k ? "italic" : "normal",
                opacity: iv(t, [0, 5], [0, 1]),
                transform: `translateY(${iv(t, [0, 6], [18, 0], Easing.out(Easing.cubic))}px)`,
              }}
            >
              {w.t}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const Encabezado: React.FC<{
  readonly titulo: string;
  readonly hasta: number;
  readonly desde?: number;
}> = ({ titulo, hasta, desde = 0 }) => {
  const f = useCurrentFrame();
  const o =
    iv(f, [hasta - 15, hasta], [1, 0]) *
    (desde ? iv(f, [desde, desde + 12], [0, 1]) : 1);
  return (
    <div
      style={{
        position: "absolute",
        top: 320,
        left: 0,
        right: 0,
        textAlign: "center",
        color: colors.crema,
        opacity: o,
      }}
    >
      <div
        style={{
          fontFamily: fonts.serif,
          fontWeight: 700,
          fontSize: 76,
          lineHeight: 1.1,
        }}
      >
        {titulo}
      </div>
    </div>
  );
};

export const Cierre: React.FC<{ readonly desde: number }> = ({ desde }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - desde, fps, config: { damping: 13 } });
  return (
    <Img
      src={staticFile("logo-herencia-patria.png")}
      style={{
        position: "absolute",
        width: 300,
        height: 300,
        left: 390,
        top: 640,
        opacity: Math.min(1, Math.max(0, s)),
        transform: `scale(${0.8 + 0.2 * s})`,
      }}
    />
  );
};

export const Cebar: React.FC = () => (
  <AbsoluteFill>
    <Fondo />
    {/* El título se va antes de la pava, que ocupa la parte de arriba. */}
    <Encabezado titulo="Cómo cebar un buen mate" hasta={400} />
    <Escena />
    <Cierre desde={505} />
    <Subtitulo pasos={pasos} total={CEBAR_FRAMES} />
  </AbsoluteFill>
);

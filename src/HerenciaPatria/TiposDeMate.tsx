import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "./brand";
import {
  Cierre,
  Encabezado,
  Fondo,
  iv,
  p,
  type Paso,
  Subtitulo,
} from "./Cebar";

// "Tipos de mate": tercer video explicativo animado (9:16, 24 s), mismo
// estilo que los anteriores. Primero las formas (torpedo, imperial,
// camionero) y después los materiales, de a pares. Dibujos genéricos: no son
// productos de la marca.

export const TIPOS_FRAMES = 720;

const pasos: Paso[] = [
  { desde: 0, hasta: 60, frase: p("No todos los mates son *iguales.") },
  {
    desde: 60,
    hasta: 150,
    frase: p("El *torpedo: angosto abajo y ancho en la boca."),
  },
  {
    desde: 150,
    hasta: 240,
    frase: p("El *imperial: virola ancha y *base de alpaca."),
  },
  {
    desde: 240,
    hasta: 330,
    frase: p("El *camionero: grande y de *boca *ancha."),
  },
  {
    desde: 330,
    hasta: 430,
    frase: p("*Calabaza y *algarrobo: suman sabor, pero hay que *curarlos."),
  },
  {
    desde: 430,
    hasta: 530,
    frase: p("*Acero y *cerámica: no se curan y se lavan fácil."),
  },
  {
    desde: 530,
    hasta: 630,
    frase: p("*Vidrio para ver la yerba; *plástico para llevar."),
  },
  {
    desde: 630,
    hasta: TIPOS_FRAMES,
    frase: p("Guardalo para la *próxima *ronda."),
  },
];

const cuero = colors.madera;
const alpaca = "#D8D6D0";

// ---- Formas (cada dibujo en una caja de 260x440) ----

const Torpedo: React.FC = () => (
  <>
    <path
      d="M35,70 L225,70 C220,210 168,360 148,412 L112,412 C92,360 40,210 35,70 Z"
      fill={cuero}
    />
    <rect x={25} y={44} width={210} height={32} rx={6} fill={alpaca} />
    <ellipse cx={130} cy={414} rx={30} ry={10} fill={alpaca} />
  </>
);

const Imperial: React.FC = () => (
  <>
    <path
      d="M70,95 C60,140 20,170 20,250 C20,330 70,370 130,370 C190,370 240,330 240,250 C240,170 200,140 190,95 Z"
      fill={cuero}
    />
    <path d="M60,40 L200,40 L192,100 L68,100 Z" fill={alpaca} />
    {[0, 1, 2, 3].map((i) => (
      <path
        key={i}
        d={`M${82 + i * 30},86 q12,-30 24,0`}
        stroke="#A9A7A0"
        strokeWidth={4}
        fill="none"
      />
    ))}
    <path d="M85,362 L175,362 L200,420 L60,420 Z" fill={alpaca} />
  </>
);

const Camionero: React.FC = () => (
  <>
    <path
      d="M22,110 L238,110 C258,190 262,300 240,370 C225,418 35,418 20,370 C-2,300 2,190 22,110 Z"
      fill={cuero}
    />
    <rect x={14} y={96} width={232} height={18} rx={5} fill={alpaca} />
  </>
);

const formas: [string, React.FC, number][] = [
  ["TORPEDO", Torpedo, 60],
  ["IMPERIAL", Imperial, 150],
  ["CAMIONERO", Camionero, 240],
];

const Formas: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sale = iv(f, [318, 332], [1, 0]);
  if (sale <= 0) return null;
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, opacity: sale }}
    >
      {formas.map(([nombre, Dibujo, desde], i) => {
        const entra = spring({
          frame: f - i * 5,
          fps,
          config: { damping: 14 },
        });
        const activo = f >= desde && f < desde + 90;
        const foco = f < 60 ? 1 : activo ? 1 : 0.3;
        const k = 1 + (activo ? 0.1 : 0);
        const cx = 210 + i * 280;
        return (
          <g
            key={nombre}
            opacity={Math.max(0, entra) * foco}
            transform={`translate(${cx} 1000) scale(${k * Math.max(0, entra)}) translate(-130 -440)`}
          >
            <ellipse
              cx={130}
              cy={436}
              rx={110}
              ry={14}
              fill="rgba(0,0,0,0.35)"
            />
            <Dibujo />
            <text
              x={130}
              y={500}
              textAnchor="middle"
              fontFamily={fonts.sans}
              fontWeight={700}
              fontSize={30}
              letterSpacing={5}
              fill={colors.crema}
            >
              {nombre}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ---- Materiales (de a pares) ----

const calabaza =
  "M80,40 C70,100 20,140 20,230 C20,330 80,380 130,380 C180,380 240,330 240,230 C240,140 190,100 180,40 Z";
const vaso =
  "M45,40 L215,40 L205,370 C204,385 195,390 180,390 L80,390 C65,390 56,385 55,370 Z";

type Material = {
  readonly nombre: string;
  readonly forma: string;
  readonly fill: string;
  readonly opacidad?: number;
  readonly vetas?: string;
  readonly yerba?: boolean;
  readonly franja?: string;
};

const materiales: Material[] = [
  { nombre: "Calabaza", forma: calabaza, fill: "#BC8F57", vetas: "#9E7340" },
  { nombre: "Algarrobo", forma: calabaza, fill: "#7A4528", vetas: "#5C321C" },
  { nombre: "Acero", forma: vaso, fill: "#C3C8CF" },
  {
    nombre: "Cerámica",
    forma: calabaza,
    fill: colors.crema,
    franja: colors.verde,
  },
  {
    nombre: "Vidrio",
    forma: vaso,
    fill: "#BFE0F0",
    opacidad: 0.35,
    yerba: true,
  },
  { nombre: "Plástico", forma: vaso, fill: "#4E8A74" },
];

const Mate: React.FC<{ readonly m: Material; readonly id: string }> = ({
  m,
  id,
}) => (
  <>
    <defs>
      <clipPath id={id}>
        <path d={m.forma} />
      </clipPath>
    </defs>
    <ellipse cx={130} cy={392} rx={110} ry={14} fill="rgba(0,0,0,0.35)" />
    {m.yerba ? (
      <rect
        x={0}
        y={150}
        width={260}
        height={260}
        fill="#8C9A56"
        clipPath={`url(#${id})`}
      />
    ) : null}
    <path d={m.forma} fill={m.fill} opacity={m.opacidad ?? 1} />
    <g clipPath={`url(#${id})`}>
      {m.vetas
        ? [0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M${40 + i * 45},40 C${20 + i * 45},180 ${60 + i * 45},280 ${40 + i * 45},400`}
              stroke={m.vetas}
              strokeWidth={5}
              fill="none"
              opacity={0.7}
            />
          ))
        : null}
      {m.franja ? (
        <rect x={0} y={200} width={260} height={46} fill={m.franja} />
      ) : null}
      {/* Brillo */}
      <path
        d="M58,120 C45,180 45,260 62,320"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={16}
        strokeLinecap="round"
        fill="none"
      />
    </g>
    {m.forma === calabaza ? (
      <ellipse cx={130} cy={42} rx={50} ry={9} fill="rgba(0,0,0,0.45)" />
    ) : null}
    {m.forma === vaso ? (
      <path
        d={m.forma}
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth={4}
      />
    ) : null}
  </>
);

const Materiales: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {[0, 1, 2].map((par) => {
        const desde = 330 + par * 100;
        if (f < desde || f >= desde + 100) return null;
        const sale = iv(f, [desde + 90, desde + 100], [1, 0]);
        return [0, 1].map((lado) => {
          const m = materiales[par * 2 + lado];
          const s = spring({
            frame: f - desde - lado * 6,
            fps,
            config: { damping: 13 },
          });
          const cx = lado ? 720 : 340;
          return (
            <g
              key={m.nombre}
              opacity={Math.min(1, Math.max(0, s)) * sale}
              transform={`translate(${cx} ${1000 + (1 - s) * 80}) scale(1.15) translate(-130 -420)`}
            >
              <Mate m={m} id={`mat-${par}-${lado}`} />
              <text
                x={130}
                y={470}
                textAnchor="middle"
                fontFamily={fonts.sans}
                fontWeight={700}
                fontSize={30}
                letterSpacing={5}
                fill={colors.crema}
              >
                {m.nombre.toUpperCase()}
              </text>
            </g>
          );
        });
      })}
    </svg>
  );
};

export const TiposDeMate: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fondo />
      {f < 335 ? (
        <Encabezado titulo="Tipos de mate" hasta={332} />
      ) : (
        <Encabezado titulo="¿De qué material?" desde={335} hasta={632} />
      )}
      <Formas />
      <Materiales />
      <Cierre desde={640} />
      <Subtitulo pasos={pasos} total={TIPOS_FRAMES} />
    </AbsoluteFill>
  );
};

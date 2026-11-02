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

// "Tipos de mate": tercer video explicativo animado (9:16, 25 s), mismo
// estilo que los anteriores. Primero las formas (torpedo, imperial,
// camionero), dibujadas a partir de las fotos de referencia de la marca, con
// su base de patas de cuero; después los materiales, de a pares. La calabaza
// y el algarrobo arrancan mostrando de dónde salen.

export const TIPOS_FRAMES = 750;

const pasos: Paso[] = [
  { desde: 0, hasta: 60, frase: p("No todos los mates son *iguales.") },
  {
    desde: 60,
    hasta: 150,
    frase: p("El *torpedo: ovalado, con la boca más *cerrada."),
  },
  {
    desde: 150,
    hasta: 240,
    frase: p("El *imperial: virola *ancha y cincelada."),
  },
  {
    desde: 240,
    hasta: 330,
    frase: p("El *camionero: el de boca más *ancha."),
  },
  {
    desde: 330,
    hasta: 460,
    frase: p("*Calabaza y *algarrobo: suman sabor, pero hay que *curarlos."),
  },
  {
    desde: 460,
    hasta: 560,
    frase: p("*Acero y *cerámica: no se curan y se lavan fácil."),
  },
  {
    desde: 560,
    hasta: 660,
    frase: p("*Vidrio para ver la yerba; *plástico para llevar."),
  },
  {
    desde: 660,
    hasta: TIPOS_FRAMES,
    frase: p("Guardalo para la *próxima *ronda."),
  },
];

export const negro = "#211D1B";
export const negroBorde = "#36312E";
const suela = "#B5652A";
const suelaBorde = "#8A4A1D";
export const alpaca = "#D8D6D0";
const cincel = "#9C9A94";

// ---- Formas (cada dibujo en una caja de 260x440) ----

// Base de patas de cuero cosidas, común a los tres: dos aletas a los
// costados que abrazan el cuerpo, una al frente y la suela de apoyo.
export const Patas: React.FC<{ readonly c: string; readonly b: string }> = ({
  c,
  b,
}) => (
  <>
    <path
      d="M40,270 C34,330 26,390 14,426 L96,426 C80,392 72,340 74,300 Z"
      fill={b}
    />
    <path
      d="M220,270 C226,330 234,390 246,426 L164,426 C180,392 188,340 186,300 Z"
      fill={b}
    />
    <rect x={10} y={420} width={240} height={14} rx={4} fill={b} />
    <rect x={120} y={322} width={20} height={112} rx={10} fill={c} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <g key={i}>
        <circle
          cx={72 - i * 2}
          cy={312 + i * 19}
          r={2.6}
          fill="rgba(255,255,255,0.4)"
        />
        <circle
          cx={188 + i * 2}
          cy={312 + i * 19}
          r={2.6}
          fill="rgba(255,255,255,0.4)"
        />
      </g>
    ))}
  </>
);

export const Cincelado: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly n: number;
}> = ({ x, y, n }) => (
  <>
    {new Array(n).fill(0).map((_, i) => (
      <path
        key={i}
        d={`M${x + i * 26},${y} q8,-14 16,0 q-8,10 -16,0`}
        stroke={cincel}
        strokeWidth={3}
        fill="none"
      />
    ))}
  </>
);

export const Brillo: React.FC<{ readonly d: string }> = ({ d }) => (
  <path
    d={d}
    stroke="rgba(255,255,255,0.13)"
    strokeWidth={18}
    strokeLinecap="round"
    fill="none"
  />
);

export const torpedoCuerpo =
  "M40,138 C10,175 10,260 30,310 C50,360 90,395 130,395 C170,395 210,360 230,310 C250,260 250,175 220,138 Z";
export const torpedoVirola =
  "M60,92 L200,92 C216,104 222,124 214,142 L46,142 C38,124 44,104 60,92 Z";

// Ovalado, virola redondeada y boca más cerrada.
const Torpedo: React.FC = () => (
  <>
    <path d={torpedoCuerpo} fill={negro} />
    <Patas c={negro} b={negroBorde} />
    <Brillo d="M52,180 C40,220 42,262 56,296" />
    <path d={torpedoVirola} fill={alpaca} />
    <Cincelado x={62} y={122} n={6} />
  </>
);

// Virola recta, ancha y cincelada.
const Imperial: React.FC = () => (
  <>
    <path
      d="M42,140 C20,190 18,260 34,310 C54,365 92,395 130,395 C168,395 206,365 226,310 C242,260 240,190 218,140 Z"
      fill={negro}
    />
    <Patas c={negro} b={negroBorde} />
    <Brillo d="M50,186 C40,224 42,262 56,296" />
    <rect x={38} y={74} width={184} height={70} rx={4} fill={alpaca} />
    <rect x={38} y={74} width={184} height={8} fill="#EEECE6" />
    <Cincelado x={58} y={114} n={6} />
  </>
);

// La boca más ancha, de suela.
const Camionero: React.FC = () => (
  <>
    <path
      d="M12,128 C2,190 10,270 40,320 C66,365 100,392 130,392 C160,392 194,365 220,320 C250,270 258,190 248,128 Z"
      fill={suela}
    />
    <Patas c={suela} b={suelaBorde} />
    <Brillo d="M34,170 C30,214 38,256 56,290" />
    <rect x={8} y={108} width={244} height={24} rx={4} fill={alpaca} />
    <ellipse cx={130} cy={108} rx={122} ry={20} fill={alpaca} />
    <ellipse cx={130} cy={109} rx={104} ry={13} fill="#5E5C58" />
    <Cincelado x={50} y={110} n={7} />
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

// De dónde salen: la planta de calabaza (los porongos colgando) y el
// algarrobo. Misma caja de 260x440 que los mates.
const Planta: React.FC = () => (
  <>
    <path
      d="M0,40 C80,20 180,30 260,60"
      stroke="#6B5A3A"
      strokeWidth={8}
      fill="none"
    />
    {[
      [20, 70, -20],
      [200, 90, 25],
      [120, 40, 10],
    ].map(([x, y, a], i) => (
      <ellipse
        key={i}
        cx={x}
        cy={y}
        rx={28}
        ry={12}
        fill="#7A6A3E"
        transform={`rotate(${a} ${x} ${y})`}
      />
    ))}
    {[
      [80, 1],
      [185, 0.8],
    ].map(([x, k], i) => (
      <g key={i} transform={`translate(${x} 34) scale(${k}) translate(-60 0)`}>
        <path d="M60,0 L60,30" stroke="#6B5A3A" strokeWidth={5} />
        <path
          d="M48,30 C46,80 52,110 38,140 C-5,175 -15,280 30,315 C50,330 70,330 90,315 C135,280 125,175 82,140 C68,110 74,80 72,30 Z"
          fill="#D8CB9A"
        />
        <path
          d="M20,190 C8,230 14,270 34,296"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={10}
          strokeLinecap="round"
          fill="none"
        />
      </g>
    ))}
  </>
);

const Arbol: React.FC = () => (
  <>
    <path
      d="M112,422 C120,380 104,340 116,300 C100,280 70,250 50,215 L62,208 C84,236 110,262 124,276 C130,250 128,220 120,190 L134,188 C142,220 144,250 140,280 C160,252 186,232 214,214 L222,226 C196,244 168,270 152,300 C158,340 146,380 156,422 Z"
      fill="#5C3A22"
    />
    {[
      [130, 140, 125, 62],
      [42, 190, 62, 42],
      [218, 186, 62, 42],
      [86, 108, 72, 46],
      [180, 100, 76, 46],
      [130, 198, 96, 38],
    ].map(([x, y, rx, ry], i) => (
      <ellipse
        key={i}
        cx={x}
        cy={y}
        rx={rx}
        ry={ry}
        fill={i % 2 ? "#6E8040" : "#7F914A"}
        opacity={0.95}
      />
    ))}
    <rect x={-10} y={418} width={280} height={12} rx={6} fill="#B9A66A" />
  </>
);

const pares = [
  { desde: 330, hasta: 460 },
  { desde: 460, hasta: 560 },
  { desde: 560, hasta: 660 },
];
const MATE_EN = 60; // en el primer par, cuándo pasa del origen al mate

const Materiales: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {pares.map(({ desde, hasta }, par) => {
        if (f < desde || f >= hasta) return null;
        const sale = iv(f, [hasta - 10, hasta], [1, 0]);
        const conOrigen = par === 0;
        const t0 = conOrigen ? desde + MATE_EN : desde;
        return [0, 1].map((lado) => {
          const m = materiales[par * 2 + lado];
          const cx = lado ? 720 : 340;
          const sOrigen = spring({
            frame: f - desde - lado * 6,
            fps,
            config: { damping: 13 },
          });
          const fueraOrigen = iv(f, [t0 - 14, t0], [1, 0]);
          const s = spring({
            frame: f - t0 - lado * 6,
            fps,
            config: { damping: 13 },
          });
          return (
            <g key={m.nombre} opacity={sale}>
              {conOrigen && f < t0 ? (
                <g
                  opacity={Math.min(1, Math.max(0, sOrigen)) * fueraOrigen}
                  transform={`translate(${cx} ${1000 + (1 - sOrigen) * 80}) scale(1.15) translate(-130 -420)`}
                >
                  {lado ? <Arbol /> : <Planta />}
                </g>
              ) : null}
              <g
                opacity={f >= t0 ? Math.min(1, Math.max(0, s)) : 0}
                transform={`translate(${cx} ${1000 + (1 - s) * 80}) scale(1.15) translate(-130 -420)`}
              >
                <Mate m={m} id={`mat-${par}-${lado}`} />
              </g>
              <text
                x={cx}
                y={1063}
                textAnchor="middle"
                fontFamily={fonts.sans}
                fontWeight={700}
                fontSize={34}
                letterSpacing={5}
                fill={colors.crema}
                opacity={Math.min(1, Math.max(0, sOrigen))}
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
        <Encabezado titulo="¿De qué material?" desde={335} hasta={662} />
      )}
      <Formas />
      <Materiales />
      <Cierre desde={670} />
      <Subtitulo pasos={pasos} total={TIPOS_FRAMES} />
    </AbsoluteFill>
  );
};

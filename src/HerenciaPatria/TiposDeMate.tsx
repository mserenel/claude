import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "./brand";
import {
  Camionero,
  DefsRealista,
  Imperial,
  SombraPiso,
  Torpedo,
} from "./Realista";
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
// camionero), dibujadas con volumen a partir de las fotos de referencia de
// la marca, con su base de patas de cuero; después los materiales, de a pares. La calabaza
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

// ---- Formas (cada dibujo en una caja de 260x440), con volumen ----

const formas: [string, React.FC<{ readonly id: string }>, number][] = [
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
      <DefsRealista />
      {formas.map(([nombre, Dibujo, desde], i) => {
        const entra = Math.max(
          0,
          spring({ frame: f - i * 5, fps, config: { damping: 14 } }),
        );
        const activo = f >= desde && f < desde + 90;
        const foco = f < 60 ? 1 : activo ? 1 : 0.35;
        const k = (1 + (activo ? 0.1 : 0)) * entra;
        const cx = 210 + i * 280;
        return (
          <g
            key={nombre}
            opacity={Math.min(1, entra) * foco}
            transform={`translate(${cx} 1000) scale(${k}) translate(-130 -440)`}
          >
            <Dibujo id={`forma-${i}`} />
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

// ---- Materiales (de a pares), también con volumen ----

const calabaza =
  "M80,40 C70,100 20,140 20,230 C20,330 80,380 130,380 C180,380 240,330 240,230 C240,140 190,100 180,40 Z";
const vaso =
  "M45,40 L215,40 L205,370 C204,385 195,390 180,390 L80,390 C65,390 56,385 55,370 Z";

type Material = {
  readonly nombre: string;
  readonly forma: string;
  readonly colores: [string, string, string];
  readonly metal?: boolean;
  readonly vetas?: string;
  readonly yerba?: boolean;
  readonly franja?: boolean;
  readonly vidrio?: boolean;
};

const materiales: Material[] = [
  {
    nombre: "Calabaza",
    forma: calabaza,
    colores: ["#EBCB92", "#BC8F57", "#6E4A22"],
    vetas: "rgba(110,74,34,0.35)",
  },
  {
    nombre: "Algarrobo",
    forma: calabaza,
    colores: ["#A9663C", "#74401F", "#341808"],
    vetas: "rgba(40,18,6,0.45)",
  },
  {
    nombre: "Acero",
    forma: vaso,
    colores: ["#EEF1F4", "#A9B0B8", "#5E656D"],
    metal: true,
  },
  {
    nombre: "Cerámica",
    forma: calabaza,
    colores: ["#FFFCF4", "#EADFCB", "#A89B84"],
    franja: true,
  },
  {
    nombre: "Vidrio",
    forma: vaso,
    colores: ["#DFF1FA", "#BFE0F0", "#8BB5CA"],
    vidrio: true,
    yerba: true,
  },
  {
    nombre: "Plástico",
    forma: vaso,
    colores: ["#9AD3BC", "#4E8A74", "#244A3C"],
  },
];

const Mate: React.FC<{ readonly m: Material; readonly id: string }> = ({
  m,
  id,
}) => (
  <>
    <defs>
      {m.metal ? (
        <linearGradient id={`${id}-g`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={m.colores[2]} />
          <stop offset="0.22" stopColor={m.colores[0]} />
          <stop offset="0.45" stopColor={m.colores[1]} />
          <stop offset="0.7" stopColor={m.colores[0]} />
          <stop offset="1" stopColor={m.colores[2]} />
        </linearGradient>
      ) : (
        <radialGradient id={`${id}-g`} cx="0.32" cy="0.35" r="0.8">
          <stop offset="0" stopColor={m.colores[0]} />
          <stop offset="0.45" stopColor={m.colores[1]} />
          <stop offset="1" stopColor={m.colores[2]} />
        </radialGradient>
      )}
      <clipPath id={`${id}-clip`}>
        <path d={m.forma} />
      </clipPath>
    </defs>
    <SombraPiso cx={130} cy={392} rx={115} />
    {m.yerba ? (
      <g clipPath={`url(#${id}-clip)`}>
        <rect x={0} y={170} width={260} height={240} fill="#7F8F4A" />
        <rect
          x={0}
          y={170}
          width={260}
          height={240}
          fill="#fff"
          filter="url(#r-grano)"
          opacity={0.5}
        />
      </g>
    ) : null}
    <path d={m.forma} fill={`url(#${id}-g)`} opacity={m.vidrio ? 0.28 : 1} />
    <g clipPath={`url(#${id}-clip)`}>
      {m.vetas
        ? [0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M${40 + i * 45},40 C${25 + i * 45},170 ${55 + i * 45},280 ${40 + i * 45},400`}
              stroke={m.vetas}
              strokeWidth={4}
              fill="none"
              filter="url(#r-blur-s)"
            />
          ))
        : null}
      {m.vidrio ? null : (
        <rect
          x={0}
          y={0}
          width={260}
          height={400}
          fill="#fff"
          filter="url(#r-grano)"
          opacity={m.metal ? 0.12 : 0.3}
        />
      )}
      {m.franja ? (
        <>
          <rect x={0} y={200} width={260} height={46} fill={colors.verde} />
          <rect
            x={0}
            y={200}
            width={260}
            height={46}
            fill="url(#r-sombra-boca)"
            opacity={0.4}
          />
        </>
      ) : null}
      {/* Brillo */}
      <ellipse
        cx={m.forma === vaso ? 80 : 75}
        cy={170}
        rx={m.metal || m.vidrio ? 14 : 26}
        ry={95}
        fill="#fff"
        opacity={m.vidrio || m.franja ? 0.55 : 0.25}
        filter="url(#r-blur-s)"
      />
    </g>
    <path
      d={m.forma}
      fill="none"
      stroke={m.vidrio ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.4)"}
      strokeWidth={m.vidrio ? 3 : 2}
    />
    {m.forma === calabaza ? (
      <>
        <ellipse cx={130} cy={42} rx={50} ry={10} fill={m.colores[0]} />
        <ellipse cx={130} cy={43} rx={42} ry={7} fill="url(#r-hueco)" />
      </>
    ) : (
      <>
        <ellipse
          cx={130}
          cy={40}
          rx={85}
          ry={11}
          fill={m.vidrio ? "rgba(255,255,255,0.25)" : m.colores[0]}
          stroke={m.vidrio ? "rgba(255,255,255,0.75)" : "none"}
          strokeWidth={3}
        />
        {m.vidrio ? null : (
          <ellipse cx={130} cy={41} rx={76} ry={8} fill="url(#r-hueco)" />
        )}
      </>
    )}
  </>
);

// De dónde salen: la planta de calabaza (los porongos colgando) y el
// algarrobo. Misma caja de 260x440 que los mates.
const porongo =
  "M48,30 C46,80 52,110 38,140 C-5,175 -15,280 30,315 C50,330 70,330 90,315 C135,280 125,175 82,140 C68,110 74,80 72,30 Z";

const Planta: React.FC<{ readonly id: string }> = ({ id }) => (
  <>
    <defs>
      <radialGradient id={`${id}-p`} cx="0.35" cy="0.6" r="0.75">
        <stop offset="0" stopColor="#F3E9C2" />
        <stop offset="0.5" stopColor="#CFC08A" />
        <stop offset="1" stopColor="#7F7444" />
      </radialGradient>
      <radialGradient id={`${id}-h`} cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#9C8B55" />
        <stop offset="1" stopColor="#4F4423" />
      </radialGradient>
    </defs>
    <path
      d="M0,40 C80,20 180,30 260,60"
      stroke="#5C4A2E"
      strokeWidth={8}
      strokeLinecap="round"
      fill="none"
    />
    {[
      [20, 70, -20],
      [200, 90, 25],
      [130, 30, 10],
    ].map(([x, y, a], i) => (
      <ellipse
        key={i}
        cx={x}
        cy={y}
        rx={30}
        ry={13}
        fill={`url(#${id}-h)`}
        transform={`rotate(${a} ${x} ${y})`}
      />
    ))}
    {[
      [80, 1],
      [185, 0.8],
    ].map(([x, k], i) => (
      <g key={i} transform={`translate(${x} 34) scale(${k}) translate(-60 0)`}>
        <path d="M60,0 L60,30" stroke="#5C4A2E" strokeWidth={5} />
        <path d={porongo} fill={`url(#${id}-p)`} />
        <ellipse
          cx={30}
          cy={230}
          rx={14}
          ry={50}
          fill="#fff"
          opacity={0.3}
          filter="url(#r-blur-s)"
        />
      </g>
    ))}
  </>
);

const Arbol: React.FC<{ readonly id: string }> = ({ id }) => (
  <>
    <defs>
      <radialGradient id={`${id}-copa`} cx="0.4" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#A3B566" />
        <stop offset="0.55" stopColor="#6F8240" />
        <stop offset="1" stopColor="#3E4C22" />
      </radialGradient>
      <linearGradient id={`${id}-tronco`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#3A2414" />
        <stop offset="0.4" stopColor="#7A5233" />
        <stop offset="1" stopColor="#2E1C10" />
      </linearGradient>
    </defs>
    <ellipse cx={130} cy={428} rx={150} ry={10} fill="#B9A66A" opacity={0.8} />
    <path
      d="M112,424 C120,380 104,340 116,300 C100,280 70,250 50,215 L62,208 C84,236 110,262 124,276 C130,250 128,220 120,190 L134,188 C142,220 144,250 140,280 C160,252 186,232 214,214 L222,226 C196,244 168,270 152,300 C158,340 146,380 156,424 Z"
      fill={`url(#${id}-tronco)`}
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
        fill={`url(#${id}-copa)`}
      />
    ))}
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
      <DefsRealista />
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
                  {lado ? (
                    <Arbol id={`arbol-${lado}`} />
                  ) : (
                    <Planta id={`planta-${lado}`} />
                  )}
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

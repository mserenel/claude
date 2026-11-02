import {
  AbsoluteFill,
  Easing,
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

// "La temperatura del agua": segundo video explicativo animado (9:16, 20 s),
// mismo estilo que "Cómo cebar un buen mate". Un termómetro sube al hervor,
// baja a agua fría y se queda en la franja ideal (70-80°).

export const TEMPERATURA_FRAMES = 600;

const pasos: Paso[] = [
  { desde: 0, hasta: 75, frase: p("¿Con qué agua *cebás *tu *mate?") },
  {
    desde: 75,
    hasta: 180,
    frase: p("Si *hierve, quema la yerba y el mate sale *amargo."),
  },
  {
    desde: 180,
    hasta: 280,
    frase: p("Si está *fría, la yerba no larga su sabor."),
  },
  { desde: 280, hasta: 400, frase: p("Lo ideal: entre *70 *y *80 grados.") },
  {
    desde: 400,
    hasta: 510,
    frase: p("Apagá la pava cuando *empieza *a *cantar, antes del hervor."),
  },
  {
    desde: 510,
    hasta: TEMPERATURA_FRAMES,
    frase: p("Guardalo para la *próxima *ronda."),
  },
];

const mercurio = "#B5533C";
const X = 460; // centro del tubo
const yDe = (t: number) => iv(t, [40, 100], [950, 520], Easing.linear);

const Termometro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = spring({ frame: f, fps, config: { damping: 14 } });
  const sale = iv(f, [500, 520], [1, 0]);
  const t =
    45 +
    iv(f, [80, 130], [0, 55]) -
    iv(f, [185, 235], [0, 45]) +
    iv(f, [285, 330], [0, 20]) +
    iv(f, [405, 440], [0, 3]);
  const y = yDe(t);
  const ideal = iv(f, [300, 330], [0, 1]) * iv(f, [500, 515], [1, 0]);

  // Etiqueta que acompaña al mercurio en cada paso.
  const etiquetas: [number, number, string][] = [
    [95, 180, "100° · hervida"],
    [200, 280, "55° · fría"],
    [320, 400, "75° · ideal"],
  ];
  const etiqueta = etiquetas.find(([a, b]) => f >= a && f < b);

  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, opacity: sale }}
    >
      <g
        transform={`translate(${X} 1010) scale(${entra}) translate(${-X} -1010)`}
      >
        {/* Franja ideal 70-80° */}
        <rect
          x={X - 120}
          y={yDe(80)}
          width={240}
          height={yDe(70) - yDe(80)}
          rx={12}
          fill={colors.crema}
          opacity={0.22 * ideal}
        />
        {/* Tubo y bulbo */}
        <rect
          x={X - 40}
          y={470}
          width={80}
          height={560}
          rx={40}
          fill={colors.crema}
        />
        <circle cx={X} cy={1010} r={70} fill={colors.crema} />
        <rect
          x={X - 18}
          y={y}
          width={36}
          height={1010 - y}
          rx={18}
          fill={mercurio}
        />
        <circle cx={X} cy={1010} r={50} fill={mercurio} />
        {/* Escala */}
        {[40, 50, 60, 70, 80, 90, 100].map((g) => (
          <g key={g}>
            <rect
              x={X - 92}
              y={yDe(g) - 2}
              width={30}
              height={4}
              rx={2}
              fill={colors.crema}
              opacity={0.6}
            />
            <text
              x={X - 108}
              y={yDe(g) + 10}
              textAnchor="end"
              fontFamily={fonts.sans}
              fontWeight={500}
              fontSize={28}
              fill={colors.crema}
              opacity={0.75}
            >
              {g}°
            </text>
          </g>
        ))}
      </g>
      {etiqueta ? (
        <g
          transform={`translate(${X + 70} ${y})`}
          opacity={
            iv(f, [etiqueta[0], etiqueta[0] + 8], [0, 1]) *
            iv(f, [etiqueta[1] - 8, etiqueta[1]], [1, 0])
          }
        >
          <path d="M0,0 L22,-16 L22,16 Z" fill={colors.crema} />
          <rect
            x={20}
            y={-38}
            width={330}
            height={76}
            rx={38}
            fill={colors.crema}
          />
          <text
            x={185}
            y={13}
            textAnchor="middle"
            fontFamily={fonts.serif}
            fontWeight={700}
            fontSize={38}
            fill={colors.azul}
            style={{ fontVariantNumeric: "lining-nums" }}
          >
            {etiqueta[2]}
          </text>
        </g>
      ) : null}
    </svg>
  );
};

// La pava que empieza a "cantar": burbujitas y ondas de sonido.
const Pava: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 405, fps, config: { damping: 13 } });
  const sale = iv(f, [500, 520], [1, 0]);
  if (f < 400) return null;
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, opacity: sale }}
    >
      <g transform={`translate(770 880) scale(${Math.max(0, s)})`}>
        <path
          d="M-110,-70 L110,-70 C135,50 120,110 0,110 C-120,110 -135,50 -110,-70 Z"
          fill="#B9BDC4"
        />
        <path d="M-112,-35 L-200,35 L-188,47 L-104,0 Z" fill="#B9BDC4" />
        <path
          d="M-70,-70 C-70,-155 70,-155 70,-70"
          stroke="#2A2A2A"
          strokeWidth={16}
          fill="none"
        />
        <rect x={-36} y={-92} width={72} height={24} rx={10} fill="#2A2A2A" />
        {/* Ondas: canta */}
        {[0, 1, 2].map((i) => {
          const t = (f - 420 - i * 8) % 30;
          return (
            <path
              key={i}
              d={`M${-215 - i * 22},${-10 - i * 14} q${-14 - i * 6},${30 + i * 10} 0,${60 + i * 20}`}
              stroke={colors.crema}
              strokeWidth={6}
              strokeLinecap="round"
              fill="none"
              opacity={f > 420 ? iv(t, [0, 10, 30], [0, 0.8, 0]) : 0}
              transform="rotate(35 -200 35)"
            />
          );
        })}
      </g>
      {/* Un poco de vapor: todavía no hierve */}
      {new Array(8).fill(0).map((_, i) => {
        const t = (f - 410 + i * 7) % 40;
        return (
          <circle
            key={i}
            cx={740 + (i % 4) * 22}
            cy={iv(t, [0, 40], [740, 640], Easing.linear)}
            r={5 + (i % 3) * 2}
            fill={colors.crema}
            opacity={iv(t, [0, 8, 40], [0, 0.5, 0]) * Math.max(0, s)}
          />
        );
      })}
    </svg>
  );
};

export const Temperatura: React.FC = () => (
  <AbsoluteFill>
    <Fondo />
    <Encabezado titulo="La temperatura del agua" hasta={520} />
    <Termometro />
    <Pava />
    <Cierre desde={525} />
    <Subtitulo pasos={pasos} total={TEMPERATURA_FRAMES} />
  </AbsoluteFill>
);

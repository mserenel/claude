import {
  AbsoluteFill,
  Easing,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "./brand";
import {
  agua,
  Cierre,
  Encabezado,
  Fondo,
  iv,
  p,
  type Paso,
  Subtitulo,
} from "./Cebar";
import { DefsRealista, Imperial, imperialCuerpo } from "./Realista";

// "Cómo curar tu mate": cuarto video explicativo animado (9:16, 22 s), mismo
// estilo que los anteriores. El mate es el imperial dibujado de "Tipos de
// mate" (fleje con guarda pampa), en corte para ver lo que pasa adentro.

export const CURAR_FRAMES = 650;

const pasos: Paso[] = [
  { desde: 0, hasta: 60, frase: p("Un mate nuevo se *cura antes de usarlo.") },
  {
    desde: 60,
    hasta: 160,
    num: 1,
    frase: p("Llenalo con yerba *usada y agua *tibia."),
  },
  { desde: 160, hasta: 260, num: 2, frase: p("Dejalo reposar *24 *horas.") },
  {
    desde: 260,
    hasta: 370,
    num: 3,
    frase: p("Vacialo y *raspá suave las paredes con una cuchara."),
  },
  { desde: 370, hasta: 460, num: 4, frase: p("Repetilo *2 *o *3 *días.") },
  {
    desde: 460,
    hasta: 560,
    num: 5,
    frase: p("Dejalo *secar bien y nunca lo guardes con yerba."),
  },
  {
    desde: 560,
    hasta: CURAR_FRAMES,
    frase: p("Guardalo para cuando *estrenes tu mate."),
  },
];

const yerba = "#8C9A56";
const yerbaOscura = "#5E7038";

// El imperial (caja de 260x440) agrandado al centro de la pantalla.
const K = 1.7;
const TX = 540 - 130 * K;
const TY = 314;
const boca = { x: 540, y: TY + 135 * K };

// Corte: el cuerpo es todo calabaza, forrado por un cuero muy fino. Se ve
// el cuero apenas como un filo, la pared de calabaza y el hueco adentro.
const enEscala = (k: number) =>
  `translate(130 267) scale(${k}) translate(-130 -267)`;
const PARED = enEscala(0.94);
const HUECO = enEscala(0.87);

const Escena: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = Math.max(0, spring({ frame: f, fps, config: { damping: 14 } }));
  const sale = iv(f, [550, 568], [1, 0]);

  const nivel =
    iv(f, [65, 110], [380, 165], Easing.out(Easing.quad)) +
    iv(f, [268, 300], [0, 215]);
  const mojado = iv(f, [112, 150], [0, 1]);
  const cuchara = f >= 290 && f < 365 ? 1 : 0;
  const raspa = Math.sin((f - 290) / 5) * 45;
  const reloj = iv(f, [168, 250], [0, 1], Easing.inOut(Easing.quad));
  const enReloj = iv(f, [160, 172], [0, 1]) * iv(f, [250, 260], [1, 0]);

  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, opacity: sale }}
    >
      <DefsRealista />
      <defs>
        <clipPath id="curar-interior">
          <path d={imperialCuerpo} transform={HUECO} />
        </clipPath>
      </defs>

      {/* Yerba que cae (paso 1) */}
      {new Array(30).fill(0).map((_, i) => {
        const t0 = 64 + i * 1.5;
        const y = iv(
          f,
          [t0, t0 + 16],
          [boca.y - 130, boca.y + 30],
          Easing.in(Easing.quad),
        );
        return (
          <rect
            key={i}
            x={boca.x + (random(`cy${i}`) - 0.5) * 140}
            y={y}
            width={8}
            height={6}
            rx={2}
            fill={i % 3 ? yerba : yerbaOscura}
            opacity={f >= t0 && f < t0 + 16 ? 1 : 0}
          />
        );
      })}
      {/* Agua tibia (paso 1) */}
      {new Array(6).fill(0).map((_, i) => {
        const t0 = 114 + i * 6;
        const y = iv(
          f,
          [t0, t0 + 14],
          [boca.y - 120, boca.y + 30],
          Easing.in(Easing.quad),
        );
        return (
          <ellipse
            key={i}
            cx={boca.x + (i % 2 ? 18 : -18)}
            cy={y}
            rx={10}
            ry={15}
            fill={agua}
            opacity={f >= t0 && f < t0 + 14 ? 1 : 0}
          />
        );
      })}

      <g
        transform={`translate(${TX} ${TY}) scale(${K}) translate(130 434) scale(${entra}) translate(-130 -434)`}
      >
        <Imperial
          id="curar"
          hueco={
            <>
              {/* Corte: se ve la calabaza por dentro */}
              {/* Cuero negro, fino, por fuera */}
              <path d={imperialCuerpo} fill="#141110" />
              <path d={imperialCuerpo} transform={PARED} fill="#E3C68E" />
              <path
                d={imperialCuerpo}
                transform={PARED}
                fill="#fff"
                filter="url(#r-grano)"
                opacity={0.35}
              />
              <path d={imperialCuerpo} transform={HUECO} fill="url(#r-pulpa)" />
              <g clipPath="url(#curar-interior)">
                <path
                  d={`M0,${nivel} C80,${nivel - 8} 180,${nivel + 8} 260,${nivel} L260,440 L0,440 Z`}
                  fill={yerba}
                />
                <rect
                  x={0}
                  y={nivel}
                  width={260}
                  height={440}
                  fill={yerbaOscura}
                  opacity={0.75 * mojado}
                />
                <rect
                  x={0}
                  y={nivel}
                  width={260}
                  height={440}
                  fill="#fff"
                  filter="url(#r-grano)"
                  opacity={nivel < 375 ? 0.6 : 0}
                />
                {/* Sombra interna del borde cortado */}
                <path
                  d={imperialCuerpo}
                  transform={HUECO}
                  fill="none"
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth={14}
                  filter="url(#r-blur-s)"
                />
                {/* Lo que se desprende al raspar */}
                {new Array(10).fill(0).map((_, i) => {
                  const t0 = 296 + i * 6;
                  return (
                    <rect
                      key={i}
                      x={140 + random(`fx${i}`) * 40}
                      y={iv(f, [t0, t0 + 20], [200 + raspa * 0.5, 356])}
                      width={6}
                      height={4}
                      fill="#8E7446"
                      opacity={f >= t0 && f < t0 + 20 ? 1 : 0}
                    />
                  );
                })}
              </g>
              {/* Borde del corte: el espesor de la calabaza */}
              <path
                d={imperialCuerpo}
                transform={HUECO}
                fill="none"
                stroke="rgba(90,60,30,0.6)"
                strokeWidth={2}
              />
              {/* Cuchara raspando la pared */}
              <g
                transform={`translate(0 ${raspa}) rotate(-8 170 150)`}
                opacity={cuchara}
              >
                <path
                  d="M160,100 L168,100 L174,218 L166,218 Z"
                  fill="url(#r-alpaca)"
                />
                <path
                  d="M171,214 C188,214 188,266 171,266 C154,266 154,214 171,214 Z"
                  fill="url(#r-alpaca)"
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth={1.5}
                />
              </g>
            </>
          }
        />
      </g>

      {/* Reloj: 24 horas (paso 2) */}
      <g transform="translate(850 640)" opacity={enReloj}>
        <circle r={64} fill={colors.crema} />
        <circle r={64} fill="none" stroke={colors.madera} strokeWidth={6} />
        {new Array(12).fill(0).map((_, i) => (
          <rect
            key={i}
            x={-2}
            y={-56}
            width={4}
            height={10}
            fill={colors.azul}
            transform={`rotate(${i * 30})`}
          />
        ))}
        <rect
          x={-4}
          y={-38}
          width={8}
          height={42}
          rx={4}
          fill={colors.azul}
          transform={`rotate(${reloj * 720})`}
        />
        <rect
          x={-3}
          y={-56}
          width={6}
          height={60}
          rx={3}
          fill={colors.madera}
          transform={`rotate(${reloj * 360 * 8})`}
        />
        <circle r={7} fill={colors.azul} />
        <text
          y={122}
          textAnchor="middle"
          fontFamily={fonts.serif}
          fontWeight={700}
          fontSize={44}
          fill={colors.crema}
          style={{ fontVariantNumeric: "lining-nums" }}
        >
          24 h
        </text>
      </g>

      {/* Días (paso 4) */}
      {[0, 1, 2].map((i) => {
        const t0 = 380 + i * 22;
        const s = spring({ frame: f - t0, fps, config: { damping: 12 } });
        const fuera = iv(f, [450, 460], [1, 0]);
        return (
          <g
            key={i}
            transform={`translate(850 ${560 + i * 120}) scale(${Math.max(0, s)})`}
            opacity={fuera}
          >
            <circle r={42} fill={colors.crema} />
            <text
              y={16}
              textAnchor="middle"
              fontFamily={fonts.serif}
              fontWeight={800}
              fontSize={46}
              fill={colors.azul}
              style={{ fontVariantNumeric: "lining-nums" }}
            >
              {i + 1}
            </text>
          </g>
        );
      })}
      {f >= 380 && f < 460 ? (
        <text
          x={850}
          y={530 - 30}
          textAnchor="middle"
          fontFamily={fonts.sans}
          fontWeight={700}
          fontSize={26}
          letterSpacing={5}
          fill={colors.crema}
          opacity={0.7 * iv(f, [380, 390], [0, 1]) * iv(f, [450, 460], [1, 0])}
        >
          DÍAS
        </text>
      ) : null}

      {/* Aire que seca (paso 5) */}
      {[0, 1, 2].map((i) => {
        const t = ((f - 470 - i * 10) % 40) / 40;
        return (
          <path
            key={i}
            d={`M0,0 C40,-18 80,18 120,0 C150,-12 170,-6 180,4`}
            stroke={colors.crema}
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
            transform={`translate(${200 + t * 560} ${560 + i * 110})`}
            opacity={
              f >= 470 && f < 550
                ? iv(t, [0, 0.2, 0.8, 1], [0, 0.6, 0.6, 0])
                : 0
            }
          />
        );
      })}
    </svg>
  );
};

export const Curar: React.FC = () => (
  <AbsoluteFill>
    <Fondo />
    <Encabezado titulo="Cómo curar tu mate" hasta={568} />
    <Escena />
    <Cierre desde={575} />
    <Subtitulo pasos={pasos} total={CURAR_FRAMES} />
  </AbsoluteFill>
);

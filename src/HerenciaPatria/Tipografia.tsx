import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts, safe } from "./brand";
import { Scrim } from "./Caption";

// Textos centrados con mezcla de letras, como una tapa de revista: una
// cursiva (Addington), una línea chica en mayúsculas espaciadas (Helvetica
// Neue) y una palabra grande (Addington Bold).

export type Parte = {
  readonly t: string;
  readonly k: "italica" | "chica" | "grande";
};

const sombra = "0 2px 18px rgba(0,0,0,0.4)";

const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

// La palabra grande se achica si es larga, para que entre en el ancho.
const grandeSize = (t: string, max: number) =>
  Math.min(max, Math.floor(900 / (t.length * 0.7)));

const ParteTexto: React.FC<{
  readonly p: Parte;
  readonly t: number;
  readonly max: number;
}> = ({ p, t, max }) => {
  const base: React.CSSProperties = {
    opacity: t,
    color: colors.crema,
    textShadow: sombra,
    textAlign: "center",
  };
  if (p.k === "italica") {
    return (
      <div
        style={{
          ...base,
          transform: `translateY(${(1 - t) * 18}px)`,
          fontFamily: fonts.serif,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: 0.66 * max,
          lineHeight: 1.05,
        }}
      >
        {p.t}
      </div>
    );
  }
  if (p.k === "chica") {
    // Entra con las letras abriéndose hasta su espaciado final.
    const ls = 0.32 + (1 - t) * 0.25;
    return (
      <div
        style={{
          ...base,
          margin: "14px 0",
          fontFamily: fonts.sans,
          fontWeight: 500,
          fontSize: 0.28 * max,
          textTransform: "uppercase",
          letterSpacing: `${ls}em`,
          // El espaciado deja aire a la derecha: se compensa para centrar.
          paddingLeft: `${ls}em`,
        }}
      >
        {p.t}
      </div>
    );
  }
  return (
    <div
      style={{
        ...base,
        transform: `scale(${1.06 - 0.06 * t})`,
        fontFamily: fonts.serif,
        fontWeight: 700,
        fontSize: grandeSize(p.t, max),
        lineHeight: 1,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
      }}
    >
      {p.t}
    </div>
  );
};

// Frase arriba y centrada. Las partes entran una tras otra y salen juntas con
// un fundido corto al final de su secuencia.
export const Frase: React.FC<{
  readonly partes: Parte[];
  readonly delay?: number;
  // Tamaño de la palabra grande (las demás se escalan desde ahí).
  readonly max?: number;
  // El último texto antes del cierre también apaga su degradé.
  readonly last?: boolean;
}> = ({ partes, delay = 4, max = 140, last }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const exit = interpolate(
    f,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: last ? exit : 1 }}>
        <Scrim position="top" />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: safe.top + 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: exit,
        }}
      >
        {partes.map((p, i) => (
          <ParteTexto
            key={p.t}
            p={p}
            max={max}
            t={ease(f, delay + i * 7, delay + i * 7 + 12)}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Cierre: se oscurece la escena en azul de marca y aparecen el logo
// (original), la frase con la misma mezcla de letras y los beneficios.
export const CierreTipo: React.FC<{
  readonly partes: Parte[];
  readonly benefits: string[];
}> = ({ partes, benefits }) => {
  const f = useCurrentFrame();
  const dim = ease(f, 0, 12);
  const logo = ease(f, 4, 18);
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ backgroundColor: colors.azul, opacity: 0.74 * dim }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 60,
        }}
      >
        <Img
          src={staticFile("logo-herencia-patria.png")}
          style={{
            width: 320,
            height: 320,
            opacity: logo,
            transform: `scale(${0.96 + 0.04 * logo})`,
          }}
        />
        <div
          style={{
            opacity: logo,
            width: 110,
            height: 3,
            margin: "48px 0 36px",
            backgroundColor: colors.crema,
          }}
        />
        {partes.map((p, i) => (
          <ParteTexto
            key={p.t}
            p={p}
            max={112}
            t={ease(f, 14 + i * 7, 26 + i * 7)}
          />
        ))}
        <div
          style={{
            marginTop: 56,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {benefits.map((b, i) => {
            const t = ease(f, 32 + i * 6, 44 + i * 6);
            return (
              <div
                key={b}
                style={{
                  opacity: t,
                  transform: `translateY(${(1 - t) * 10}px)`,
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: 32,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  paddingLeft: "0.12em",
                  whiteSpace: "nowrap",
                  color: colors.crema,
                  padding: "20px 0",
                  width: 920,
                  textAlign: "center",
                  borderTop:
                    i === 0 ? undefined : "1px solid rgba(243,235,221,0.35)",
                }}
              >
                {b}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "./brand";
import { Scrim } from "./Caption";

// Textos centrados con mezcla de letras, como una tapa de revista: una
// cursiva, una línea chica y una palabra grande en negrita, todo en
// Addington CF y en minúsculas normales (sin mayúsculas sostenidas).

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
  Math.min(max, Math.floor(900 / (t.length * 0.58)));

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
    // Números a la altura de las mayúsculas ("3", "20%").
    fontVariantNumeric: "lining-nums",
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
    return (
      <div
        style={{
          ...base,
          transform: `translateY(${(1 - t) * 14}px)`,
          margin: "4px 0 8px",
          fontFamily: fonts.serif,
          fontWeight: 400,
          fontSize: 0.42 * max,
          lineHeight: 1.1,
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
      }}
    >
      {p.t}
    </div>
  );
};

// Zona donde el texto se ve en todos los lugares del anuncio. En 9:16 (Reels
// y Stories), Meta tapa ~14% arriba (270 px) y ~35% abajo (desde 1250 px) con
// su interfaz, y en el Feed recorta el video a 4:5 (sólo de 285 a 1635 px):
// el texto va entre 330 y 1240. En la versión 4:5 no hay nada superpuesto.
const zonaTexto = (height: number) =>
  height > 1500 ? { top: 330, bottom: 1240 } : { top: 70, bottom: height - 60 };

// Frase arriba y centrada. Las partes entran una tras otra y salen juntas con
// un fundido corto al final de su secuencia.
export const Frase: React.FC<{
  readonly partes: Parte[];
  readonly delay?: number;
  // Tamaño de la palabra grande (las demás se escalan desde ahí).
  readonly max?: number;
  // El último texto antes del cierre también apaga su degradé.
  readonly last?: boolean;
  // Completa desde el primer cuadro: es lo que se ve en la miniatura y en el
  // primer vistazo del anuncio.
  readonly instant?: boolean;
}> = ({ partes, delay = 4, max = 140, last, instant }) => {
  const f = useCurrentFrame();
  const { durationInFrames, height } = useVideoConfig();
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
          top: zonaTexto(height).top,
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
            t={instant ? 1 : ease(f, delay + i * 7, delay + i * 7 + 12)}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Cierre: se oscurece la escena en azul de marca y aparecen el logo
// (original), la frase con la misma mezcla de letras, los beneficios y el
// llamado a comprar, todo dentro de la zona visible del anuncio.
export const CierreTipo: React.FC<{
  readonly partes: Parte[];
  readonly benefits: string[];
  // Llamado a la compra (versión de venta). Es texto, no un botón dibujado:
  // en el anuncio el botón real "Comprar" lo pone Meta.
  readonly accion?: string;
  // Precio de lista y con transferencia, tal cual figuran en la tienda.
  readonly precio?: { readonly lista: string; readonly transferencia: string };
}> = ({ partes, benefits, accion, precio }) => {
  const f = useCurrentFrame();
  const { height } = useVideoConfig();
  const zona = zonaTexto(height);
  const dim = ease(f, 0, 12);
  const logo = ease(f, 4, 18);
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ backgroundColor: colors.azul, opacity: 0.68 * dim }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: zona.top - 30,
          height: zona.bottom - zona.top + 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img
          src={staticFile("logo-herencia-patria.png")}
          style={{
            width: precio ? 170 : 210,
            height: precio ? 170 : 210,
            opacity: logo,
            transform: `scale(${0.96 + 0.04 * logo})`,
          }}
        />
        <div
          style={{
            opacity: logo,
            width: 110,
            height: 3,
            margin: "30px 0 24px",
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
        {precio ? (
          <div
            style={{
              opacity: ease(f, 26, 38),
              marginTop: 26,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: colors.crema,
              textShadow: sombra,
              fontVariantNumeric: "lining-nums",
            }}
          >
            <div
              style={{
                fontFamily: fonts.serif,
                fontWeight: 700,
                fontSize: 92,
                lineHeight: 1,
              }}
            >
              {precio.lista}
            </div>
            <div
              style={{
                marginTop: 8,
                fontFamily: fonts.serif,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 50,
              }}
            >
              {precio.transferencia}
            </div>
          </div>
        ) : null}
        <div
          style={{
            marginTop: 30,
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
                  fontFamily: fonts.serif,
                  fontWeight: 500,
                  fontSize: 46,
                  // Números a la altura de las mayúsculas ("3", "20%").
                  fontVariantNumeric: "lining-nums",
                  whiteSpace: "nowrap",
                  color: colors.crema,
                  textShadow: sombra,
                  padding: "14px 0",
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
        {accion ? (
          <div
            style={{
              opacity: ease(f, 52, 64),
              marginTop: 26,
              fontFamily: fonts.serif,
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: 54,
              color: colors.crema,
              textShadow: sombra,
            }}
          >
            {accion}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

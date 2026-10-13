import "@fontsource/kalam/700.css";
import "@fontsource/rye/400.css";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { colors } from "./brand";
import { vozEnvolvente } from "./patricioVoz";

// Don Patricio, versión historieta animada (motion comic). Usa las
// ilustraciones oficiales sin redibujarlas, con la voz de ElevenLabs
// (public/patricio-voz/elevenlabs-bombilla.mp3). Para que "hable": la parte
// de abajo de la cara (bigote y mentón) se estira apenas al ritmo de la voz,
// la cabeza asiente con los acentos y la expresión cambia con cada idea,
// con un fundido en las pausas de la voz.

type Expr =
  | "explica"
  | "preocupado"
  | "senala"
  | "sorpresa"
  | "contento"
  | "serena"
  | "guino"
  | "orgullo";

// Tramos de la voz, medidos en sus pausas (cuadros a 30 fps). El texto de
// cada globo se escribe mientras dura su tramo.
type Linea = {
  readonly from: number;
  readonly to: number;
  readonly text: string;
};

const guion: Linea[] = [
  { from: 0, to: 86, text: "¡Buenas, m'hijo! ¿Se le tapa la bombilla?" },
  {
    from: 97,
    to: 203,
    text: "¡No es culpa de la bombilla, eh! Es cómo arma el mate.",
  },
  {
    from: 219,
    to: 409,
    text: "Mire: ponga la yerba, tape la boca con la mano, ¡y sacúdalo boca abajo! Así se va el polvillo.",
  },
  {
    from: 418,
    to: 542,
    text: "Después lo inclina, moja del costadito y mete la bombilla ahí. ¡Y no la mueva más, eh!",
  },
  { from: 596, to: 659, text: "Y ahí está el secreto." },
];

// Qué cara pone desde cada cuadro: cada cambio cae en una pausa de la voz.
const caras: { readonly from: number; readonly expr: Expr }[] = [
  { from: 0, expr: "explica" }, // ¡Buenas, m'hijo!
  { from: 46, expr: "preocupado" }, // ¿Se le tapa la bombilla?
  { from: 92, expr: "senala" }, // ¡No es culpa de la bombilla, eh!
  { from: 211, expr: "explica" }, // Mire: ponga la yerba...
  { from: 316, expr: "sorpresa" }, // ¡y sacúdalo boca abajo!
  { from: 367, expr: "contento" }, // Así se va el polvillo.
  { from: 418, expr: "serena" }, // Después lo inclina...
  { from: 547, expr: "senala" }, // ¡Y no la mueva más, eh!
  { from: 594, expr: "guino" }, // Y ahí está el secreto.
  { from: 668, expr: "orgullo" }, // levanta el mate, satisfecho
];
const FUNDIDO = 6;

const VOZ_FIN = 659;
const CIERRE = 95;
export const PATRICIO_FRAMES = VOZ_FIN + 16 + CIERRE;

// Zona de bigote y mentón de cada ilustración (en % de la imagen original,
// 1145x1374), sin tocar la bombilla. "orgullo" no habla.
const boca: Partial<Record<Expr, { clip: string; top: string }>> = {
  guino: {
    clip: "polygon(47% 46.5%, 75% 46.5%, 75% 51%, 69% 54%, 68% 59%, 49% 59%, 46% 52.5%)",
    top: "46.5%",
  },
  preocupado: {
    clip: "polygon(47% 50%, 75% 50%, 75% 54%, 70% 57.5%, 69% 60.5%, 50% 60.5%, 47% 55.5%)",
    top: "50%",
  },
  serena: {
    clip: "polygon(45% 39%, 71% 39%, 71% 43%, 66% 45%, 65% 51%, 46% 52%, 43% 46%)",
    top: "39%",
  },
  sorpresa: {
    clip: "polygon(47% 41%, 72% 41%, 72% 45.5%, 66% 47%, 66% 55.5%, 50% 56%, 46% 49%)",
    top: "41%",
  },
  explica: {
    clip: "polygon(44% 37%, 67% 37%, 67% 41%, 64% 42%, 65% 52.5%, 48% 53%, 44% 46%)",
    top: "37%",
  },
  senala: {
    clip: "polygon(45% 38%, 71% 38%, 71% 43%, 66% 44%, 66% 53.5%, 49% 54%, 45% 47%)",
    top: "38%",
  },
  contento: {
    clip: "polygon(46% 38%, 70% 38%, 70% 42%, 66% 44%, 66% 52.5%, 49% 53%, 45% 47%)",
    top: "38%",
  },
};

// Cada ilustración tiene la cabeza en un lugar un poco distinto: se corre
// (en % de la imagen) para que la cara quede siempre en el mismo lugar y el
// cambio se vea como un gesto, no como un salto. "orgullo" levanta la
// cabeza: se corrige sólo a medias.
const ajuste: Record<Expr, [number, number]> = {
  serena: [0, 0],
  sorpresa: [0, -1.2],
  orgullo: [1.4, 2],
  explica: [3.3, 1.7],
  senala: [1, -1],
  contento: [0.6, 0],
  guino: [0.2, -3.5],
  preocupado: [-0.6, -4.6],
};

// Estilo de historieta argentina de revista (Patoruzú, Rico Tipo): papel de
// diario amarillento, viñeta con borde de tinta, título de portada en letra
// de cartel antiguo y globos ovalados con letra de rotulista en mayúsculas.
const papel = "#E6D3A8";
// El fondo de las ilustraciones: adentro de la viñeta no se nota el borde.
const fondoVineta = "#EFE3CC";
const tinta = "#1A1A1A";
const letra = '"Kalam", cursive';
const cartel = '"Rye", serif';

// Viñeta: debajo del título y hasta casi el borde (la parte de abajo la tapa
// la interfaz de Instagram de todas formas).
const VINETA = { left: 34, right: 34, top: 300, bottom: 34 };

const amp = (f: number) => vozEnvolvente[Math.max(0, f)] ?? 0;

const Cara: React.FC<{ readonly expr: Expr; readonly opacity: number }> = ({
  expr,
  opacity,
}) => {
  const f = useCurrentFrame();
  const a = amp(f);
  const src = staticFile(`patricio-${expr}.png`);
  const b = boca[expr];
  const [dx, dy] = ajuste[expr];
  const imgStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
  };
  return (
    <AbsoluteFill style={{ opacity, transform: `translate(${dx}%, ${dy}%)` }}>
      <Img src={src} style={imgStyle} />
      {/* "Mandíbula": la misma imagen recortada a bigote y mentón, estirada
          hacia abajo según el volumen de la voz. */}
      {b ? (
        <Img
          src={src}
          style={{
            ...imgStyle,
            clipPath: b.clip,
            transform: `scaleY(${1 + 0.07 * a})`,
            transformOrigin: `50% ${b.top}`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

const Personaje: React.FC = () => {
  const f = useCurrentFrame();
  // Voz muy suavizada (~0,8 s, centrada) para la cabeza: acompaña las
  // frases, no cada sílaba.
  let s = 0;
  for (let i = -12; i <= 12; i++) s += amp(f + i) * (1 - Math.abs(i) / 13);
  const habla = s / 13;
  const breath = 1 + 0.012 * Math.sin((f / 30) * Math.PI * 0.9);
  const sway =
    0.7 * Math.sin((f / 30) * Math.PI * 0.4) +
    0.9 * habla * Math.sin((f / 30) * Math.PI * 0.9);
  const nod = 4 * habla;
  // Un pequeño impulso en cada cambio de cara, como quien cambia de gesto.
  let pop = 1;
  for (const c of caras.slice(1)) {
    pop *= interpolate(
      f,
      [c.from - 8, c.from, c.from + 10, c.from + 24],
      [1, 0.985, 1.015, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.sin),
      },
    );
  }
  const entra = (i: number) =>
    i === 0
      ? 1
      : interpolate(
          f,
          [caras[i].from - FUNDIDO / 2, caras[i].from + FUNDIDO / 2],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.sin),
          },
        );
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          // Más grande que la viñeta: el cuerpo queda cortado por el borde,
          // como en un cuadro de historieta.
          left: -38,
          top: 290,
          width: 1117,
          height: 1340,
          transform: `translateY(${nod}px) scale(${breath * pop}) rotate(${sway}deg)`,
          transformOrigin: "50% 95%",
          // El corte de abajo de la ilustración se funde con la viñeta.
          maskImage: "linear-gradient(to bottom, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 90%, transparent 100%)",
        }}
      >
        {/* Cada cara entra por encima de la anterior, que sigue entera
            debajo hasta que la nueva termina de aparecer. */}
        {caras.map((c, i) => {
          const o = entra(i);
          const tapada = i + 1 < caras.length && entra(i + 1) >= 1;
          if (o <= 0 || tapada) return null;
          return <Cara key={c.from} expr={c.expr} opacity={o} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Globo: React.FC<{
  readonly text: string;
  readonly frames: number;
  // Cuadros que dura su tramo de voz: el texto se escribe a ese ritmo.
  readonly speech: number;
  // El primer globo aparece completo desde el cuadro 0: es el gancho.
  readonly instant?: boolean;
}> = ({ text, frames, speech, instant }) => {
  const f = useCurrentFrame();
  const enter = instant
    ? 1
    : interpolate(f, [0, 8], [0, 1], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.back(1.6)),
      });
  const exit = interpolate(f, [frames - 6, frames], [1, 0], {
    extrapolateLeft: "clamp",
  });
  // El texto aparece de a poco, como si lo fuera diciendo.
  const shown = instant
    ? text.length
    : Math.round(
        interpolate(f, [0, speech], [0, text.length], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      );
  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <div
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          top: 22,
          minHeight: 250,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "64px 140px",
          background: "white",
          border: `5px solid ${tinta}`,
          // Globo ovalado, como en las historietas de revista.
          borderRadius: "50%",
          transform: `scale(${enter})`,
          transformOrigin: "62% 100%",
        }}
      >
        <div
          style={{
            fontFamily: letra,
            fontWeight: 700,
            fontSize: 50,
            lineHeight: 1.1,
            color: tinta,
            textAlign: "center",
            textTransform: "uppercase",
            textWrap: "balance",
          }}
        >
          {/* Se reserva el espacio del texto completo para que el globo no
              cambie de tamaño mientras se escribe. */}
          <span>{text.slice(0, shown)}</span>
          <span style={{ visibility: "hidden" }}>{text.slice(shown)}</span>
        </div>
        {/* Cola del globo, apuntando a la boca de Don Patricio. */}
        <svg
          width="120"
          height="130"
          viewBox="0 0 120 130"
          style={{ position: "absolute", bottom: -118, left: "60%" }}
        >
          <path
            d="M14 0 Q40 70 92 124 Q62 60 70 0 Z"
            fill="white"
            stroke={tinta}
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <rect x="8" y="-10" width="70" height="14" fill="white" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// Título de tapa de revista, arriba de la viñeta.
const Cabecera: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
    <div
      style={{
        fontFamily: cartel,
        fontSize: 104,
        lineHeight: 1,
        color: colors.azul,
        letterSpacing: 2,
        textShadow: `4px 4px 0 ${tinta}`,
        WebkitTextStroke: `2px ${tinta}`,
      }}
    >
      DON PATRICIO
    </div>
    <div
      style={{
        marginTop: 14,
        display: "flex",
        alignItems: "center",
        gap: 18,
        fontFamily: letra,
        fontWeight: 700,
        fontSize: 38,
        color: tinta,
        textTransform: "uppercase",
        letterSpacing: 1,
      }}
    >
      <span style={{ width: 54, height: 4, background: tinta }} />
      Secreto Nº 1: la bombilla tapada
      <span style={{ width: 54, height: 4, background: tinta }} />
    </div>
  </AbsoluteFill>
);

const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, 14], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        paddingTop: 70,
        opacity: t,
        transform: `translateY(${(1 - t) * 16}px)`,
      }}
    >
      {/* Recuadro de texto (cartucho) como los de las revistas. */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "26px 40px 30px",
          background: "#F3D77A",
          border: `5px solid ${tinta}`,
          boxShadow: `6px 6px 0 ${tinta}`,
        }}
      >
        <div
          style={{
            fontFamily: cartel,
            fontSize: 64,
            color: tinta,
            letterSpacing: 2,
          }}
        >
          CONTINUARÁ…
        </div>
        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            gap: 22,
          }}
        >
          {/* El logo es blanco: va sobre un círculo azul de marca. */}
          <div
            style={{
              width: 130,
              height: 130,
              flexShrink: 0,
              borderRadius: "50%",
              background: colors.azul,
              border: `4px solid ${tinta}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img
              src={staticFile("logo-herencia-patria.png")}
              style={{ width: 114, height: 114 }}
            />
          </div>
          <div
            style={{
              fontFamily: letra,
              fontWeight: 700,
              fontSize: 40,
              lineHeight: 1.12,
              color: tinta,
              textTransform: "uppercase",
              maxWidth: 640,
            }}
          >
            Seguí a Herencia Patria para más secretos de Don Patricio
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Papel de revista impreso: grano, trama de puntos de imprenta y bordes
// gastados, por encima de todo (el dibujo y los textos están "impresos").
const Papel: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width="1080" height="1920" style={{ position: "absolute" }}>
      <filter id="grano">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          seed="7"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.2  0 0 0 0.55 0"
        />
      </filter>
      <rect width="1080" height="1920" filter="url(#grano)" opacity="0.35" />
    </svg>
    <AbsoluteFill
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(60,40,10,0.09) 1.3px, transparent 1.9px)",
        backgroundSize: "8px 8px",
        mixBlendMode: "multiply",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(110,70,20,0.28) 100%)",
        mixBlendMode: "multiply",
      }}
    />
    {/* Un tono amarillento parejo: papel de diario con años. */}
    <AbsoluteFill
      style={{ background: "rgba(225,190,120,0.16)", mixBlendMode: "multiply" }}
    />
  </AbsoluteFill>
);

export const DonPatricio: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: papel }}>
      <Cabecera />
      <div
        style={{
          position: "absolute",
          ...VINETA,
          overflow: "hidden",
          background: fondoVineta,
          border: `7px solid ${tinta}`,
          // Colores de imprenta: un poco menos saturados y más cálidos.
          filter: "sepia(0.12) saturate(0.92) contrast(1.04)",
        }}
      >
        <Personaje />
        {guion.map((l, i) => {
          // Cada globo queda hasta que empieza el siguiente (o el cierre).
          const next = guion[i + 1]?.from ?? VOZ_FIN + 16;
          return (
            <Sequence
              key={l.from}
              from={l.from}
              durationInFrames={next - l.from}
            >
              <Globo
                text={l.text}
                frames={next - l.from}
                speech={l.to - l.from}
                instant={l.from === 0}
              />
            </Sequence>
          );
        })}
      </div>
      <Audio src={staticFile("patricio-voz/elevenlabs-bombilla.mp3")} />
      <Sequence from={VOZ_FIN + 16}>
        <Cierre />
      </Sequence>
      <Papel />
    </AbsoluteFill>
  );
};

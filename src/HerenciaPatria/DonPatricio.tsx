import "@fontsource/comic-neue/700.css";
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

const fondo = "#F2E8D6";
const tinta = "#1A1A1A";
const letra = '"Comic Neue", sans-serif';

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
          left: 40,
          top: 640,
          width: 1000,
          height: 1200,
          transform: `translateY(${nod}px) scale(${breath * pop}) rotate(${sway}deg)`,
          transformOrigin: "50% 95%",
          // Bordes fundidos con el fondo crema del video.
          maskImage:
            "radial-gradient(ellipse 62% 60% at 50% 48%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 62% 60% at 50% 48%, black 70%, transparent 100%)",
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
          left: 80,
          right: 80,
          top: 250,
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "36px 48px",
          background: "white",
          border: `6px solid ${tinta}`,
          borderRadius: 60,
          boxShadow: `6px 8px 0 ${tinta}`,
          transform: `scale(${enter})`,
          transformOrigin: "60% 100%",
        }}
      >
        <div
          style={{
            fontFamily: letra,
            fontWeight: 700,
            fontSize: 64,
            lineHeight: 1.18,
            color: tinta,
            textAlign: "center",
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
          height="120"
          viewBox="0 0 120 120"
          style={{ position: "absolute", bottom: -104, left: "58%" }}
        >
          <path
            d="M10 0 L70 0 L95 110 Z"
            fill="white"
            stroke={tinta}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <rect x="4" y="-8" width="72" height="12" fill="white" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

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
        paddingTop: 270,
        opacity: t,
        transform: `translateY(${(1 - t) * 16}px)`,
      }}
    >
      {/* El logo es blanco: va sobre un círculo azul de marca. */}
      <div
        style={{
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: colors.azul,
          border: `6px solid ${tinta}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img
          src={staticFile("logo-herencia-patria.png")}
          style={{ width: 220, height: 220 }}
        />
      </div>
      <div
        style={{
          marginTop: 22,
          fontFamily: letra,
          fontWeight: 700,
          fontSize: 54,
          lineHeight: 1.15,
          color: colors.azul,
          textAlign: "center",
          maxWidth: 860,
          textWrap: "balance",
        }}
      >
        Seguí a Herencia Patria para más secretos de Don Patricio
      </div>
    </AbsoluteFill>
  );
};

export const DonPatricio: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: fondo }}>
      <Personaje />
      <Audio src={staticFile("patricio-voz/elevenlabs-bombilla.mp3")} />
      {guion.map((l, i) => {
        // Cada globo queda hasta que empieza el siguiente (o el cierre).
        const next = guion[i + 1]?.from ?? VOZ_FIN + 16;
        return (
          <Sequence key={l.from} from={l.from} durationInFrames={next - l.from}>
            <Globo
              text={l.text}
              frames={next - l.from}
              speech={l.to - l.from}
              instant={l.from === 0}
            />
          </Sequence>
        );
      })}
      <Sequence from={VOZ_FIN + 16}>
        <Cierre />
      </Sequence>
    </AbsoluteFill>
  );
};

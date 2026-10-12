import "@fontsource/comic-neue/700.css";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { colors } from "./brand";

// Don Patricio, versión historieta animada (motion comic). Usa las dos
// ilustraciones oficiales sin modificarlas: el personaje "respira" y se
// balancea apenas, cambia de expresión con un corte de viñeta y habla con
// globos de diálogo. Sin animación de boca: eso requiere un generador de
// video (ver la biblia del personaje).

type Expr = "preocupado" | "guino";

type Linea = {
  readonly frames: number;
  readonly expr: Expr;
  readonly text: string;
};

// Tip: la bombilla tapada. Tono de la biblia: de usted, pausado, con remate.
const guion: Linea[] = [
  { frames: 80, expr: "preocupado", text: "¿Se le tapa la bombilla, m'hijo?" },
  {
    frames: 85,
    expr: "preocupado",
    text: "No es culpa de la bombilla. Es cómo arma el mate.",
  },
  {
    frames: 110,
    expr: "guino",
    text: "Ponga la yerba, tape la boca con la mano y sacúdalo boca abajo. Así se va el polvillo.",
  },
  {
    frames: 105,
    expr: "guino",
    text: "Inclínelo, moje del costado y meta la bombilla ahí. Y después no la mueva más.",
  },
  { frames: 95, expr: "guino", text: "Y ahí está el secreto." },
];

const CIERRE = 90;
export const PATRICIO_FRAMES = guion.reduce((t, l) => t + l.frames, 0) + CIERRE;

const fondo = "#F2E8D6";
const tinta = "#1A1A1A";
const letra = '"Comic Neue", sans-serif';

const Personaje: React.FC<{ readonly expr: Expr }> = ({ expr }) => {
  const f = useCurrentFrame();
  // Respiración y balanceo suaves, y un "pop" corto al cambiar de viñeta.
  const breath = 1 + 0.012 * Math.sin((f / 30) * Math.PI * 0.9);
  const sway = 0.7 * Math.sin((f / 30) * Math.PI * 0.45);
  const pop = interpolate(f, [0, 7], [1.035, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(2)),
  });
  return (
    <AbsoluteFill>
      <Img
        src={staticFile(`patricio-${expr}.png`)}
        style={{
          position: "absolute",
          left: 40,
          top: 640,
          width: 1000,
          height: 1200,
          objectFit: "cover",
          transform: `scale(${breath * pop}) rotate(${sway}deg)`,
          transformOrigin: "50% 95%",
          // Bordes fundidos con el fondo crema del video.
          maskImage:
            "radial-gradient(ellipse 62% 60% at 50% 48%, black 70%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 62% 60% at 50% 48%, black 70%, transparent 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const Globo: React.FC<{
  readonly text: string;
  readonly frames: number;
  // El primer globo aparece completo desde el cuadro 0: es el gancho.
  readonly instant?: boolean;
}> = ({ text, frames, instant }) => {
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
        interpolate(
          f,
          [6, Math.min(frames - 20, 6 + text.length * 1.1)],
          [0, text.length],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        ),
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
  let at = 0;
  const bloques = guion.map((l) => {
    const from = at;
    at += l.frames;
    return { ...l, from };
  });
  // Viñetas: un tramo por cada racha de la misma expresión.
  const tramos: { from: number; frames: number; expr: Expr }[] = [];
  for (const b of bloques) {
    const last = tramos[tramos.length - 1];
    if (last && last.expr === b.expr) last.frames += b.frames;
    else tramos.push({ from: b.from, frames: b.frames, expr: b.expr });
  }
  tramos[tramos.length - 1].frames += CIERRE;

  return (
    <AbsoluteFill style={{ backgroundColor: fondo }}>
      {tramos.map((t) => (
        <Sequence key={t.from} from={t.from} durationInFrames={t.frames}>
          <Personaje expr={t.expr} />
        </Sequence>
      ))}
      {bloques.map((b) => (
        <Sequence key={b.from} from={b.from} durationInFrames={b.frames}>
          <Globo text={b.text} frames={b.frames} instant={b.from === 0} />
        </Sequence>
      ))}
      <Sequence from={at}>
        <Cierre />
      </Sequence>
    </AbsoluteFill>
  );
};

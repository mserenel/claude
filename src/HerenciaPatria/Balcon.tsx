import "@fontsource/libre-caslon-text/400-italic.css";
import "@fontsource/libre-caslon-text/400.css";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { colors } from "./brand";

// Reel de estilo de vida, no de anuncio: el mate en el balcón con la ciudad.
// public/balcon.mp4: IMG_6966 (1080x1920, sin sonido) a 30 fps, con una
// corrección natural (un poco más de luz y color, sin oscurecer el cielo).
// Sin degradés ni cierre en bloque: texto mínimo en azul de marca sobre el
// cielo claro, y la cámara se abre despacio del mate a la ciudad. Se publica
// con un audio de la biblioteca de Instagram.

// 12 s: la cámara original va subiendo y después de ese punto casi no queda
// cielo para el cierre. Un Reel más corto además se ve completo más veces.
export const BALCON_FRAMES = 360;

const fade = (f: number, a: number, b: number, c: number, d: number) =>
  interpolate(f, [a, b, c, d], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

const serif = '"Libre Caslon Text", serif';

export const Balcon: React.FC<{ readonly tagline: string }> = ({ tagline }) => {
  const f = useCurrentFrame();
  // Arranca cerca del mate y se abre hasta mostrar toda la vista.
  const scale = interpolate(f, [0, BALCON_FRAMES], [1.15, 1.0], {
    easing: Easing.inOut(Easing.sin),
  });
  const pregunta = fade(f, 10, 34, 115, 140);
  const cierre = fade(f, 270, 296, 400, 410);
  const rise = (o: number) => `translateY(${(1 - o) * 14}px)`;

  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("balcon.mp4")}
        muted
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale})`,
          transformOrigin: "50% 64%",
        }}
      />
      <AbsoluteFill
        style={{ alignItems: "center", paddingTop: 200, textAlign: "center" }}
      >
        <div
          style={{
            opacity: pregunta,
            transform: rise(pregunta),
            fontFamily: serif,
            fontSize: 78,
            lineHeight: 1.18,
            color: colors.azul,
            textShadow: "0 1px 14px rgba(255,255,255,0.6)",
          }}
        >
          <div>¿Con qué vista</div>
          <div style={{ fontStyle: "italic" }}>tomás tus mates?</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{ alignItems: "center", paddingTop: 165, textAlign: "center" }}
      >
        <div
          style={{
            opacity: cierre,
            transform: rise(cierre),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Img
            src={staticFile("logo-herencia-patria.png")}
            style={{
              width: 112,
              height: 112,
              filter:
                "drop-shadow(0 0 1px rgba(20,35,59,1)) drop-shadow(0 0 3px rgba(20,35,59,0.9)) drop-shadow(0 2px 16px rgba(20,35,59,0.55))",
            }}
          />
          <div
            style={{
              marginTop: 16,
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: 44,
              whiteSpace: "nowrap",
              color: colors.azul,
              textShadow: "0 1px 14px rgba(255,255,255,0.6)",
            }}
          >
            {tagline}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

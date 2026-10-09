import "@fontsource/libre-caslon-text/400-italic.css";
import "@fontsource/libre-caslon-text/700.css";
import "@fontsource/playfair-display/600-italic.css";
import "@fontsource/playfair-display/700.css";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Portada con el sistema de títulos del feed de Herencia Patria:
// palabra chica en cursiva, nombre grande en mayúsculas y línea en cursiva
// debajo ("Mate / TORPEDO / Repujado"), logo chico abajo a la derecha.
// Todo dentro del recorte 3:4 de la grilla (y de 240 a 1680).
export const PortadaFeed: React.FC<{
  readonly src: string;
  readonly kicker: string;
  readonly name: string;
  readonly sub: string;
  readonly tag?: string;
  readonly family?: "caslon" | "playfair";
}> = ({ src, kicker, name, sub, tag, family = "caslon" }) => {
  const f =
    family === "caslon"
      ? { font: '"Libre Caslon Text", serif', italic: 400, bold: 700 }
      : { font: '"Playfair Display", serif', italic: 600, bold: 700 };
  const shadow = "0 3px 22px rgba(0,0,0,0.45)";
  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(18,12,8,0.45) 0%, rgba(18,12,8,0.25) 30%, rgba(18,12,8,0) 46%)",
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 370 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: colors.crema,
            textShadow: shadow,
            fontFamily: f.font,
          }}
        >
          <div
            style={{
              fontStyle: "italic",
              fontWeight: f.italic,
              fontSize: 80,
              lineHeight: 1.05,
              marginLeft: 8,
            }}
          >
            {kicker}
          </div>
          <div
            style={{
              fontWeight: f.bold,
              fontSize: 138,
              lineHeight: 1,
              letterSpacing: 1,
            }}
          >
            {name}
          </div>
          <div
            style={{
              alignSelf: "flex-end",
              fontStyle: "italic",
              fontWeight: f.italic,
              fontSize: 80,
              lineHeight: 1.15,
            }}
          >
            {sub}
          </div>
          {tag ? (
            <div
              style={{
                alignSelf: "center",
                marginTop: 28,
                display: "flex",
                alignItems: "center",
                gap: 22,
                fontFamily: fonts.serif,
                fontWeight: 600,
                fontSize: 46,
                letterSpacing: 10,
                textTransform: "uppercase",
              }}
            >
              <span
                style={{ width: 60, height: 2, background: colors.crema }}
              />
              {tag}
              <span
                style={{ width: 60, height: 2, background: colors.crema }}
              />
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
      {/* La corteza de abajo es clara y con mucha textura: un oscurecido
          suave en la esquina, como una viñeta, para que el logo se despegue. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle 300px at 88% 81%, rgba(18,12,8,0.62) 0%, rgba(18,12,8,0.35) 45%, rgba(18,12,8,0) 100%)",
        }}
      />
      <Img
        src={staticFile("logo-herencia-patria.png")}
        style={{
          filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.6))",
          position: "absolute",
          right: 64,
          bottom: 1920 - 1680 + 70,
          width: 180,
          height: 180,
        }}
      />
    </AbsoluteFill>
  );
};

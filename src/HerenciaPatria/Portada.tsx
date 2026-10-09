import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Portada del Reel (1080x1920). La grilla del perfil de Instagram la muestra
// recortada a 3:4 por el centro (y de 240 a 1680): todo lo importante va
// dentro de esa zona, y el texto arriba del mate.
export const Portada: React.FC<{
  readonly src: string;
  readonly lines: string[];
  // Acercamiento de la foto desde abajo, para bajar el mate si hace falta
  // más aire para el título.
  readonly zoom?: number;
  readonly titleSize?: number;
  readonly top?: number;
}> = ({ src, lines, zoom = 1, titleSize = 104, top = 262 }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
          transformOrigin: "50% 100%",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(18,12,8,0.55) 0%, rgba(18,12,8,0.35) 30%, rgba(18,12,8,0) 48%)",
        }}
      />
      <AbsoluteFill
        style={{ alignItems: "center", paddingTop: top, textAlign: "center" }}
      >
        <Img
          src={staticFile("logo-herencia-patria.png")}
          style={{ width: 132, height: 132 }}
        />
        <div
          style={{
            marginTop: 30,
            fontFamily: fonts.serif,
            fontWeight: 600,
            fontSize: titleSize,
            lineHeight: 1,
            color: colors.crema,
            textShadow: "0 3px 24px rgba(0,0,0,0.45)",
          }}
        >
          {lines.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

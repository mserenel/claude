import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Historia de Instagram (1080x1920) para un mate hecho por encargo: la foto
// real tal cual (sólo encuadrada y con un ajuste de luz suave), arriba el
// sello sobre un disco azul y la dedicatoria en la letra a mano, en azul
// para que se lea sobre una pared clara, y abajo de ella lo que dice el
// grabado de la virola.

export const HistoriaDedicada: React.FC<{
  readonly src: string;
  readonly frase: string[];
  readonly grabado: string;
  // Desplazamiento vertical de la foto (px del cuadro), para dar aire arriba.
  readonly bajar?: number;
}> = ({ src, frase, grabado, bajar = 0 }) => {
  const sello = 190;
  return (
    <AbsoluteFill style={{ backgroundColor: colors.crema }}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          top: bajar,
          width: 1080,
          height: 1920,
          objectFit: "cover",
          // Luz algo más cálida y con un poco más de contraste: la foto es de
          // celular contra una pared gris. No se toca la forma.
          filter: "brightness(1.03) contrast(1.06) saturate(1.04) sepia(0.06)",
        }}
      />
      <div
        style={{
          position: "absolute",
          // Lo más arriba posible sin meterse bajo el nombre del perfil.
          top: 180,
          left: 70,
          right: 70,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: sello,
            height: sello,
            borderRadius: "50%",
            background: colors.azul,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={staticFile("logo-herencia-patria.png")}
            style={{ width: sello * 0.86, height: sello * 0.86 }}
          />
        </div>
        <div
          style={{
            marginTop: 34,
            fontFamily: `${fonts.mano}, "Noto Color Emoji"`,
            fontSize: 80,
            lineHeight: 1.12,
            color: colors.azul,
          }}
        >
          {frase.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: fonts.serif,
            fontStyle: "italic",
            fontSize: 40,
            // "LR11" con números a la altura de las mayúsculas.
            fontVariantNumeric: "lining-nums",
            color: colors.madera,
          }}
        >
          {grabado}
        </div>
      </div>
    </AbsoluteFill>
  );
};

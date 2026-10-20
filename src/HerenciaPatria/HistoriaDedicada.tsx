import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Historia de Instagram (1080x1920) para un mate hecho por encargo: la foto
// real tal cual (sólo encuadrada y con un ajuste de luz suave) y arriba, sobre
// la pared, la marca y para quién es. Dos estilos:
// - "azul": el logo completo en azul (pájaro y HERENCIA PATRIA), la bandera y
//   debajo el lugar libre para la mención (@), que se pone en Instagram con el
//   sticker de mención para que se pueda tocar. Como las historias de los
//   encargos ya publicadas.
// - "sello": el sello sobre un disco azul, la dedicatoria en la letra a mano y
//   lo que dice el grabado de la virola.

export const HistoriaDedicada: React.FC<{
  readonly src: string;
  readonly estilo?: "azul" | "sello";
  readonly bandera?: string;
  readonly frase?: string[];
  readonly grabado?: string;
  // Desplazamiento vertical de la foto (px del cuadro), para dar aire arriba.
  readonly bajar?: number;
}> = ({ src, estilo = "azul", bandera, frase = [], grabado, bajar = 0 }) => {
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
          // Apenas más luz y contraste: la foto es de celular contra una
          // pared gris. Sin virar el color, para que la piel se vea natural.
          filter: "brightness(1.02) contrast(1.04)",
        }}
      />
      <div
        style={{
          position: "absolute",
          // Lo más arriba posible sin meterse bajo el nombre del perfil.
          top: estilo === "azul" ? 230 : 180,
          left: 70,
          right: 70,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {estilo === "azul" ? (
          <Img
            src={staticFile("logos/herencia-patria-azul.svg")}
            style={{ width: 500 }}
          />
        ) : (
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
        )}
        {bandera ? (
          <div
            style={{
              marginTop: estilo === "azul" ? 90 : 34,
              fontFamily: '"Noto Color Emoji"',
              fontSize: 64,
              lineHeight: 1,
            }}
          >
            {bandera}
          </div>
        ) : null}
        {frase.length > 0 ? (
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
        ) : null}
        {grabado ? (
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
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

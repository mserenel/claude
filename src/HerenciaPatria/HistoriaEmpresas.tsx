import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Historia de Instagram (1080x1920) para los pedidos empresariales de fin
// de año, sólo con letras de Herencia (Addington y Acumin; la Sketcha es la
// de Don Patricio): el sello azul arriba, el título, una fila de mates reales (las
// fotos de producto sobre blanco, que con "multiply" se funden con el
// crema) y abajo qué incluye y cómo pedir. Instagram tapa ~200 px arriba y
// ~180 px abajo: todo va entre 230 y 1740.

export const HistoriaEmpresas: React.FC<{
  readonly mates: string[][];
  readonly titulo: string[];
  readonly bajada: string;
  readonly puntos: string[];
  readonly accion: string;
  readonly nota: string;
}> = ({ mates, titulo, bajada, puntos, accion, nota }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.crema,
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Img
        src={staticFile("logos/herencia-patria-sello-azul.png")}
        style={{ position: "absolute", top: 220, width: 230 }}
      />
      <div
        style={{
          position: "absolute",
          top: 470,
          left: 70,
          right: 70,
          fontFamily: fonts.serif,
          fontSize: 92,
          lineHeight: 1.02,
          color: colors.azul,
        }}
      >
        {titulo.map((l) => (
          <div key={l}>{l}</div>
        ))}
        <div
          style={{
            marginTop: 18,
            fontStyle: "italic",
            fontSize: 58,
            color: colors.madera,
          }}
        >
          {bajada}
        </div>
      </div>
      {/* Dos filas, la de atrás un poco más chica, sin que se pisen. */}
      {mates.map((fila, i) => (
        <div
          key={fila.join()}
          style={{
            position: "absolute",
            top: i === 0 ? 760 : 1010,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: i === 0 ? 30 : 10,
          }}
        >
          {fila.map((src) => {
            const lado = i === 0 ? 300 : 340;
            return (
              <Img
                key={src}
                src={staticFile(src)}
                style={{
                  width: lado,
                  height: lado,
                  // La foto es cuadrada con mucho blanco a los costados.
                  margin: `0 -${lado * 0.12}px`,
                  mixBlendMode: "multiply",
                }}
              />
            );
          })}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          top: 1380,
          left: 90,
          right: 90,
          fontFamily: fonts.acumin,
          fontSize: 38,
          lineHeight: 1.5,
          color: colors.azul,
        }}
      >
        {puntos.map((p) => (
          <div key={p}>{p}</div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          // Texto, no botón: va a publicitarse y un botón falso confunde.
          top: 1590,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: fonts.serif,
          fontSize: 50,
          color: colors.azul,
        }}
      >
        <div
          style={{
            width: 90,
            height: 2,
            background: colors.mostaza,
            marginBottom: 22,
          }}
        />
        {accion}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1700,
          fontFamily: fonts.serif,
          fontStyle: "italic",
          fontSize: 40,
          color: colors.madera,
        }}
      >
        {nota}
      </div>
    </AbsoluteFill>
  );
};

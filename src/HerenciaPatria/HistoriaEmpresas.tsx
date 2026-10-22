import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Historia de Instagram (1080x1920) para los pedidos empresariales de fin
// de año, sólo con letras de Herencia (Addington y Acumin; la Sketcha es la
// de Don Patricio): el sello azul arriba, el título, una fila de mates reales (las
// fotos de producto sobre blanco, que con "multiply" se funden con el
// crema) y abajo qué incluye y cómo pedir. Va a publicitarse: en los
// anuncios de historias Meta tapa ~250 px arriba y ~380 px abajo (el botón
// del anuncio), así que todo va entre 250 y 1540.

export const HistoriaEmpresas: React.FC<{
  readonly mates: string[][];
  readonly titulo: string[];
  readonly bajada: string;
  readonly frase: string[];
  readonly destacado: string;
  readonly detalle: string;
  readonly accion: string;
  readonly nota: string;
  readonly letraChica: string;
}> = ({
  mates,
  titulo,
  bajada,
  frase,
  destacado,
  detalle,
  accion,
  nota,
  letraChica,
}) => {
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
        style={{ position: "absolute", top: 250, width: 160 }}
      />
      <div
        style={{
          position: "absolute",
          top: 430,
          left: 70,
          right: 70,
          fontFamily: fonts.serif,
          fontSize: 80,
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
            fontSize: 52,
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
            top: i === 0 ? 685 : 885,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: i === 0 ? 30 : 10,
          }}
        >
          {fila.map((src) => {
            const lado = i === 0 ? 250 : 280;
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
      {/* Abajo, de corrido: la frase, el grabado gratis como sello de
          texto (no botón: va a publicitarse), cómo pedir y la letra chica. */}
      <div
        style={{
          position: "absolute",
          top: 1165,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: colors.azul,
        }}
      >
        <div
          style={{ fontFamily: fonts.acumin, fontSize: 34, lineHeight: 1.35 }}
        >
          {frase.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: fonts.acumin,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: colors.madera,
          }}
        >
          {destacado}
        </div>
        <div
          style={{
            marginTop: 4,
            fontFamily: fonts.serif,
            fontStyle: "italic",
            fontSize: 34,
            color: colors.madera,
          }}
        >
          {detalle}
        </div>
        <div
          style={{
            marginTop: 22,
            width: 90,
            height: 2,
            background: colors.mostaza,
          }}
        />
        <div style={{ marginTop: 14, fontFamily: fonts.serif, fontSize: 46 }}>
          {accion}
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: fonts.serif,
            fontStyle: "italic",
            fontSize: 34,
            color: colors.madera,
          }}
        >
          {nota}
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: fonts.acumin,
            fontSize: 24,
            opacity: 0.7,
          }}
        >
          {letraChica}
        </div>
      </div>
    </AbsoluteFill>
  );
};

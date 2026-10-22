import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Historia de Instagram (1080x1920) para los pedidos empresariales de fin
// de año, pensada como anuncio. Fondo crema y todo en azul (sólo los dos
// colores de la marca, más el de los mates), con las letras de la marca:
// Addington para el título y el llamado, Helvetica Neue para el resto.
// Arriba el título grande a la izquierda con el sello de la marca a su lado
// y la bajada; al medio los mates reales (fotos de producto sobre blanco, que
// con "multiply" se funden con el crema) y, debajo, el beneficio (el grabado
// gratis) entre filetes; abajo, quiénes ya los eligieron y el llamado
// centrado con una flecha hacia abajo. Lo que hay que leer va entre 230 y 1600: Instagram tapa
// arriba el perfil y abajo la respuesta o el botón del anuncio.

const margen = 80;

export const HistoriaEmpresas: React.FC<{
  readonly mates: string[][];
  readonly titulo: string[];
  readonly bajada: string;
  // El beneficio (el grabado gratis).
  readonly beneficio: string;
  // Prueba social: clientes que ya regalaron Herencia, con su logo (el
  // archivo oficial, con permiso del cliente) y el alto al que va cada uno,
  // para que pesen parecido.
  readonly confianza: string;
  readonly logos: [archivo: string, alto: number][];
  readonly accion: string;
}> = ({ mates, titulo, bajada, beneficio, confianza, logos, accion }) => {
  const rotulo: React.CSSProperties = {
    fontFamily: fonts.sans,
    fontWeight: 500,
    fontSize: 22,
    letterSpacing: 3,
    textTransform: "uppercase",
  };
  const filete: React.CSSProperties = {
    position: "absolute",
    left: margen,
    right: margen,
    height: 2,
    background: colors.azul,
    opacity: 0.25,
  };
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.crema,
        fontFamily: fonts.serif,
        color: colors.azul,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 240,
          left: margen,
          fontSize: 108,
          lineHeight: 0.96,
        }}
      >
        {titulo.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          top: 478,
          left: margen,
          fontFamily: fonts.sans,
          fontWeight: 300,
          fontSize: 40,
        }}
      >
        {bajada}
      </div>
      {/* El sello de la marca, grande, al lado del título. */}
      <Img
        src={staticFile("logos/herencia-patria-sello-azul.png")}
        style={{ position: "absolute", top: 248, right: 70, width: 200 }}
      />
      {/* Los mates, grandes: dos filas, la de atrás un poco más chica. */}
      {mates.map((fila, i) => (
        <div
          key={fila.join()}
          style={{
            position: "absolute",
            top: i === 0 ? 575 : 840,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: i === 0 ? 50 : 30,
          }}
        >
          {fila.map((src) => {
            const lado = i === 0 ? 330 : 360;
            return (
              <Img
                key={src}
                src={staticFile(src)}
                style={{
                  width: lado,
                  height: lado,
                  // La foto es cuadrada con mucho blanco a los costados.
                  margin: `0 -${lado * 0.13}px`,
                  mixBlendMode: "multiply",
                }}
              />
            );
          })}
        </div>
      ))}
      {/* El beneficio, bajo los mates: una frase con filetes a los lados. */}
      <div
        style={{
          position: "absolute",
          top: 1180,
          left: margen,
          right: margen,
          display: "flex",
          alignItems: "center",
          gap: 30,
        }}
      >
        <div style={{ flex: 1, height: 2, background: colors.azul }} />
        <div style={{ fontSize: 64, fontStyle: "italic" }}>{beneficio}</div>
        <div style={{ flex: 1, height: 2, background: colors.azul }} />
      </div>
      <div style={{ ...filete, top: 1300 }} />
      {/* Quiénes ya los eligieron: los logos en el azul de la marca, para
          que se vean parejos y no sumen colores. */}
      <div
        style={{
          position: "absolute",
          top: 1324,
          left: 0,
          right: 0,
          textAlign: "center",
          ...rotulo,
        }}
      >
        {confianza}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1366,
          left: margen,
          right: margen,
          height: 80,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {logos.map(([archivo, alto]) => (
          <Img
            key={archivo}
            src={staticFile(archivo)}
            style={{ height: alto }}
          />
        ))}
      </div>
      <div style={{ ...filete, top: 1468 }} />
      {/* El llamado, centrado, con una flecha hacia abajo (hacia la
          respuesta o el botón del anuncio). Texto, no botón. */}
      <div
        style={{
          position: "absolute",
          top: 1492,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 72 }}>{accion}</div>
        <svg
          width={28}
          height={70}
          viewBox="0 0 28 70"
          style={{ marginTop: 14 }}
        >
          <path
            d="M 14 0 V 66 M 2 54 L 14 66 L 26 54"
            fill="none"
            stroke={colors.azul}
            strokeWidth={2}
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

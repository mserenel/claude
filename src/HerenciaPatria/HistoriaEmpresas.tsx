import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Historia de Instagram (1080x1920) para los pedidos empresariales de fin
// de año, pensada como anuncio: un solo mensaje (el título), los mates reales
// como protagonistas, un beneficio bien visible en una franja (el grabado
// gratis) y un llamado corto, con la letra chica al pie. Una sola familia de
// letra (Addington) para que no se vea recargada. En los anuncios de
// historias Meta tapa ~250 px arriba y ~380 px abajo (su botón), así que todo
// va entre 250 y 1540; el llamado es texto, no botón, porque el anuncio ya
// trae el suyo.

export const HistoriaEmpresas: React.FC<{
  readonly mates: string[][];
  readonly antetitulo: string;
  readonly titulo: string[];
  readonly beneficio: string;
  readonly accion: string;
  readonly letraChica: string;
}> = ({ mates, antetitulo, titulo, beneficio, accion, letraChica }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.crema,
        alignItems: "center",
        textAlign: "center",
        fontFamily: fonts.serif,
        color: colors.azul,
      }}
    >
      <Img
        src={staticFile("logos/herencia-patria-sello-azul.png")}
        style={{ position: "absolute", top: 258, width: 120 }}
      />
      <div
        style={{
          position: "absolute",
          top: 410,
          fontSize: 28,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: colors.madera,
        }}
      >
        {antetitulo}
      </div>
      <div
        style={{
          position: "absolute",
          top: 462,
          left: 60,
          right: 60,
          fontSize: 80,
          lineHeight: 1.05,
        }}
      >
        {titulo.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      {/* Dos filas de mates, la de atrás un poco más chica. */}
      {mates.map((fila, i) => (
        <div
          key={fila.join()}
          style={{
            position: "absolute",
            top: i === 0 ? 650 : 930,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: i === 0 ? 30 : 10,
          }}
        >
          {fila.map((src) => {
            const lado = i === 0 ? 320 : 350;
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
      {/* El beneficio: una franja de lado a lado, no un botón. */}
      <div
        style={{
          position: "absolute",
          top: 1252,
          left: 0,
          right: 0,
          padding: "26px 0 30px",
          background: colors.azul,
          color: colors.crema,
          fontSize: 58,
          fontWeight: 600,
        }}
      >
        {beneficio}
      </div>
      <div style={{ position: "absolute", top: 1402, fontSize: 46 }}>
        {accion}
      </div>
      <div
        style={{ position: "absolute", top: 1472, fontSize: 28, opacity: 0.6 }}
      >
        {letraChica}
      </div>
    </AbsoluteFill>
  );
};

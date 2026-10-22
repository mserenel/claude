import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Historia de Instagram (1080x1920) para los pedidos empresariales de fin
// de año, pensada como anuncio. Fondo crema y todo en azul (sólo los dos
// colores de la marca, más el de los mates), con las letras de la marca:
// Addington para el título y el llamado, Helvetica Neue para el resto.
// Arriba el título grande a la izquierda y el sello; el beneficio (el grabado
// gratis) es una etiqueta azul redonda; al medio los mates reales, grandes
// (fotos de producto sobre blanco, que con "multiply" se funden con el
// crema); abajo quiénes ya los eligieron, el llamado y la letra chica, entre
// filetes finos. Lo que hay que leer va entre 230 y 1600: Instagram tapa
// arriba el perfil y abajo la respuesta o el botón del anuncio.

const margen = 80;

export const HistoriaEmpresas: React.FC<{
  readonly mates: string[][];
  readonly titulo: string[];
  readonly bajada: string;
  // La etiqueta: arriba, grande y abajo.
  readonly etiqueta: [string, string, string];
  // Prueba social: clientes que ya regalaron Herencia, con su logo (el
  // archivo oficial, con permiso del cliente). Sin archivo, un recuadro marca
  // el lugar: esa versión no es para publicar.
  readonly confianza: string;
  readonly logos: string[];
  readonly accion: string;
  readonly letraChica: string;
}> = ({
  mates,
  titulo,
  bajada,
  etiqueta,
  confianza,
  logos,
  accion,
  letraChica,
}) => {
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
          top: 235,
          left: margen,
          fontSize: 124,
          lineHeight: 0.96,
        }}
      >
        {titulo.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      <Img
        src={staticFile("logos/herencia-patria-sello-azul.png")}
        style={{ position: "absolute", top: 240, right: margen, width: 120 }}
      />
      <div
        style={{
          position: "absolute",
          top: 490,
          left: margen,
          fontFamily: fonts.sans,
          fontWeight: 300,
          fontSize: 40,
        }}
      >
        {bajada}
      </div>
      {/* El beneficio: una etiqueta redonda, inclinada, sobre los mates. */}
      <div
        style={{
          position: "absolute",
          top: 440,
          right: 60,
          width: 230,
          height: 230,
          borderRadius: "50%",
          background: colors.azul,
          color: colors.crema,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          transform: "rotate(-8deg)",
          zIndex: 1,
        }}
      >
        <div style={rotulo}>{etiqueta[0]}</div>
        <div style={{ fontSize: 72, lineHeight: 1, margin: "2px 0 6px" }}>
          {etiqueta[1]}
        </div>
        <div style={{ fontFamily: fonts.sans, fontWeight: 300, fontSize: 26 }}>
          {etiqueta[2]}
        </div>
      </div>
      {/* Los mates, grandes: dos filas, la de atrás un poco más chica. */}
      {mates.map((fila, i) => (
        <div
          key={fila.join()}
          style={{
            position: "absolute",
            top: i === 0 ? 615 : 915,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: i === 0 ? 20 : 0,
          }}
        >
          {fila.map((src) => {
            const lado = i === 0 ? 390 : 420;
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
      <div style={{ ...filete, top: 1310 }} />
      {/* Quiénes ya los eligieron. */}
      <div
        style={{
          position: "absolute",
          top: 1336,
          left: margen,
          right: margen,
          height: 70,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={rotulo}>{confianza}</div>
        {logos.length > 0 ? (
          logos.map((l) => (
            <Img key={l} src={staticFile(l)} style={{ height: 56 }} />
          ))
        ) : (
          <div
            style={{
              width: 260,
              height: 64,
              border: `2px dashed ${colors.azul}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.sans,
              fontSize: 22,
              opacity: 0.6,
            }}
          >
            logo del cliente
          </div>
        )}
      </div>
      <div style={{ ...filete, top: 1430 }} />
      {/* El llamado: texto, no botón (el anuncio trae el suyo). */}
      <div
        style={{
          position: "absolute",
          top: 1462,
          left: margen,
          fontSize: 58,
        }}
      >
        {accion}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1545,
          left: margen,
          fontFamily: fonts.sans,
          fontWeight: 300,
          fontSize: 26,
        }}
      >
        {letraChica}
      </div>
    </AbsoluteFill>
  );
};

import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Historia de Instagram (1080x1920) para los pedidos empresariales de fin
// de año, pensada como anuncio. Fondo crema y todo en azul (sólo los dos
// colores de la marca, más el de los mates), con las letras de la marca:
// Addington para el título y el llamado, Helvetica Neue para el resto.
// Arriba el título grande a la izquierda y, a su lado, el beneficio (el
// grabado gratis) como un sello tipo lacre; al medio los mates reales,
// grandes (fotos de producto sobre blanco, que con "multiply" se funden con
// el crema); abajo, entre filetes finos, quiénes ya los eligieron, y el
// llamado con una flecha y el sello de la marca. Lo que hay que leer va entre 230 y 1600: Instagram tapa
// arriba el perfil y abajo la respuesta o el botón del anuncio.

const margen = 80;

export const HistoriaEmpresas: React.FC<{
  readonly mates: string[][];
  readonly titulo: string[];
  readonly bajada: string;
  // El sello del beneficio: la leyenda del anillo, grande al centro y arriba
  // de lo grande.
  readonly etiqueta: [string, string, string];
  // Prueba social: clientes que ya regalaron Herencia, con su logo (el
  // archivo oficial, con permiso del cliente). Sin archivo, un recuadro marca
  // el lugar: esa versión no es para publicar.
  readonly confianza: string;
  readonly logos: string[];
  readonly accion: string;
}> = ({ mates, titulo, bajada, etiqueta, confianza, logos, accion }) => {
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
      {/* El beneficio: un sello azul al lado del título, como un lacre, con
          la leyenda en el anillo y "gratis" grande al centro. Lejos de los
          mates, para que no los tape. */}
      <svg
        viewBox="0 0 260 260"
        style={{
          position: "absolute",
          top: 250,
          right: 56,
          width: 260,
          height: 260,
          transform: "rotate(-10deg)",
        }}
      >
        <defs>
          <path
            id="anillo"
            d="M 130,130 m -100,0 a 100,100 0 1,1 200,0 a 100,100 0 1,1 -200,0"
          />
        </defs>
        <circle cx={130} cy={130} r={128} fill={colors.azul} />
        <circle
          cx={130}
          cy={130}
          r={78}
          fill="none"
          stroke={colors.crema}
          strokeWidth={1.5}
          strokeDasharray="3 5"
        />
        <text
          fill={colors.crema}
          fontFamily={fonts.sans}
          fontWeight={500}
          fontSize={17}
          style={{ textTransform: "uppercase" }}
        >
          <textPath href="#anillo" textLength={622} lengthAdjust="spacing">
            {etiqueta[0]}
          </textPath>
        </text>
        <text
          x={130}
          y={112}
          textAnchor="middle"
          fill={colors.crema}
          fontFamily={fonts.sans}
          fontWeight={500}
          fontSize={18}
          letterSpacing={3}
          style={{ textTransform: "uppercase" }}
        >
          {etiqueta[2]}
        </text>
        <text
          x={130}
          y={158}
          textAnchor="middle"
          fill={colors.crema}
          fontFamily={fonts.serif}
          fontSize={54}
        >
          {etiqueta[1]}
        </text>
      </svg>
      {/* Los mates, grandes: dos filas, la de atrás un poco más chica. */}
      {mates.map((fila, i) => (
        <div
          key={fila.join()}
          style={{
            position: "absolute",
            top: i === 0 ? 590 : 900,
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
      {/* El llamado: texto con una flecha fina, no botón (el anuncio trae
          el suyo), y el sello de la marca al lado. */}
      <div
        style={{
          position: "absolute",
          top: 1458,
          left: margen,
          right: margen,
          display: "flex",
          alignItems: "center",
          gap: 26,
        }}
      >
        <div style={{ fontSize: 72 }}>{accion}</div>
        <svg width={110} height={24} viewBox="0 0 110 24">
          <path
            d="M 0 12 H 106 M 94 2 L 106 12 L 94 22"
            fill="none"
            stroke={colors.azul}
            strokeWidth={2}
          />
        </svg>
        <Img
          src={staticFile("logos/herencia-patria-sello-azul.png")}
          style={{ marginLeft: "auto", width: 110 }}
        />
      </div>
    </AbsoluteFill>
  );
};

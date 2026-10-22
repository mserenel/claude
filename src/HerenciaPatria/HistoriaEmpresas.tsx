import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Historia de Instagram (1080x1920) para los pedidos empresariales de fin
// de año, pensada como anuncio. Tres franjas: arriba, en azul, el título
// grande alineado a la izquierda y el sello; al medio, en crema, los mates
// reales (fotos de producto sobre blanco, que con "multiply" se funden con
// el crema) y quiénes ya los eligieron; abajo, otra vez en azul, el llamado y
// la letra chica. El beneficio (el grabado gratis) es una etiqueta dorada
// entre la franja de arriba y los mates. Sólo azul, crema y dorado, y una
// sola familia de letra. En los anuncios de historias Meta tapa ~250 px
// arriba y ~380 px abajo (su botón): lo que hay que leer va entre 250 y
// 1540, y las franjas azules llenan el resto.

const margen = 80;

export const HistoriaEmpresas: React.FC<{
  readonly mates: string[][];
  readonly titulo: string[];
  readonly bajada: string;
  // La etiqueta: arriba (versalitas), grande y abajo.
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
  const versalitas: React.CSSProperties = {
    fontSize: 24,
    letterSpacing: 4,
    textTransform: "uppercase",
  };
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.crema,
        fontFamily: fonts.serif,
        color: colors.azul,
      }}
    >
      {/* Arriba: título y sello. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 650,
          background: colors.azul,
          color: colors.crema,
        }}
      >
        <Img
          src={staticFile("logo-herencia-patria.png")}
          style={{
            position: "absolute",
            top: 270,
            right: margen,
            width: 130,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 290,
            left: margen,
            fontSize: 116,
            lineHeight: 0.98,
          }}
        >
          {titulo.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            top: 545,
            left: margen,
            fontSize: 38,
            color: colors.mostaza,
          }}
        >
          {bajada}
        </div>
      </div>
      {/* El beneficio: una etiqueta redonda, inclinada, mitad sobre el azul. */}
      <div
        style={{
          position: "absolute",
          top: 545,
          right: 70,
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: colors.mostaza,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          transform: "rotate(-8deg)",
          boxShadow: "0 6px 18px rgba(20,35,59,0.25)",
        }}
      >
        <div style={versalitas}>{etiqueta[0]}</div>
        <div style={{ fontSize: 76, lineHeight: 1, margin: "4px 0 6px" }}>
          {etiqueta[1]}
        </div>
        <div style={{ fontSize: 28 }}>{etiqueta[2]}</div>
      </div>
      {/* Los mates: dos filas, la de atrás un poco más chica. */}
      {mates.map((fila, i) => (
        <div
          key={fila.join()}
          style={{
            position: "absolute",
            top: i === 0 ? 755 : 1000,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: i === 0 ? 30 : 10,
          }}
        >
          {fila.map((src) => {
            const lado = i === 0 ? 300 : 330;
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
      {/* Quiénes ya los eligieron. */}
      <div
        style={{
          position: "absolute",
          top: 1330,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 36,
        }}
      >
        <div style={{ ...versalitas, opacity: 0.75 }}>{confianza}</div>
        {logos.length > 0 ? (
          logos.map((l) => (
            <Img key={l} src={staticFile(l)} style={{ height: 56 }} />
          ))
        ) : (
          <div
            style={{
              width: 240,
              height: 64,
              border: `2px dashed ${colors.azul}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              opacity: 0.6,
            }}
          >
            logo del cliente
          </div>
        )}
      </div>
      {/* Abajo: el llamado (texto, no botón: el anuncio trae el suyo). */}
      <div
        style={{
          position: "absolute",
          top: 1425,
          left: 0,
          right: 0,
          bottom: 0,
          background: colors.azul,
          color: colors.crema,
          paddingTop: 28,
          paddingLeft: margen,
        }}
      >
        <div style={{ fontSize: 46 }}>{accion}</div>
        <div
          style={{ ...versalitas, fontSize: 20, marginTop: 10, opacity: 0.7 }}
        >
          {letraChica}
        </div>
      </div>
    </AbsoluteFill>
  );
};

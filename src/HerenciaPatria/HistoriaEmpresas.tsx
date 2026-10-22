import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Historia de Instagram (1080x1920) para los pedidos empresariales de fin
// de año, pensada como anuncio: qué es (el título), los mates reales como
// protagonistas, el beneficio (el grabado gratis) en un bloque azul hasta abajo,
// quiénes ya los eligieron y un llamado corto, con la letra chica al pie. Una sola familia de
// letra (Addington) para que no se vea recargada. En los anuncios de
// historias Meta tapa ~250 px arriba y ~380 px abajo (su botón), así que todo
// va entre 250 y 1540; el llamado es texto, no botón, porque el anuncio ya
// trae el suyo.

export const HistoriaEmpresas: React.FC<{
  readonly mates: string[][];
  readonly titulo: string;
  readonly bajada: string;
  readonly beneficio: string;
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
  beneficio,
  confianza,
  logos,
  accion,
  letraChica,
}) => {
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
        style={{ position: "absolute", top: 268, width: 130 }}
      />
      <div style={{ position: "absolute", top: 425, fontSize: 86 }}>
        {titulo}
      </div>
      <div
        style={{
          position: "absolute",
          top: 528,
          fontSize: 42,
          color: colors.madera,
        }}
      >
        {bajada}
      </div>
      {/* Dos filas de mates, la de atrás un poco más chica. */}
      {mates.map((fila, i) => (
        <div
          key={fila.join()}
          style={{
            position: "absolute",
            top: i === 0 ? 600 : 850,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: i === 0 ? 30 : 10,
          }}
        >
          {fila.map((src) => {
            const lado = i === 0 ? 310 : 340;
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
          top: 1188,
          fontSize: 24,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: colors.madera,
        }}
      >
        {confianza}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1230,
          height: 70,
          display: "flex",
          gap: 50,
          alignItems: "center",
        }}
      >
        {logos.length > 0 ? (
          logos.map((l) => (
            <Img key={l} src={staticFile(l)} style={{ height: 60 }} />
          ))
        ) : (
          <div
            style={{
              width: 280,
              height: 70,
              border: `2px dashed ${colors.madera}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              color: colors.madera,
            }}
          >
            logo del cliente
          </div>
        )}
      </div>
      {/* Bloque azul hasta abajo: el beneficio, el llamado y la letra chica.
          Llena el pie (donde en el anuncio va el botón de Meta) y no parece
          un botón. */}
      <div
        style={{
          position: "absolute",
          top: 1335,
          left: 0,
          right: 0,
          bottom: 0,
          background: colors.azul,
          color: colors.crema,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 26,
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 600 }}>{beneficio}</div>
        <div
          style={{
            marginTop: 14,
            width: 80,
            height: 2,
            background: colors.mostaza,
          }}
        />
        <div style={{ marginTop: 14, fontSize: 40 }}>{accion}</div>
        <div style={{ marginTop: 6, fontSize: 24, opacity: 0.7 }}>
          {letraChica}
        </div>
      </div>
    </AbsoluteFill>
  );
};

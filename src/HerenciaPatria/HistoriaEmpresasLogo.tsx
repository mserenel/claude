import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Historia de Instagram (1080x1920) para los pedidos empresariales de fin
// de año que muestra el beneficio en el producto: el aro de la boca de un
// mate, grande, con "grabado gratis" grabado en el metal, justo donde va el
// logo de la empresa. Al lado, más chicos, otros modelos; abajo
// quiénes ya los eligieron y el llamado con una flecha hacia abajo.
// Crema y azul, Addington y Helvetica Neue, como el resto de la marca. Lo que
// hay que leer va entre 230 y 1620: Instagram tapa arriba el perfil y abajo
// la respuesta o el botón del anuncio.

const margen = 80;

export const HistoriaEmpresasLogo: React.FC<{
  readonly titulo: string[];
  readonly bajada: string[];
  // El mate grande, visto desde arriba y recortado en círculo justo en el
  // borde del aro (la foto real, sin el fondo), y lo que va grabado en el
  // aro: una palabra arriba y otra abajo.
  readonly heroe: string;
  readonly grabado: [arriba: string, abajo: string];
  readonly otros: string[];
  readonly confianza: string;
  readonly logos: [archivo: string, alto: number][];
  readonly accion: string;
}> = ({ titulo, bajada, heroe, grabado, otros, confianza, logos, accion }) => {
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
  // El mate grande, a la izquierda.
  const lado = 520;
  const x0 = 40;
  const y0 = 620;
  // Los otros modelos: una grilla chica a la derecha del aro.
  const chico = 200;
  const xGrilla = 570;
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
      <Img
        src={staticFile("logos/herencia-patria-sello-azul.png")}
        style={{ position: "absolute", top: 248, right: 70, width: 200 }}
      />
      <div
        style={{
          position: "absolute",
          top: 472,
          left: margen,
          fontFamily: fonts.sans,
          fontWeight: 300,
          fontSize: 38,
          lineHeight: 1.25,
        }}
      >
        {bajada.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      <Img
        src={staticFile(heroe)}
        style={{
          position: "absolute",
          top: y0,
          left: x0,
          width: lado,
          height: lado,
          filter: "drop-shadow(0 18px 24px rgba(20,35,59,0.28))",
        }}
      />
      {/* El grabado en el aro, una palabra arriba y otra abajo (las dos
          derechas), grandes y en negrita para que se lean en el teléfono:
          letras oscuras con un brillo apenas corrido hacia abajo, como
          talladas en el metal. Coordenadas de la foto (948 px). */}
      <svg
        viewBox="0 0 948 948"
        style={{
          position: "absolute",
          top: y0,
          left: x0,
          width: lado,
          height: lado,
        }}
      >
        <defs>
          <path
            id="grabadoArriba"
            d="M 129.1 344.8 A 366 366 0 0 1 816.9 344.8"
          />
          <path
            id="grabadoAbajo"
            d="M 70.8 616.4 A 428 428 0 0 0 875.2 616.4"
          />
        </defs>
        {(["grabadoArriba", "grabadoAbajo"] as const).map((arco, k) =>
          [
            { dy: 4, fill: "rgba(255,255,255,0.85)" },
            { dy: 0, fill: "#14110e" },
          ].map(({ dy, fill }) => (
            <text
              key={arco + fill}
              transform={`translate(0 ${dy})`}
              fill={fill}
              fontFamily={fonts.serif}
              fontWeight={700}
              fontSize={98}
              letterSpacing={8}
              textAnchor="middle"
            >
              <textPath href={`#${arco}`} startOffset="50%">
                {grabado[k].toUpperCase()}
              </textPath>
            </text>
          )),
        )}
      </svg>
      {/* Los otros modelos: dos filas de tres, cada una sobre una tabla de
          madera fina (la madera real del ranchero, con la veta acostada y el
          color apagado). La tabla va antes que los mates: con "multiply" la
          sombra de cada mate cae sobre la madera. */}
      {[otros.slice(0, 3), otros.slice(3)].map((fila, i) => {
        const top = y0 + lado / 2 - chico * 0.98 + i * chico * 0.96;
        // Donde apoyan los mates: el pie de la foto de producto.
        const apoyo = top + chico * 0.83;
        // Una franja de la foto de la madera, recortada a la altura de la cara.
        const madera = (alto: number, desde: number, luz: number) => (
          <div style={{ height: alto, overflow: "hidden" }}>
            <Img
              src={staticFile("tabla-madera.jpg")}
              style={{
                width: "100%",
                marginTop: -desde,
                filter: `brightness(${luz})`,
              }}
            />
          </div>
        );
        return (
          <div key={fila.join()}>
            <div
              style={{
                position: "absolute",
                top: apoyo - 4,
                left: xGrilla + 14,
                right: 34,
                boxShadow: "0 10px 14px -6px rgba(20,35,59,0.35)",
              }}
            >
              {madera(10, 0, 1.12)}
              {madera(15, 40, 0.72)}
            </div>
            <div
              style={{
                position: "absolute",
                top,
                left: xGrilla,
                right: 30,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {fila.map((src) => (
                <Img
                  key={src}
                  src={staticFile(src)}
                  style={{
                    width: chico,
                    height: chico,
                    margin: `0 -${chico * 0.11}px`,
                    mixBlendMode: "multiply",
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
      <div style={{ ...filete, top: 1250 }} />
      {/* Quiénes ya los eligieron: los logos en el azul de la marca. */}
      <div
        style={{
          position: "absolute",
          top: 1274,
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
          top: 1316,
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
      <div style={{ ...filete, top: 1418 }} />
      {/* El llamado, centrado, con una flecha hacia abajo. Texto, no botón. */}
      <div
        style={{
          position: "absolute",
          top: 1446,
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

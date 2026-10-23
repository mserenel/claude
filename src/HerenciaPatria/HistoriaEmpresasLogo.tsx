import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Historia de Instagram (1080x1920) para los pedidos empresariales de fin
// de año. Los protagonistas son los mates: seis modelos reales en dos
// estantes de madera a todo el ancho (arriba los de calabaza, apenas más
// grandes; abajo los de algarrobo). Debajo, chico, el aro de la boca de un
// mate con yerba y "grabado gratis" grabado en el metal (donde va el logo de
// la empresa), y al lado la fecha límite. Abajo, quiénes ya los eligieron y
// el llamado con una flecha hacia abajo. Crema y azul, Addington y Helvetica
// Neue, como el resto de la marca. Lo que hay que leer va entre 230 y 1700:
// Instagram tapa arriba el perfil y abajo la respuesta o el botón del anuncio.

const margen = 80;

export const HistoriaEmpresasLogo: React.FC<{
  readonly titulo: string[];
  readonly bajada: string[];
  // Arriba los de calabaza, abajo los de algarrobo (tres y tres): recortes con
  // su sombra de contacto debajo (tools/recorte_mate.py).
  readonly mates: string[];
  // El aro: la boca de un mate vista desde arriba, recortada en círculo justo
  // en el borde (foto real, con yerba), y lo que va grabado en el metal: una
  // palabra arriba y otra abajo.
  readonly aro: string;
  readonly grabado: [arriba: string, abajo: string];
  // La fecha límite: lo chico de arriba y lo grande.
  readonly urgencia: [string, string];
  // El beneficio dicho en palabras, bajo la fecha.
  readonly beneficio: string;
  readonly confianza: string;
  readonly logos: [archivo: string, alto: number][];
  readonly accion: string;
}> = ({
  titulo,
  bajada,
  mates,
  aro,
  grabado,
  urgencia,
  beneficio,
  confianza,
  logos,
  accion,
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
  // Los estantes: dónde apoyan los mates de cada fila y su alto (los de
  // calabaza son algo más grandes que los de algarrobo, como en la realidad).
  const apoyos = [852, 1092];
  const altoFila = [248, 204];
  // Los recortes traen debajo de la base su sombra de contacto: 24 px más
  // cada 700 de mate.
  const conPie = 724 / 700;
  // El aro, chico, abajo a la izquierda.
  const ladoAro = 236;
  const yAro = 1140;
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
      {/* Los mates en dos estantes de madera fina (la madera real del
          ranchero, con la veta acostada y el color apagado), apoyados sobre
          la cara de arriba de la tabla. */}
      {[mates.slice(0, 3), mates.slice(3)].map((fila, i) => {
        const apoyo = apoyos[i];
        const alto = altoFila[i];
        return (
          <div key={fila.join()}>
            <div
              style={{
                position: "absolute",
                top: apoyo - 26,
                left: margen - 10,
                right: margen - 10,
                boxShadow: "0 12px 16px -6px rgba(20,35,59,0.35)",
              }}
            >
              {madera(36, 0, 1.08)}
              {madera(18, 60, 0.7)}
            </div>
            <div
              style={{
                position: "absolute",
                top: apoyo + 5 - alto,
                left: margen,
                right: margen,
                height: alto * conPie,
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "flex-end",
              }}
            >
              {fila.map((src) => (
                <Img
                  key={src}
                  src={staticFile(src)}
                  style={{ display: "block", height: alto * conPie }}
                />
              ))}
            </div>
          </div>
        );
      })}
      {/* El aro con el grabado, en curva arriba y abajo, como tallado en el
          metal. Coordenadas de la foto (948 px). */}
      <Img
        src={staticFile(aro)}
        style={{
          position: "absolute",
          top: yAro,
          left: margen,
          width: ladoAro,
          height: ladoAro,
          filter: "drop-shadow(0 10px 14px rgba(20,35,59,0.28))",
        }}
      />
      <svg
        viewBox="0 0 948 948"
        style={{
          position: "absolute",
          top: yAro,
          left: margen,
          width: ladoAro,
          height: ladoAro,
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
      {/* La fecha límite, al lado del aro. */}
      <div
        style={{
          position: "absolute",
          top: yAro + 40,
          left: margen + ladoAro + 44,
          right: margen,
        }}
      >
        <div style={rotulo}>{urgencia[0]}</div>
        <div style={{ fontSize: 66, lineHeight: 1.05, marginTop: 8 }}>
          {urgencia[1]}
        </div>
        <div
          style={{
            fontFamily: fonts.sans,
            fontWeight: 300,
            fontSize: 30,
            marginTop: 14,
          }}
        >
          {beneficio}
        </div>
      </div>
      <div style={{ ...filete, top: 1408 }} />
      {/* Quiénes ya los eligieron: los logos en el azul de la marca. */}
      <div
        style={{
          position: "absolute",
          top: 1428,
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
          top: 1466,
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
      <div style={{ ...filete, top: 1566 }} />
      {/* El llamado, centrado, con una flecha hacia abajo. Texto, no botón. */}
      <div
        style={{
          position: "absolute",
          top: 1584,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 66 }}>{accion}</div>
        <svg
          width={26}
          height={56}
          viewBox="0 0 26 56"
          style={{ marginTop: 8 }}
        >
          <path
            d="M 13 0 V 52 M 2 41 L 13 52 L 24 41"
            fill="none"
            stroke={colors.azul}
            strokeWidth={2}
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Historia de Instagram (1080x1920) para los pedidos empresariales de fin
// de año. Los protagonistas son los mates: seis modelos reales, sin efectos,
// en dos filas sobre el crema (arriba los de calabaza, apenas más grandes;
// abajo los de algarrobo). Debajo, sólo tipografía: el beneficio y la fecha
// límite en dos columnas. Abajo, quiénes ya los eligieron y el llamado con
// una flecha hacia abajo. Crema y azul, Addington y Helvetica Neue, como el
// resto de la marca. Lo que hay que leer va entre 230 y 1700:
// Instagram tapa arriba el perfil y abajo la respuesta o el botón del anuncio.

const margen = 80;

export const HistoriaEmpresasLogo: React.FC<{
  readonly titulo: string[];
  readonly bajada: string[];
  // Arriba los de calabaza, abajo los de algarrobo (tres y tres): recortes con
  // su sombra de contacto debajo (tools/recorte_mate.py).
  readonly mates: string[];
  // El beneficio y la fecha límite: lo chico de arriba y lo grande.
  readonly beneficio: [string, string];
  readonly urgencia: [string, string];
  readonly confianza: string;
  readonly logos: [archivo: string, alto: number][];
  readonly accion: string;
}> = ({
  titulo,
  bajada,
  mates,
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
  // Las filas: dónde apoyan los mates de cada fila y su alto (los de
  // calabaza son algo más grandes que los de algarrobo, como en la realidad).
  const apoyos = [810, 1050];
  const altoFila = [205, 172];
  // Los recortes traen debajo de la base su sombra de contacto: 24 px más
  // cada 700 de mate.
  const conPie = 724 / 700;
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
      {/* Los mates, reales, en dos filas sobre el crema (sin estantes ni
          efectos), cada uno con su sombra de contacto. */}
      {[mates.slice(0, 3), mates.slice(3)].map((fila, i) => {
        const apoyo = apoyos[i];
        const alto = altoFila[i];
        return (
          <div
            key={fila.join()}
            style={{
              position: "absolute",
              top: apoyo - alto,
              left: margen + 30,
              right: margen + 30,
              height: alto * conPie,
              display: "flex",
              justifyContent: "space-between",
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
        );
      })}
      {/* El beneficio y la fecha límite: tipografía, dos columnas. */}
      <div style={{ ...filete, top: 1138 }} />
      <div
        style={{
          position: "absolute",
          top: 1168,
          left: margen,
          right: margen,
          display: "flex",
        }}
      >
        {[beneficio, urgencia].map(([chico, grande], k) => (
          <div
            key={chico}
            style={{
              flex: 1,
              paddingLeft: k === 1 ? 44 : 0,
              borderLeft: k === 1 ? `2px solid rgba(20,35,59,0.25)` : undefined,
            }}
          >
            <div style={rotulo}>{chico}</div>
            <div style={{ fontSize: 58, lineHeight: 1.05, marginTop: 10 }}>
              {grande}
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...filete, top: 1330 }} />
      {/* Quiénes ya los eligieron: los logos en el azul de la marca. */}
      <div
        style={{
          position: "absolute",
          top: 1352,
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
          top: 1392,
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
      <div style={{ ...filete, top: 1494 }} />
      {/* El llamado, centrado, con una flecha hacia abajo. Texto, no botón. */}
      <div
        style={{
          position: "absolute",
          top: 1516,
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

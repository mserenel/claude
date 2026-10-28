import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Historia de Instagram (1080x1920) para los pedidos empresariales de fin
// de año. Fondo azul y letras crema, para que la alpaca y el dorado de las
// virolas se luzcan. Los mates, fotos del catálogo, van agrupados como en una
// foto de familia, en zigzag: uno atrás (algarrobo, más chico y apoyado un poco más
// arriba) y uno adelante (calabaza), que lo tapa apenas de costado. Debajo, el beneficio y la
// fecha límite en dos columnas; abajo, quiénes ya los eligieron y el llamado
// con una flecha hacia abajo. Addington y Helvetica Neue, como el resto de la
// marca. Lo que hay que leer va entre 230 y 1700: Instagram tapa arriba el
// perfil y abajo la respuesta o el botón del anuncio.

const margen = 80;

// El grupo: el centro del primer mate y la distancia entre uno y otro.
const desde = 139;
const paso = 165;
// Atrás (algarrobo) y adelante (calabaza): dónde apoyan y su alto.
const atras = { apoyo: 935, alto: 235 };
const adelante = { apoyo: 980, alto: 270 };
// Los recortes traen debajo de la base su sombra de contacto: 24 px más cada
// 700 de mate.
const conPie = 724 / 700;

export const HistoriaEmpresasLogo: React.FC<{
  readonly titulo: string[];
  readonly bajada: string[];
  // Primero los tres de calabaza (adelante), después los tres de algarrobo
  // (atrás): recortes con su sombra de contacto (tools/recorte_mate.py).
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
    background: colors.crema,
    opacity: 0.3,
  };
  // Los de atrás van en los lugares pares (0, 2, 4) y los de adelante en
  // los impares.
  const fila = (srcs: string[], { apoyo, alto }: typeof atras, lado: number) =>
    srcs.map((src, i) => (
      <Img
        key={src}
        src={staticFile(src)}
        style={{
          position: "absolute",
          top: apoyo - alto,
          left: desde + (2 * i + lado) * paso,
          height: alto * conPie,
          transform: "translateX(-50%)",
        }}
      />
    ));
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.azul,
        fontFamily: fonts.serif,
        color: colors.crema,
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
        src={staticFile("logos/herencia-patria-sello-crema.png")}
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
      {/* El grupo: primero los de atrás, para que los de adelante los tapen. */}
      {fila(mates.slice(3), atras, 0)}
      {fila(mates.slice(0, 3), adelante, 1)}
      {/* El beneficio y la fecha límite: tipografía, dos columnas. */}
      <div style={{ ...filete, top: 1100 }} />
      <div
        style={{
          position: "absolute",
          top: 1128,
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
              borderLeft:
                k === 1 ? `2px solid rgba(243,235,221,0.3)` : undefined,
            }}
          >
            <div style={{ ...rotulo, opacity: 0.75 }}>{chico}</div>
            <div style={{ fontSize: 58, lineHeight: 1.05, marginTop: 10 }}>
              {grande}
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...filete, top: 1278 }} />
      {/* Quiénes ya los eligieron: los logos en crema. */}
      <div
        style={{
          position: "absolute",
          top: 1300,
          left: 0,
          right: 0,
          textAlign: "center",
          ...rotulo,
          opacity: 0.75,
        }}
      >
        {confianza}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1340,
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
      <div style={{ ...filete, top: 1442 }} />
      {/* El llamado, centrado, con una flecha hacia abajo. Texto, no botón. */}
      <div
        style={{
          position: "absolute",
          top: 1464,
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
            stroke={colors.crema}
            strokeWidth={2}
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

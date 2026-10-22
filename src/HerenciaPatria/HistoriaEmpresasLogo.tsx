import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Historia de Instagram (1080x1920) para los pedidos empresariales de fin
// de año que muestra el beneficio en el producto: un mate grande y una línea
// que señala el lugar de la virola donde va el logo de la empresa ("acá va
// tu logo, grabado gratis"). Al lado, más chicos, otros modelos; abajo
// quiénes ya los eligieron y el llamado con una flecha hacia abajo.
// Crema y azul, Addington y Helvetica Neue, como el resto de la marca. Lo que
// hay que leer va entre 230 y 1620: Instagram tapa arriba el perfil y abajo
// la respuesta o el botón del anuncio.

const margen = 80;

export const HistoriaEmpresasLogo: React.FC<{
  readonly titulo: string[];
  readonly bajada: string;
  // El mate grande (foto de producto cuadrada sobre blanco) y el punto de la
  // virola donde va el logo, en fracción del ancho y del alto de la foto.
  readonly heroe: string;
  readonly punto: [x: number, y: number];
  readonly anotacion: [string, string];
  readonly otros: string[];
  readonly confianza: string;
  readonly logos: [archivo: string, alto: number][];
  readonly accion: string;
}> = ({
  titulo,
  bajada,
  heroe,
  punto,
  anotacion,
  otros,
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
  // El mate grande, a la izquierda.
  const lado = 760;
  const x0 = -70;
  const y0 = 530;
  const px = x0 + punto[0] * lado;
  const py = y0 + punto[1] * lado;
  const xTexto = 610;
  // Los otros modelos: una grilla chica a la derecha, bajo la anotación.
  const chico = 175;
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
          top: 478,
          left: margen,
          fontFamily: fonts.sans,
          fontWeight: 300,
          fontSize: 40,
        }}
      >
        {bajada}
      </div>
      <Img
        src={staticFile(heroe)}
        style={{
          position: "absolute",
          top: y0,
          left: x0,
          width: lado,
          height: lado,
          mixBlendMode: "multiply",
        }}
      />
      {/* La anotación: un punto sobre la virola, una línea fina y el texto. */}
      <svg
        style={{ position: "absolute", top: 0, left: 0 }}
        width={1080}
        height={1920}
      >
        <circle
          cx={px}
          cy={py}
          r={13}
          fill="none"
          stroke={colors.azul}
          strokeWidth={3}
        />
        <circle cx={px} cy={py} r={4} fill={colors.azul} />
        <path
          d={`M ${px + 13} ${py} H ${xTexto - 24}`}
          stroke={colors.azul}
          strokeWidth={2}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: py - 46,
          left: xTexto,
          right: 60,
        }}
      >
        <div style={{ fontSize: 56, lineHeight: 1 }}>{anotacion[0]}</div>
        <div
          style={{ ...rotulo, fontWeight: 700, fontSize: 26, marginTop: 14 }}
        >
          {anotacion[1]}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: py + 120,
          left: xTexto - 30,
          width: 3 * chico * 0.78,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          rowGap: 0,
        }}
      >
        {otros.map((src) => (
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

import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Historia de Instagram (1080x1920) para los pedidos empresariales de fin
// de año, pensada para quien compra en una empresa: lo que necesita saber
// para cotizar sin miedo a quedar mal. Fondo azul y letras crema. Arriba el
// título; al medio, a la izquierda, la boca de un mate grabado con "TU LOGO"
// (la prueba de cómo queda) y a la derecha los datos duros (precio, mínimo,
// grabado). Después, los seis modelos en fila sobre una franja crema,
// quiénes ya los eligieron y el llamado con una flecha hacia abajo. Las
// letras del brandbook: Addington CF Medium para los titulares y Helvetica
// LT Std para los textos.
// Lo que hay que leer va entre 230 y 1700: Instagram tapa arriba el perfil y
// abajo la respuesta o el botón del anuncio.

const margen = 80;
// Los recortes traen debajo de la base su sombra de contacto: 24 px más cada
// 700 de mate.
const conPie = 724 / 700;

export const HistoriaEmpresasLogo: React.FC<{
  readonly titulo: string[];
  readonly bajada: string[];
  // Foto real de un grabado en la boca del mate (con "TU LOGO" en lugar del
  // logo del cliente: tools/grabado_tu_logo.py).
  readonly grabado: { readonly foto: string };
  // Los datos duros: rótulo chico y valor grande.
  readonly datos: [rotulo: string, valor: string][];
  // Los seis modelos, con su alto en la fila (los de calabaza son algo más
  // grandes): recortes con su sombra de contacto (tools/recorte_mate.py).
  readonly mates: [archivo: string, alto: number][];
  readonly confianza: string;
  readonly logos: [archivo: string, alto: number][];
  readonly accion: string;
}> = ({ titulo, bajada, grabado, datos, mates, confianza, logos, accion }) => {
  const rotulo: React.CSSProperties = {
    fontFamily: fonts.texto,
    fontWeight: 400,
    fontSize: 20,
    letterSpacing: 3,
    textTransform: "uppercase",
    opacity: 0.75,
  };
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.azul,
        fontFamily: fonts.serif,
        fontWeight: 500,
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
          fontFamily: fonts.texto,
          fontWeight: 300,
          fontSize: 38,
          lineHeight: 1.25,
        }}
      >
        {bajada.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      {/* La prueba: la boca de un mate grabado, vista de arriba y recortada
          por su borde real. */}
      <Img
        src={staticFile(grabado.foto)}
        style={{ position: "absolute", top: 612, left: margen, height: 450 }}
      />
      {/* Los datos duros, al costado, uno debajo del otro. */}
      <div
        style={{
          position: "absolute",
          top: 650,
          left: 600,
          right: margen,
        }}
      >
        {datos.map(([r, v], i) => (
          <div
            key={r}
            style={{
              borderTop:
                i === 0 ? undefined : `2px solid rgba(243,235,221,0.3)`,
              padding: "22px 0",
            }}
          >
            <div style={rotulo}>{r}</div>
            <div style={{ fontSize: 46, lineHeight: 1.1, marginTop: 10 }}>
              {v}
            </div>
          </div>
        ))}
      </div>
      {/* Los seis modelos, en fila, apoyados sobre una franja crema a todo el
          ancho (como el fondo de estudio de las fotos del catálogo), cada uno
          con su sombra de contacto. */}
      <div
        style={{
          position: "absolute",
          top: 1108,
          left: 0,
          right: 0,
          height: 236,
          background: colors.crema,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 1306 - 150,
          left: margen + 20,
          right: margen + 20,
          height: 150 * conPie,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        {mates.map(([src, alto]) => (
          <Img
            key={src}
            src={staticFile(src)}
            style={{ display: "block", height: alto * conPie }}
          />
        ))}
      </div>
      {/* Quiénes ya los eligieron: los logos en crema. */}
      <div
        style={{
          ...rotulo,
          position: "absolute",
          top: 1396,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        {confianza}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1434,
          left: margen,
          right: margen,
          height: 76,
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
      {/* El llamado, centrado, con una flecha hacia abajo. Texto, no botón. */}
      <div
        style={{
          position: "absolute",
          top: 1560,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 62 }}>{accion}</div>
        <svg
          width={26}
          height={50}
          viewBox="0 0 26 50"
          style={{ marginTop: 4 }}
        >
          <path
            d="M 13 0 V 46 M 2 35 L 13 46 L 24 35"
            fill="none"
            stroke={colors.crema}
            strokeWidth={2}
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

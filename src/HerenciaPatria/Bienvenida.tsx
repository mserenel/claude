import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Pop-up de bienvenida de la tienda (aparece al entrar desde el anuncio).
// Foto real del Torpedo (la de la portada del feed), logo original sobre el
// azul de la marca y sólo Addington. Dos formatos: vertical para celular
// (1080x1350) y horizontal para computadora (1536x1024).

export type Bienvenida = {
  readonly descuento: string; // "10% OFF"
  readonly detalle: string; // "en tu primera compra"
  readonly codigo: string; // "BIENVENIDO10"
};

const Texto: React.FC<
  Bienvenida & { readonly k: number; readonly logo?: boolean }
> = ({ descuento, detalle, codigo, k, logo = true }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: colors.crema,
      fontFamily: fonts.serif,
      textAlign: "center",
      fontVariantNumeric: "lining-nums",
    }}
  >
    {logo ? (
      <Img
        src={staticFile("logo-herencia-patria.png")}
        style={{ width: 150 * k, height: 150 * k, marginBottom: 22 * k }}
      />
    ) : null}
    <div
      style={{
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: 96 * k,
        lineHeight: 1,
      }}
    >
      Bienvenido
    </div>
    <div
      style={{
        width: 90 * k,
        height: 2,
        margin: `${22 * k}px 0 ${18 * k}px`,
        background: colors.crema,
        opacity: 0.7,
      }}
    />
    <div style={{ fontWeight: 400, fontSize: 36 * k, letterSpacing: 1 }}>
      Especial para vos
    </div>
    <div
      style={{
        marginTop: 6 * k,
        fontWeight: 800,
        fontSize: 130 * k,
        lineHeight: 1.05,
      }}
    >
      {descuento}
    </div>
    <div style={{ fontStyle: "italic", fontWeight: 400, fontSize: 50 * k }}>
      {detalle}
    </div>
    <div
      style={{
        marginTop: 30 * k,
        padding: `${14 * k}px ${34 * k}px`,
        border: `2px dashed ${colors.crema}`,
        fontSize: 34 * k,
        fontWeight: 400,
      }}
    >
      Usá el código <span style={{ fontWeight: 800 }}>{codigo}</span>
    </div>
    <div
      style={{
        marginTop: 16 * k,
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: 36 * k,
      }}
    >
      Combinalo con 20% off en transferencia
    </div>
    <div
      style={{
        marginTop: 26 * k,
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: 32 * k,
        opacity: 0.85,
      }}
    >
      Tradición que se lleva en las manos.
    </div>
  </div>
);

// La foto se muestra entera de ancho (1080 px) y corrida para que el mate
// quede completo arriba; el logo va en una esquina de la foto y el texto
// abajo.
export const BienvenidaVertical: React.FC<Bienvenida> = (p) => (
  <AbsoluteFill style={{ backgroundColor: colors.azul }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1080,
        height: 780,
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile("portada-raiz-feed.png")}
        style={{
          position: "absolute",
          left: 0,
          top: -760,
          width: 1080,
          height: (1080 * 2576) / 1450,
        }}
      />
    </div>
    {/* Funde la foto con el azul, sin corte duro. */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 600,
        height: 180,
        background: `linear-gradient(to bottom, rgba(20,35,59,0), ${colors.azul})`,
      }}
    />
    <Img
      src={staticFile("logo-herencia-patria.png")}
      style={{
        position: "absolute",
        // Arriba a la izquierda, sobre el fondo desenfocado: no tapa el mate.
        left: 44,
        top: 44,
        width: 140,
        height: 140,
        filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.6))",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 730,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Texto {...p} k={0.92} logo={false} />
    </div>
  </AbsoluteFill>
);

export const BienvenidaHorizontal: React.FC<Bienvenida> = (p) => (
  <AbsoluteFill style={{ backgroundColor: colors.azul }}>
    <Img
      src={staticFile("portada-raiz-feed.png")}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 720,
        height: 1024,
        objectFit: "cover",
        objectPosition: "45% 62%",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 560,
        top: 0,
        width: 160,
        height: 1024,
        background: `linear-gradient(to right, rgba(20,35,59,0), ${colors.azul})`,
      }}
    />
    <AbsoluteFill
      style={{
        left: 720,
        width: 816,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Texto {...p} k={0.95} />
    </AbsoluteFill>
  </AbsoluteFill>
);

// Imagen del pop-up promocional de Tiendanube (345x190, se exporta al triple
// para que se vea nítida). Sin foto: sólo marca (azul, crema, logo original y
// Addington), con un marco fino como el de una etiqueta.
export const BienvenidaPopup: React.FC<Bienvenida> = ({
  descuento,
  detalle,
  codigo,
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: colors.azul,
      color: colors.crema,
      fontFamily: fonts.serif,
      fontVariantNumeric: "lining-nums",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 26,
        border: `2px solid rgba(243,235,221,0.55)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 36,
        border: `1px solid rgba(243,235,221,0.3)`,
      }}
    />
    <AbsoluteFill
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 56,
      }}
    >
      <Img
        src={staticFile("logo-herencia-patria.png")}
        style={{ width: 250, height: 250 }}
      />
      <div
        style={{ width: 2, height: 300, background: "rgba(243,235,221,0.5)" }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div style={{ fontStyle: "italic", fontSize: 52, lineHeight: 1 }}>
          Bienvenido
        </div>
        <div
          style={{
            marginTop: 8,
            fontWeight: 800,
            fontSize: 108,
            lineHeight: 1.02,
          }}
        >
          {descuento}
        </div>
        <div style={{ fontStyle: "italic", fontSize: 40 }}>{detalle}</div>
        <div
          style={{
            marginTop: 20,
            padding: "10px 26px",
            border: `2px dashed ${colors.crema}`,
            fontSize: 30,
          }}
        >
          Código{" "}
          <span style={{ fontWeight: 800, letterSpacing: 1 }}>{codigo}</span>
        </div>
        <div style={{ marginTop: 14, fontStyle: "italic", fontSize: 30 }}>
          Combinalo con 20% off en transferencia
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

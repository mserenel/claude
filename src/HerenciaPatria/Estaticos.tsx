import { AbsoluteFill, Img, staticFile, useVideoConfig } from "remotion";
import { colors, fonts } from "./brand";

// Anuncios fijos del Torpedo para el mismo conjunto que el video (4:5 para
// Feed y 9:16 para Stories). Fotos reales, logo original y sólo Addington.
// En 9:16 los textos quedan dentro de la zona que Stories no tapa.

export type Estatico = {
  readonly foto: string;
  // Alto de la foto a 1080 de ancho, y dónde empieza y cuánto mide el mate en
  // ella: así el mate queda siempre entero entre el título y el texto.
  readonly altoFoto: number;
  readonly mateY: number;
  readonly mateAlto: number;
  // Línea arriba del título ("Mate") y debajo ("Cuero Crudo").
  readonly arriba?: string;
  readonly nombre?: string;
  readonly abajo?: string;
  // Frase grande de abajo y líneas chicas debajo.
  readonly frase: string;
  readonly detalle: string[];
  // Recuadro con el código del cupón (retargeting).
  readonly codigo?: string;
};

const sombra = "0 2px 4px rgba(0,0,0,0.5), 0 4px 26px rgba(0,0,0,0.55)";

export const AnuncioEstatico: React.FC<Estatico> = ({
  foto,
  altoFoto,
  mateY,
  mateAlto,
  arriba,
  nombre,
  abajo,
  frase,
  detalle,
  codigo,
}) => {
  const { height } = useVideoConfig();
  const alto = height > 1500;
  // Zona visible: en Stories la interfaz tapa ~270 px arriba y ~330 abajo.
  const top = alto ? 290 : 46;
  // Con título: el mate va debajo del título y el texto en una franja azul
  // abajo. Sin título (retargeting): la foto llena todo el cuadro, sin franja,
  // con el texto arriba sobre el fondo y el mate debajo.
  const sinFranja = !nombre;
  const mateEn = nombre ? top + (alto ? 290 : 285) : top + 400;
  // En 9:16 la foto se agranda; sin franja, además, hasta cubrir el cuadro.
  const k = Math.max(
    alto ? 1.15 : 1,
    sinFranja ? (height - mateEn) / (altoFoto - mateY) : 0,
  );
  const fotoTop = Math.min(0, mateEn - mateY * k);
  const finMate = fotoTop + (mateY + mateAlto) * k;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.azul,
        color: colors.crema,
        fontFamily: fonts.serif,
        fontVariantNumeric: "lining-nums",
        textShadow: sombra,
      }}
    >
      <Img
        src={staticFile(foto)}
        style={{
          position: "absolute",
          left: (1080 - 1080 * k) / 2,
          top: fotoTop,
          width: 1080 * k,
          height: altoFoto * k,
        }}
      />
      {/* Arriba, un oscurecido suave para el título (o el texto, sin
          franja); con franja, la foto se funde con el azul debajo del mate. */}
      <AbsoluteFill
        style={{
          background: sinFranja
            ? `linear-gradient(to bottom, rgba(18,12,8,0.7) 0%, rgba(18,12,8,0.45) ${((top + 330) / height) * 100}%, rgba(18,12,8,0) ${((top + 470) / height) * 100}%)`
            : "linear-gradient(to bottom, rgba(18,12,8,0.55) 0%, rgba(18,12,8,0) 22%)",
        }}
      />
      {sinFranja ? null : (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: finMate - 60,
              height: 120,
              background: `linear-gradient(to bottom, rgba(20,35,59,0), ${colors.azul})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: finMate + 40,
              bottom: 0,
              background: colors.azul,
            }}
          />
        </>
      )}
      <Img
        src={staticFile("logo-herencia-patria.png")}
        style={{
          position: "absolute",
          right: 40,
          ...(sinFranja
            ? { bottom: alto ? 330 : 40 }
            : { top: top - (alto ? 0 : 6) }),
          width: 110,
          height: 110,
          filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.6))",
        }}
      />
      {nombre ? (
        <AbsoluteFill style={{ alignItems: "center", paddingTop: top }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontStyle: "italic",
                fontSize: 68,
                lineHeight: 1.05,
                marginLeft: 8,
              }}
            >
              {arriba}
            </div>
            <div style={{ fontWeight: 700, fontSize: 100, lineHeight: 1 }}>
              {nombre}
            </div>
            <div
              style={{
                alignSelf: "flex-end",
                fontStyle: "italic",
                fontSize: 68,
                lineHeight: 1.15,
              }}
            >
              {abajo}
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill
        style={{
          top: sinFranja ? top + 40 : finMate + 50,
          height: "auto",
          bottom: undefined,
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: frase.length > 20 ? 68 : 84,
            lineHeight: 1.05,
            maxWidth: 960,
          }}
        >
          {frase}
        </div>
        {codigo ? (
          <div
            style={{
              marginTop: 18,
              padding: "12px 34px",
              border: `2px dashed ${colors.crema}`,
              fontSize: 42,
            }}
          >
            Código <span style={{ fontWeight: 800 }}>{codigo}</span>
          </div>
        ) : null}
        <div
          style={{
            width: 90,
            height: 2,
            margin: "18px 0 14px",
            background: colors.crema,
            opacity: 0.7,
          }}
        />
        {detalle.map((d) => (
          <div
            key={d}
            style={{ fontStyle: "italic", fontSize: 40, lineHeight: 1.3 }}
          >
            {d}
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const estaticos: Record<string, Estatico> = {
  // 1. Producto: la foto de la portada con su título y los materiales.
  Materiales: {
    foto: "portada-raiz-feed.png",
    altoFoto: 1919,
    mateY: 895,
    mateAlto: 625,
    arriba: "Mate",
    nombre: "TORPEDO",
    abajo: "Cuero Crudo",
    frase: "Cada uno es único.",
    detalle: [
      "Calabaza, cuero crudo, tiento y alpaca.",
      "20% off en transferencia · 3 cuotas sin interés",
    ],
  },
  // 2. Detalle: el Torpedo sobre el tronco, con la oferta.
  Oferta: {
    foto: "portada-tronco.jpg",
    altoFoto: 1440,
    mateY: 555,
    mateAlto: 575,
    arriba: "Mate",
    nombre: "TORPEDO",
    abajo: "Cuero Crudo",
    frase: "20% off en transferencia",
    detalle: ["y 3 cuotas sin interés."],
  },
  // 3. Retargeting: para quien visitó la tienda y no compró.
  Retargeting: {
    foto: "portada-raiz-feed.png",
    altoFoto: 1919,
    mateY: 895,
    mateAlto: 625,
    frase: "15% OFF en tu primera compra",
    codigo: "HERENCIA15",
    detalle: ["Combinalo con 20% off en transferencia."],
  },
  // Retargeting con las fotos nuevas del Torpedo (1724x2576): en la mano,
  // con el cielo, y sobre la mesa con la bombilla.
  RetargetingMano: {
    foto: "torpedo-mano.jpg",
    altoFoto: 1614,
    mateY: 645,
    mateAlto: 570,
    frase: "15% OFF en tu primera compra",
    codigo: "HERENCIA15",
    detalle: ["Combinalo con 20% off en transferencia."],
  },
  RetargetingMesa: {
    foto: "torpedo-mesa.jpg",
    altoFoto: 1614,
    mateY: 460,
    mateAlto: 720,
    frase: "15% OFF en tu primera compra",
    codigo: "HERENCIA15",
    detalle: ["Combinalo con 20% off en transferencia."],
  },
};

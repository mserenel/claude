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
  // Tamaño del texto del retargeting (1 = normal); más chico cuando el mate
  // ocupa mucho de la foto.
  readonly escala?: number;
};

const oscuro = "rgb(18,12,8)";
const sombra = "0 2px 4px rgba(0,0,0,0.5), 0 4px 26px rgba(0,0,0,0.55)";

// Diseño del retargeting: marco fino de etiqueta, "15% OFF" grande, el
// código en una pastilla crema y la fecha límite de la promo. La foto no se
// retoca: sólo se encuadra.
const Retargeting: React.FC<{
  readonly top: number;
  readonly bottom: number;
  readonly frase: string;
  readonly codigo?: string;
  readonly detalle: string[];
  readonly escala: number;
}> = ({ top, bottom, frase, codigo, detalle, escala: e }) => {
  // "15% OFF en tu primera compra" -> "15% OFF" + "en tu primera compra".
  const [, oferta = frase, resto = ""] =
    /^(\S+\s+OFF)\s*(.*)$/.exec(frase) ?? [];
  const linea = (
    <span style={{ width: 70, height: 2, background: colors.crema }} />
  );
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 24,
          border: "2px solid rgba(243,235,221,0.7)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 34,
          border: "1px solid rgba(243,235,221,0.4)",
        }}
      />
      <Img
        src={staticFile("logo-herencia-patria.png")}
        style={{
          position: "absolute",
          left: 52,
          top: Math.max(52, top - 6),
          width: 92,
          height: 92,
          filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.6))",
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: top + 40,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontStyle: "italic",
            fontSize: 44 * e,
          }}
        >
          {linea}
          Especial para vos
          {linea}
        </div>
        <div
          style={{
            marginTop: 6,
            fontWeight: 800,
            fontSize: 170 * e,
            lineHeight: 1,
          }}
        >
          {oferta}
        </div>
        <div style={{ fontStyle: "italic", fontSize: 54 * e, lineHeight: 1.1 }}>
          {resto}
        </div>
        {codigo ? (
          <div
            style={{
              marginTop: 24,
              padding: "12px 40px",
              background: colors.crema,
              color: colors.azul,
              textShadow: "none",
              borderRadius: 4,
              fontSize: 44 * e,
              boxShadow: "0 4px 18px rgba(0,0,0,0.35)",
            }}
          >
            Código{" "}
            <span style={{ fontWeight: 800, letterSpacing: 1 }}>{codigo}</span>
          </div>
        ) : null}
        {detalle.map((d) => (
          <div
            key={d}
            style={{ marginTop: 16, fontStyle: "italic", fontSize: 40 * e }}
          >
            {d}
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

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
  escala = 1,
}) => {
  const { height } = useVideoConfig();
  const alto = height > 1500;
  // Zona visible: en Stories la interfaz tapa ~270 px arriba y ~330 abajo.
  const top = alto ? 290 : 46;
  // Con título: el mate va debajo del título y el texto en una franja azul
  // abajo. Sin título (retargeting): la foto llena todo el cuadro, sin franja,
  // con el texto arriba sobre el fondo y el mate debajo.
  const sinFranja = !nombre;
  // Sin franja (retargeting): el texto arriba ocupa ~480 px y el mate va
  // justo debajo. La foto no se retoca, sólo se encuadra; si hace falta
  // bajarla, arriba queda un fondo oscuro que se funde con ella.
  const mateEn = nombre ? top + (alto ? 290 : 285) : top + 600 * escala;
  let k = alto ? (sinFranja ? 1.1 : 1.15) : 1;
  let fotoTop = Math.min(0, mateEn - mateY * k);
  if (sinFranja) {
    // El mate queda donde va; la foto se agranda sólo si no llega abajo.
    const necesario = (height - mateEn) / (altoFoto - mateY);
    k = Math.max(k, necesario);
    fotoTop = mateEn - mateY * k;
  }
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
      {sinFranja && fotoTop > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: fotoTop + 160,
            background: `linear-gradient(to bottom, ${oscuro} 0%, ${oscuro} ${(fotoTop / (fotoTop + 160)) * 100}%, rgba(18,12,8,0) 100%)`,
          }}
        />
      ) : null}
      {/* Arriba, un oscurecido suave para el título (o el texto, sin
          franja); con franja, la foto se funde con el azul debajo del mate. */}
      <AbsoluteFill
        style={{
          background: sinFranja
            ? `linear-gradient(to bottom, rgba(18,12,8,0.72) 0%, rgba(18,12,8,0.5) ${((top + 420) / height) * 100}%, rgba(18,12,8,0) ${((top + 560) / height) * 100}%, rgba(18,12,8,0) ${((height - (alto ? 330 : 40) - 300) / height) * 100}%, rgba(18,12,8,0.65) 100%)`
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
      {sinFranja ? (
        <Retargeting
          top={top}
          bottom={alto ? 330 : 40}
          escala={escala}
          frase={frase}
          codigo={codigo}
          detalle={detalle}
        />
      ) : null}
      <Img
        src={staticFile("logo-herencia-patria.png")}
        style={{
          position: "absolute",
          right: 40,
          display: sinFranja ? "none" : undefined,
          top: top - (alto ? 0 : 6),
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
          display: sinFranja ? "none" : "flex",
          top: finMate + 50,
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
    detalle: [
      "+ 20% off en transferencia",
      "Disponible hasta el 25 de octubre",
    ],
  },
  // Retargeting con las fotos nuevas del Torpedo (1724x2576): en la mano,
  // con el cielo, y sobre la mesa con la bombilla.
  RetargetingMano: {
    foto: "torpedo-mano.jpg",
    altoFoto: 1614,
    mateY: 650,
    mateAlto: 590,
    frase: "15% OFF en tu primera compra",
    codigo: "HERENCIA15",
    detalle: [
      "+ 20% off en transferencia",
      "Disponible hasta el 25 de octubre",
    ],
  },
  RetargetingMesa: {
    foto: "torpedo-mesa.jpg",
    altoFoto: 1614,
    mateY: 413,
    mateAlto: 740,
    escala: 0.85,
    frase: "15% OFF en tu primera compra",
    codigo: "HERENCIA15",
    detalle: [
      "+ 20% off en transferencia",
      "Disponible hasta el 25 de octubre",
    ],
  },
};

import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Historia de Instagram (1080x1920) con el estilo de las historias de la
// marca: foto a sangre con trama de puntos, una frase en la letra a mano
// (Sketcha Kits) y el cupón de bienvenida recortable, abajo o (si el mate
// ocupa el centro y abajo de la foto) arriba, con la frase abajo. Instagram
// tapa ~200 px arriba (nombre del perfil) y ~180 px abajo (responder): el
// texto va entre 240 y 1750.

export const Historia: React.FC<{
  readonly src: string;
  // Cuánto se sube la foto, para dejar aire a la frase sobre el mate.
  readonly subir: number;
  readonly frase: string[];
  readonly oferta: string;
  readonly detalle: string;
  readonly codigo: string;
  readonly extra: string;
  readonly vence: string;
  readonly cuponArriba?: boolean;
}> = ({
  src,
  subir,
  frase,
  oferta,
  detalle,
  codigo,
  extra,
  vence,
  cuponArriba = false,
}) => {
  const [porcentaje, off] = oferta.split(" ");
  const altoCupon = 250;
  const abajo = 200;
  const arriba = 260;
  const sello = 112;
  const cupon: React.CSSProperties = cuponArriba
    ? { top: arriba }
    : { bottom: abajo };
  return (
    <AbsoluteFill style={{ backgroundColor: "rgb(18,12,8)" }}>
      <Img
        src={staticFile(src)}
        // Fotos de otra proporción se recortan al centro, sin deformarlas.
        style={{
          position: "absolute",
          top: -subir,
          width: 1080,
          height: 1920,
          objectFit: "cover",
        }}
      />
      {/* Degradés cálidos: arriba para la frase, abajo para el cupón y el
          hueco que deja la foto al subir. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(18,12,8,0.75) 0%, rgba(18,12,8,0.5) 14%, rgba(18,12,8,0) 30%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 700,
          // Con el cupón arriba, la mesa se sigue viendo detrás de la frase.
          background: cuponArriba
            ? "linear-gradient(to bottom, rgba(18,12,8,0) 0%, rgba(18,12,8,0.35) 55%, rgba(18,12,8,0.7) 100%)"
            : "linear-gradient(to bottom, rgba(18,12,8,0) 0%, rgba(18,12,8,0.55) 45%, rgb(18,12,8) 80%)",
        }}
      />
      {/* Trama de puntos, más marcada en los bordes, como en las historias
          anteriores. */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(243,235,221,0.16) 2.2px, transparent 2.8px)",
          backgroundSize: "14px 14px",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.25) 65%, black 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          ...(cuponArriba ? { bottom: 170 } : { top: 250 }),
          left: 70,
          right: 70,
          textAlign: "center",
          fontFamily: fonts.mano,
          fontSize: 84,
          lineHeight: 1.12,
          color: colors.crema,
          textShadow: "0 2px 18px rgba(0,0,0,0.45)",
        }}
      >
        {frase.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          ...cupon,
          height: altoCupon,
          background: colors.crema,
          color: colors.madera,
          borderRadius: 14,
          boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
          fontFamily: fonts.serif,
          fontVariantNumeric: "lining-nums",
        }}
      >
        {/* Muescas del troquel, a los costados de la línea de corte. */}
        {[-1, 1].map((lado) => (
          <div
            key={lado}
            style={{
              position: "absolute",
              left: 330 - 18,
              [lado < 0 ? "top" : "bottom"]: -18,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(18,12,8,0.55)",
            }}
          />
        ))}
        <div
          style={{
            width: 330,
            height: "100%",
            borderRight: `3px dashed ${colors.madera}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 118, lineHeight: 1 }}>
            {porcentaje}
          </div>
          <div style={{ fontWeight: 800, fontSize: 44, letterSpacing: 2 }}>
            {off}
          </div>
        </div>
        <div style={{ flex: 1, padding: "0 30px" }}>
          <div style={{ fontStyle: "italic", fontSize: 36 }}>{detalle}</div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 62,
              lineHeight: 1.1,
              letterSpacing: 1,
              color: colors.azul,
            }}
          >
            {codigo}
          </div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>{extra}</div>
          <div style={{ fontStyle: "italic", fontSize: 32, marginTop: 2 }}>
            {vence}
          </div>
        </div>
      </div>
      {/* El logo es blanco: va sobre un disco azul que rompe el borde del
          cupón (el de arriba, o el de abajo si el cupón va arriba), como en
          la etiqueta de oferta, del lado libre a la derecha del texto. */}
      <div
        style={{
          position: "absolute",
          left: 930 - sello / 2,
          ...(cuponArriba
            ? { top: arriba + altoCupon - sello / 2 }
            : { bottom: abajo + altoCupon - sello / 2 }),
          width: sello,
          height: sello,
          borderRadius: "50%",
          background: colors.azul,
          border: `4px solid ${colors.crema}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img
          src={staticFile("logo-herencia-patria.png")}
          style={{ width: sello * 0.86, height: sello * 0.86 }}
        />
      </div>
    </AbsoluteFill>
  );
};

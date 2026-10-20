import { AbsoluteFill, Img, staticFile, useVideoConfig } from "remotion";
import { colors, fonts } from "./brand";

// Anuncios fijos de retargeting en dos estilos elegidos por la marca:
// "minimal" (la foto manda, texto chico abajo) y "cupon" (un vale recortable
// abajo). Fotos reales sin retocar, sólo encuadradas; 4:5 y 9:16.

export type Estilo = "minimal" | "cupon";

type Foto = {
  readonly src: string;
  // Alto de la foto a 1080 de ancho, y dónde termina el mate en ella.
  readonly alto: number;
  readonly mateFin: number;
};

export const fotosRT: Record<string, Foto> = {
  mano: { src: "torpedo-mano.jpg", alto: 1614, mateFin: 1240 },
  mesa: { src: "torpedo-mesa.jpg", alto: 1614, mateFin: 1160 },
  tronco: { src: "portada-raiz-feed.png", alto: 1919, mateFin: 1525 },
};

const sombra = "0 2px 4px rgba(0,0,0,0.55), 0 4px 24px rgba(0,0,0,0.55)";

const base: React.CSSProperties = {
  fontFamily: fonts.serif,
  fontVariantNumeric: "lining-nums",
  color: colors.crema,
};

// Encuadra la foto para que el mate termine en `finEn` (px del cuadro), sin
// dejar bordes vacíos: si hace falta, la agranda.
const FotoRT: React.FC<{ readonly foto: Foto; readonly finEn: number }> = ({
  foto,
  finEn,
}) => {
  const { height } = useVideoConfig();
  // Sin agrandar más de lo justo; si al subir la foto queda un hueco abajo
  // (detrás del cupón y la zona de la interfaz), se rellena con un oscuro
  // que se funde con ella. La foto en sí no se toca.
  const k = Math.max(1, Math.min(height / foto.alto, finEn / foto.mateFin));
  const top = Math.min(0, finEn - foto.mateFin * k);
  const fin = top + foto.alto * k;
  return (
    <>
      <Img
        src={staticFile(foto.src)}
        style={{
          position: "absolute",
          left: (1080 - 1080 * k) / 2,
          top,
          width: 1080 * k,
          height: foto.alto * k,
        }}
      />
      {fin < height ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: fin - 200,
            bottom: 0,
            background: `linear-gradient(to bottom, rgba(18,12,8,0) 0px, rgb(18,12,8) 200px)`,
          }}
        />
      ) : null}
    </>
  );
};

const Logo: React.FC<{ readonly top: number }> = ({ top }) => (
  <Img
    src={staticFile("logo-herencia-patria.png")}
    style={{
      position: "absolute",
      left: 50,
      top,
      width: 110,
      height: 110,
      filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.6))",
    }}
  />
);

// 1. Minimalista: la foto manda; el texto, abajo a la izquierda.
const Minimal: React.FC<{ readonly foto: Foto }> = ({ foto }) => {
  const { height } = useVideoConfig();
  const alto = height > 1500;
  const abajo = alto ? 360 : 56;
  const bloque = 240;
  return (
    <AbsoluteFill style={base}>
      <FotoRT foto={foto} finEn={height - abajo - bloque - 30} />
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, rgba(18,12,8,0) ${(
            ((height - abajo - bloque - 120) / height) *
            100
          ).toFixed(1)}%, rgba(18,12,8,0.8) 100%)`,
        }}
      />
      <Logo top={alto ? 290 : 50} />
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          bottom: abajo,
          textShadow: sombra,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 100, lineHeight: 1 }}>
          15% OFF
        </div>
        <div style={{ fontStyle: "italic", fontSize: 44, marginTop: 10 }}>
          en tu primera compra con{" "}
          <b style={{ fontStyle: "normal" }}>HERENCIA15</b>
        </div>
        <div style={{ fontSize: 34, marginTop: 12 }}>
          + 20% off en transferencia · hasta el 25 de octubre
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 6. Cupón: un vale recortable abajo, como uno de verdad.
const Cupon: React.FC<{ readonly foto: Foto }> = ({ foto }) => {
  const { height } = useVideoConfig();
  const alto = height > 1500;
  const abajo = alto ? 360 : 60;
  const altoCupon = 290;
  return (
    <AbsoluteFill style={base}>
      <FotoRT foto={foto} finEn={height - abajo - altoCupon - 30} />
      <Logo top={alto ? 290 : 50} />
      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          bottom: abajo,
          height: altoCupon,
          background: colors.crema,
          color: colors.madera,
          borderRadius: 14,
          boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Muescas del troquel, a los costados de la línea de corte. */}
        {[-1, 1].map((lado) => (
          <div
            key={lado}
            style={{
              position: "absolute",
              left: 380 - 18,
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
            width: 380,
            height: "100%",
            borderRight: `3px dashed ${colors.madera}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 130, lineHeight: 1 }}>
            15%
          </div>
          <div style={{ fontWeight: 800, fontSize: 48, letterSpacing: 2 }}>
            OFF
          </div>
        </div>
        <div style={{ flex: 1, padding: "0 30px" }}>
          <div style={{ fontStyle: "italic", fontSize: 40 }}>
            en tu primera compra
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 66,
              lineHeight: 1.1,
              letterSpacing: 1,
              color: colors.azul,
            }}
          >
            HERENCIA15
          </div>
          <div style={{ fontSize: 38, fontWeight: 700 }}>
            + 20% off en transferencia
          </div>
          <div style={{ fontStyle: "italic", fontSize: 34, marginTop: 2 }}>
            Hasta el 25 de octubre
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const RetargetingOpcion: React.FC<{
  readonly estilo: Estilo;
  readonly foto: string;
}> = ({ estilo, foto }) =>
  estilo === "minimal" ? (
    <Minimal foto={fotosRT[foto]} />
  ) : (
    <Cupon foto={fotosRT[foto]} />
  );

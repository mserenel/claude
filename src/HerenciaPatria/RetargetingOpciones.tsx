import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";

// Seis estilos para el anuncio fijo de retargeting (4:5), con la misma foto
// (sin retocar, sólo encuadrada) para elegir uno.

export type Estilo =
  | "minimal"
  | "portada"
  | "verde"
  | "madera"
  | "sello"
  | "cupon";

const sombra = "0 2px 4px rgba(0,0,0,0.55), 0 4px 24px rgba(0,0,0,0.55)";
const W = 1080;
const H = 1350;
// torpedo-mano.jpg a 1080 de ancho: 1614 de alto, mate de 650 a 1240.
const ALTO = 1614;
const MATE_Y = 650;
const MATE_FIN = 1240;

const Foto: React.FC<{ readonly mateEn: number }> = ({ mateEn }) => {
  const top = Math.min(0, Math.max(H - ALTO, mateEn - MATE_Y));
  return (
    <Img
      src={staticFile("torpedo-mano.jpg")}
      style={{ position: "absolute", left: 0, top, width: W, height: ALTO }}
    />
  );
};

const Logo: React.FC<{ readonly style: React.CSSProperties }> = ({ style }) => (
  <Img
    src={staticFile("logo-herencia-patria.png")}
    style={{
      position: "absolute",
      width: 110,
      height: 110,
      filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.6))",
      ...style,
    }}
  />
);

const base: React.CSSProperties = {
  fontFamily: fonts.serif,
  fontVariantNumeric: "lining-nums",
  color: colors.crema,
};

// 1. Minimalista: la foto manda; el texto, chico y elegante abajo.
const Minimal: React.FC = () => (
  <AbsoluteFill style={base}>
    <Foto mateEn={300} />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to bottom, rgba(18,12,8,0) 60%, rgba(18,12,8,0.75) 100%)",
      }}
    />
    <Logo style={{ left: 50, top: 50 }} />
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        bottom: 56,
        textShadow: sombra,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 92, lineHeight: 1 }}>
        15% OFF
      </div>
      <div style={{ fontStyle: "italic", fontSize: 40, marginTop: 8 }}>
        en tu primera compra con{" "}
        <b style={{ fontStyle: "normal" }}>HERENCIA15</b>
      </div>
      <div style={{ fontSize: 30, marginTop: 10, opacity: 0.9 }}>
        + 20% off en transferencia · hasta el 25 de octubre
      </div>
    </div>
  </AbsoluteFill>
);

// 2. Como la portada del feed: título grande en crema, sin cajas.
const Portada: React.FC = () => (
  <AbsoluteFill style={base}>
    <Foto mateEn={560} />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to bottom, rgba(18,12,8,0.6) 0%, rgba(18,12,8,0.35) 30%, rgba(18,12,8,0) 45%)",
      }}
    />
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 70 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textShadow: sombra,
        }}
      >
        <div style={{ fontStyle: "italic", fontSize: 76, marginLeft: 8 }}>
          Especial
        </div>
        <div style={{ fontWeight: 700, fontSize: 168, lineHeight: 0.95 }}>
          15% OFF
        </div>
        <div
          style={{ alignSelf: "flex-end", fontStyle: "italic", fontSize: 76 }}
        >
          para vos
        </div>
      </div>
      <div style={{ marginTop: 22, fontSize: 40, textShadow: sombra }}>
        Código <b>HERENCIA15</b> · hasta el 25/10
      </div>
    </AbsoluteFill>
    <Logo style={{ right: 50, bottom: 50 }} />
  </AbsoluteFill>
);

// 3 y 4. Franja de color de marca abajo, foto arriba.
const Franja: React.FC<{ readonly color: string }> = ({ color }) => (
  <AbsoluteFill style={base}>
    <Foto mateEn={1000 - (MATE_FIN - MATE_Y)} />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1030,
        bottom: 0,
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 60px",
      }}
    >
      <div>
        <div style={{ fontWeight: 800, fontSize: 120, lineHeight: 1 }}>
          15% OFF
        </div>
        <div style={{ fontStyle: "italic", fontSize: 38 }}>
          en tu primera compra
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div
          style={{
            border: `2px solid ${colors.crema}`,
            padding: "8px 22px",
            fontSize: 38,
          }}
        >
          <b>HERENCIA15</b>
        </div>
        <div style={{ marginTop: 12, fontSize: 28 }}>
          + 20% off en transferencia
        </div>
        <div style={{ fontStyle: "italic", fontSize: 28 }}>
          hasta el 25 de octubre
        </div>
      </div>
    </div>
    <Logo style={{ left: 50, top: 50 }} />
  </AbsoluteFill>
);

// 5. Sello: un círculo como de lacre en la esquina, sobre el cielo.
const Sello: React.FC = () => (
  <AbsoluteFill style={base}>
    <Foto mateEn={430} />
    <div
      style={{
        position: "absolute",
        right: 60,
        top: 60,
        width: 380,
        height: 380,
        borderRadius: "50%",
        background: colors.madera,
        boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 14,
          borderRadius: "50%",
          border: "2px dashed rgba(243,235,221,0.7)",
        }}
      />
      <div style={{ fontStyle: "italic", fontSize: 34 }}>Especial</div>
      <div style={{ fontWeight: 800, fontSize: 104, lineHeight: 1 }}>15%</div>
      <div style={{ fontWeight: 800, fontSize: 46 }}>OFF</div>
      <div style={{ fontSize: 26, marginTop: 6 }}>HERENCIA15</div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 60,
        bottom: 56,
        textShadow: sombra,
      }}
    >
      <div style={{ fontStyle: "italic", fontSize: 40 }}>
        + 20% off en transferencia
      </div>
      <div style={{ fontSize: 30, marginTop: 6 }}>Hasta el 25 de octubre</div>
    </div>
    <Logo style={{ left: 50, top: 50 }} />
  </AbsoluteFill>
);

// 6. Cupón: un ticket recortable abajo, como un vale de verdad.
const Cupon: React.FC = () => (
  <AbsoluteFill style={base}>
    <Foto mateEn={990 - (MATE_FIN - MATE_Y)} />
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        bottom: 60,
        height: 250,
        background: colors.crema,
        color: colors.madera,
        borderRadius: 14,
        boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 400,
          textAlign: "center",
          borderRight: `3px dashed ${colors.madera}`,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 110, lineHeight: 1 }}>15%</div>
        <div style={{ fontWeight: 800, fontSize: 44 }}>OFF</div>
      </div>
      <div style={{ flex: 1, padding: "0 34px" }}>
        <div style={{ fontStyle: "italic", fontSize: 34 }}>
          en tu primera compra
        </div>
        <div style={{ fontWeight: 800, fontSize: 56, letterSpacing: 1 }}>
          HERENCIA15
        </div>
        <div style={{ fontSize: 28 }}>+ 20% off en transferencia</div>
        <div style={{ fontStyle: "italic", fontSize: 26 }}>
          Hasta el 25 de octubre
        </div>
      </div>
    </div>
    <Logo style={{ left: 50, top: 50 }} />
  </AbsoluteFill>
);

export const RetargetingOpcion: React.FC<{ readonly estilo: Estilo }> = ({
  estilo,
}) =>
  estilo === "minimal" ? (
    <Minimal />
  ) : estilo === "portada" ? (
    <Portada />
  ) : estilo === "verde" ? (
    <Franja color={colors.verde} />
  ) : estilo === "madera" ? (
    <Franja color={colors.madera} />
  ) : estilo === "sello" ? (
    <Sello />
  ) : (
    <Cupon />
  );

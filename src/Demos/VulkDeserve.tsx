import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  Easing,
  Img,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { iv } from "../Cafe/CafeTikTok";

// Clip vertical para la publicación de Mercado Libre de los anteojos Vulk
// Deserve: la foto original del producto (sin retocar, sólo agrandada) sobre
// fondo de estudio claro, con movimientos suaves, acercamientos a los
// detalles y textos sobrios. Sólo dice lo que se ve en la foto; las
// especificaciones (polarizado, UV, estuche) se suman cuando estén
// confirmadas. Sin precios ni datos de contacto, como pide Mercado Libre.

export const VULK_FRAMES = 450;

const fuente = '"Inter", sans-serif';
const tinta = "#111111";
const gris = "#6B6B6B";
const sale = Easing.out(Easing.cubic);
const suave = Easing.inOut(Easing.cubic);

const archivos: [string, string][] = [
  ["400", "inter-latin-400-normal.woff2"],
  ["600", "inter-latin-600-normal.woff2"],
  ["800", "inter-latin-800-normal.woff2"],
];
const espera = delayRender("Inter para el clip de Vulk");
Promise.all(
  archivos.map(([weight, file]) => {
    const font = new FontFace(
      "Inter",
      `url(${staticFile(`ventas/fonts/${file}`)})`,
      { weight },
    );
    return font.load().then(() => {
      document.fonts.add(font);
    });
  }),
)
  .then(() => continueRender(espera))
  .catch((err) => cancelRender(err));

// La foto mide 640 x 438 (guardada al triple). En pantalla, 1300 px de ancho.
const FOTO_W = 1300;
const FOTO_H = (FOTO_W * 438) / 640;
const ESC = FOTO_W / 640;
const CX = 540;
const CY = 930;

// Encuadre: escala y punto de la foto (en px originales) que va al centro.
type Plano = { readonly k: number; readonly px: number; readonly py: number };
const general: Plano = { k: 1, px: 320, py: 219 };
const lente: Plano = { k: 1.55, px: 300, py: 250 };
const patilla: Plano = { k: 1.8, px: 190, py: 175 };

const mezcla = (a: Plano, b: Plano, t: number): Plano => ({
  k: a.k + (b.k - a.k) * t,
  px: a.px + (b.px - a.px) * t,
  py: a.py + (b.py - a.py) * t,
});

const Foto: React.FC = () => {
  const f = useCurrentFrame();
  // Entrada desde la derecha, girando apenas.
  const entra = iv(f, [0, 34], [0, 1], sale);
  // Recorrido de cámara entre planos.
  let p = general;
  p = mezcla(p, lente, iv(f, [150, 172], [0, 1], suave));
  p = mezcla(p, patilla, iv(f, [240, 262], [0, 1], suave));
  p = mezcla(p, general, iv(f, [330, 352], [0, 1], suave));
  const respira =
    1 +
    iv(f, [34, 150], [0, 0.05], Easing.linear) -
    iv(f, [330, 352], [0, 0.05]) +
    iv(f, [352, 450], [0, 0.04], Easing.linear);
  const k = p.k * respira;
  const giro = (1 - entra) * 8 + Math.sin(f / 45) * 0.8;
  const x = CX - p.px * ESC * k + (1 - entra) * 700;
  const y = CY - p.py * ESC * k;
  return (
    <>
      {/* Sombra en el piso */}
      <div
        style={{
          position: "absolute",
          left: CX - 380 * (p.k === 1 ? 1 : 1),
          top: CY + 300,
          width: 760,
          height: 70,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(0,0,0,0.22), rgba(0,0,0,0) 70%)",
          opacity:
            entra * (1 - iv(f, [150, 165], [0, 1]) + iv(f, [330, 352], [0, 1])),
          filter: "blur(6px)",
        }}
      />
      <Img
        src={staticFile("ml/vulk-deserve.png")}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: FOTO_W * k,
          height: FOTO_H * k,
          transform: `rotate(${giro}deg)`,
          transformOrigin: `${p.px * ESC * k}px ${p.py * ESC * k}px`,
          mixBlendMode: "multiply",
          opacity: entra,
        }}
      />
    </>
  );
};

const Texto: React.FC<{
  readonly desde: number;
  readonly hasta: number;
  readonly top: number;
  readonly children: React.ReactNode;
  readonly tam?: number;
  readonly kicker?: string;
}> = ({ desde, hasta, top, children, tam = 72, kicker }) => {
  const f = useCurrentFrame();
  if (f < desde - 1 || f >= hasta) return null;
  const e = iv(f, [desde, desde + 14], [0, 1], sale);
  const o = e * iv(f, [hasta - 8, hasta], [1, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top,
        textAlign: "center",
        fontFamily: fuente,
        color: tinta,
        opacity: o,
        transform: `translateY(${(1 - e) * 20}px)`,
      }}
    >
      {kicker ? (
        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: 14,
            color: gris,
            marginBottom: 12,
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div
        style={{
          fontSize: tam,
          fontWeight: 800,
          letterSpacing: -1,
          lineHeight: 1.05,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Señal: punto sobre el anteojo, línea y etiqueta.
const Senal: React.FC<{
  readonly desde: number;
  readonly hasta: number;
  readonly px: number;
  readonly py: number;
  readonly lx: number;
  readonly ly: number;
  readonly t: string;
}> = ({ desde, hasta, px, py, lx, ly, t }) => {
  const f = useCurrentFrame();
  if (f < desde || f >= hasta) return null;
  const x = CX - 320 * ESC + px * ESC;
  const y = CY - 219 * ESC + py * ESC;
  const linea = iv(f, [desde + 4, desde + 16], [0, 1], sale);
  const o =
    iv(f, [desde, desde + 6], [0, 1]) * iv(f, [hasta - 8, hasta], [1, 0]);
  const largo = Math.hypot(lx - x, ly - y);
  const ang = (Math.atan2(ly - y, lx - x) * 180) / Math.PI;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div
        style={{
          position: "absolute",
          left: x - 11,
          top: y - 11,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#fff",
          border: `5px solid ${tinta}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x,
          top: y - 1.5,
          width: largo * linea,
          height: 3,
          background: tinta,
          transform: `rotate(${ang}deg)`,
          transformOrigin: "0 50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: lx,
          top: ly,
          transform: "translate(-50%, -50%)",
          padding: "14px 24px",
          borderRadius: 40,
          background: tinta,
          color: "#fff",
          fontFamily: fuente,
          fontSize: 36,
          fontWeight: 600,
          whiteSpace: "nowrap",
          opacity: iv(f, [desde + 12, desde + 18], [0, 1]),
        }}
      >
        {t}
      </div>
    </div>
  );
};

export const VulkDeserve: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at 50% 48%, #FFFFFF 0%, #F4F4F4 55%, #E6E6E6 100%)",
    }}
  >
    <Foto />
    {/* Presentación */}
    <Texto desde={6} hasta={150} top={300} tam={120} kicker="VULK">
      Deserve
    </Texto>
    <Senal
      desde={60}
      hasta={148}
      px={420}
      py={152}
      lx={760}
      ly={590}
      t="Frente plano"
    />
    <Senal
      desde={80}
      hasta={148}
      px={205}
      py={190}
      lx={320}
      ly={1400}
      t="Armazón negro mate"
    />
    <Senal
      desde={100}
      hasta={148}
      px={440}
      py={240}
      lx={760}
      ly={1300}
      t="Diseño cuadrado XL"
    />
    {/* Detalles */}
    <Texto desde={168} hasta={240} top={1450} tam={68} kicker="DETALLE">
      Lentes oscuras
    </Texto>
    <Texto desde={258} hasta={330} top={1450} tam={68} kicker="DETALLE">
      Patillas anchas
    </Texto>
    {/* Cierre */}
    <Texto
      desde={352}
      hasta={VULK_FRAMES + 1}
      top={300}
      tam={120}
      kicker="VULK"
    >
      Deserve
    </Texto>
    <Texto desde={366} hasta={VULK_FRAMES + 1} top={1360} tam={44}>
      <span style={{ fontWeight: 600, color: gris }}>
        Negro mate · Lentes oscuras
      </span>
    </Texto>
  </AbsoluteFill>
);

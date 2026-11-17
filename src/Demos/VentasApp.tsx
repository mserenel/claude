import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { iv, texto, titular } from "../Cafe/CafeTikTok";

// Video de 30 s para mostrar la app de carga de ventas, armado sobre el guion
// (gancho, dolor, solución, resultado y cierre). Las partes 8–20 s y 20–26 s
// van con grabaciones reales de la pantalla: mientras no estén, se ve un
// recuadro que dice qué grabar. Para usarlas, poner los archivos en
// public/ventas/ y pasar sus nombres en las props.

export const VENTAS_FRAMES = 900;

export type VentasProps = {
  readonly grabacionApp?: string; // p. ej. "ventas/app.mp4" (12 s)
  readonly grabacionPlanilla?: string; // p. ej. "ventas/planilla.mp4" (6 s)
};

const k = {
  fondo: "#0F1724",
  blanco: "#F8FAFC",
  verde: "#22C55E",
  rojo: "#EF4444",
  papel: "#FBF6E9",
  renglon: "#9CC3E6",
  tinta: "#1E3A8A",
};

const sombra = "0 6px 0 rgba(0,0,0,0.35), 0 10px 40px rgba(0,0,0,0.5)";

// Bloques del guion (en cuadros, a 30 por segundo).
const B = {
  gancho: [0, 90],
  dolor: [90, 240],
  solucion: [240, 600],
  resultado: [600, 780],
  cierre: [780, VENTAS_FRAMES],
} as const;

// Subtítulos de la voz, tal como dice el guion.
const voz: [number, number, string][] = [
  [96, 168, "Anotás en un cuaderno, después lo pasás al Excel…"],
  [168, 240, "…y a fin de mes los números *no *dan."],
  [
    246,
    370,
    "Esto lo uso en mi negocio. Cargo la venta desde el celular *en *segundos,",
  ],
  [370, 480, "el sistema me *frena si no hay stock"],
  [480, 600, "y todo se *registra *solo."],
  [
    606,
    700,
    "Y al final del mes ya sé cuánto vendí y *cuánto *gané de verdad.",
  ],
  [700, 780, "*Sin *pasar *nada *a *mano."],
  [
    790,
    VENTAS_FRAMES,
    "Escribime *“ventas” y te muestro cómo quedaría con tus productos.",
  ],
];

const Subtitulo: React.FC = () => {
  const f = useCurrentFrame();
  const l = voz.find(([a, b]) => f >= a && f < b);
  if (!l) return null;
  const [a, b, t] = l;
  const local = f - a;
  const palabras = t.split(" ");
  return (
    <div
      style={{
        position: "absolute",
        top: 1330,
        left: 80,
        right: 150,
        textAlign: "center",
        fontFamily: texto,
        fontWeight: 900,
        fontSize: 54,
        lineHeight: 1.18,
        color: k.blanco,
        textShadow: sombra,
        opacity: b === VENTAS_FRAMES ? 1 : iv(f, [b - 5, b], [1, 0]),
      }}
    >
      {palabras.map((w, i) => {
        const clave = w.startsWith("*");
        const tt = local - i * 2;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.24em",
              color: clave ? (f < B.dolor[1] ? k.rojo : k.verde) : k.blanco,
              opacity: tt < 0 ? 0 : 1,
              transform: `scale(${iv(tt, [0, 3, 6], [0.7, 1.08, 1])})`,
            }}
          >
            {clave ? w.slice(1) : w}
          </span>
        );
      })}
    </div>
  );
};

// ---- 0–3 s: el cuaderno con ventas tachadas ----
const filas: [string, string][] = [
  ["2 remeras", "$24.000"],
  ["1 buzo M", "$31.500"],
  ["3 medias", "$6.900"],
  ["1 campera", "$58.000"],
  ["2 gorras", "$15.000"],
  ["1 buzo M", "$31.500"],
];

const Cuaderno: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.max(0, spring({ frame: f + 4, fps, config: { damping: 14 } }));
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 700,
        width: 840,
        height: 720,
        background: k.papel,
        borderRadius: 18,
        boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
        transform: `rotate(${-4 + (1 - s) * -10}deg) scale(${0.8 + 0.2 * s})`,
        overflow: "hidden",
      }}
    >
      {/* Renglones y margen */}
      {new Array(12).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 90 + i * 64,
            height: 2,
            background: k.renglon,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 0,
          bottom: 0,
          width: 3,
          background: "#F28B82",
        }}
      />
      {filas.map(([q, p], i) => {
        const t0 = 4 + i * 9;
        const tachada = i === 1 || i === 3 || i === 5;
        const raya = iv(f, [t0 + 22, t0 + 30], [0, 1]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 140,
              right: 50,
              top: 100 + i * 64 + 4,
              display: "flex",
              justifyContent: "space-between",
              fontFamily: texto,
              fontWeight: 700,
              fontSize: 42,
              color: k.tinta,
              opacity: f >= t0 ? 1 : 0,
              transform: `rotate(${(i % 2 ? 1 : -1) * 0.8}deg)`,
            }}
          >
            <span>{q}</span>
            <span>{p}</span>
            {tachada ? (
              <div
                style={{
                  position: "absolute",
                  left: -10,
                  top: 26,
                  height: 6,
                  width: `${raya * 105}%`,
                  background: k.rojo,
                  borderRadius: 3,
                  transform: "rotate(-2deg)",
                }}
              />
            ) : null}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          right: 50,
          bottom: 40,
          fontFamily: texto,
          fontWeight: 900,
          fontSize: 56,
          color: k.rojo,
          transform: "rotate(-6deg)",
          opacity: iv(f, [70, 76], [0, 1]),
        }}
      >
        ¿TOTAL = ?
      </div>
    </div>
  );
};

const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.max(0, spring({ frame: f + 6, fps, config: { damping: 10 } }));
  return (
    <AbsoluteFill style={{ opacity: iv(f, [84, 92], [1, 0]) }}>
      <Cuaderno />
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 50,
          right: 50,
          textAlign: "center",
          fontFamily: titular,
          fontSize: 118,
          lineHeight: 1.02,
          color: k.blanco,
          textShadow: sombra,
          transform: `scale(${0.7 + 0.3 * s})`,
          opacity: Math.min(1, s),
        }}
      >
        ¿ASÍ CONTROLÁS LAS VENTAS{" "}
        <span style={{ color: k.rojo }}>DE TU NEGOCIO?</span>
      </div>
    </AbsoluteFill>
  );
};

// ---- 3–8 s: el dolor ----
const Dolor: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = Math.max(
    0,
    spring({ frame: f - 100, fps, config: { damping: 12 } }),
  );
  const b = Math.max(
    0,
    spring({ frame: f - 165, fps, config: { damping: 12 } }),
  );
  return (
    <AbsoluteFill
      style={{ opacity: iv(f, [90, 98], [0, 1]) * iv(f, [232, 240], [1, 0]) }}
    >
      {/* Cuaderno → Excel → números que no dan */}
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          fontFamily: texto,
          fontWeight: 900,
          fontSize: 40,
          color: k.blanco,
        }}
      >
        {["Cuaderno", "Excel", "Fin de mes"].map((t, i) => (
          <div
            key={t}
            style={{ display: "flex", alignItems: "center", gap: 16 }}
          >
            <div
              style={{
                padding: "22px 24px",
                whiteSpace: "nowrap",
                borderRadius: 24,
                background: i === 2 ? k.rojo : "rgba(255,255,255,0.1)",
                border: "3px solid rgba(255,255,255,0.25)",
                opacity: iv(f, [100 + i * 18, 108 + i * 18], [0, 1]),
                transform: `scale(${iv(f, [100 + i * 18, 110 + i * 18], [0.6, 1], Easing.out(Easing.back(2)))})`,
              }}
            >
              {t}
            </div>
            {i < 2 ? (
              <div
                style={{
                  fontSize: 48,
                  opacity: iv(f, [108 + i * 18, 114 + i * 18], [0, 1]),
                }}
              >
                →
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          top: 820,
          left: 70,
          right: 70,
          textAlign: "center",
          fontFamily: titular,
          lineHeight: 1.05,
          textShadow: sombra,
        }}
      >
        <div
          style={{
            fontSize: 100,
            color: k.blanco,
            opacity: Math.min(1, a),
            transform: `translateY(${(1 - a) * 30}px)`,
          }}
        >
          VENDISTE ALGO <span style={{ color: k.rojo }}>QUE NO TENÍAS.</span>
        </div>
        <div
          style={{
            marginTop: 30,
            fontSize: 100,
            color: k.blanco,
            opacity: Math.min(1, b),
            transform: `translateY(${(1 - b) * 30}px)`,
          }}
        >
          O NO SABÉS <span style={{ color: k.rojo }}>CUÁNTO GANASTE.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- Grabación de pantalla (o recuadro que indica qué grabar) ----
const Pantalla: React.FC<{
  readonly src?: string;
  readonly titulo: string;
  readonly pasos: string[];
  readonly segundos: number;
}> = ({ src, titulo, pasos, segundos }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.max(0, spring({ frame: f, fps, config: { damping: 14 } }));
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
      {/* Marco de celular */}
      <div
        style={{
          width: 560,
          height: 1000,
          borderRadius: 70,
          background: "#05080D",
          padding: 18,
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 4px #2A3442",
          transform: `translateY(${(1 - s) * 200}px)`,
          opacity: Math.min(1, s),
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 54,
            overflow: "hidden",
            background: "#1B2533",
            position: "relative",
          }}
        >
          {src ? (
            <OffthreadVideo
              src={staticFile(src)}
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 24,
                border: "4px dashed rgba(255,255,255,0.35)",
                borderRadius: 36,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: 36,
                gap: 18,
                fontFamily: texto,
                color: k.blanco,
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 40, color: k.verde }}>
                ACÁ VA TU GRABACIÓN
              </div>
              <div style={{ fontWeight: 800, fontSize: 34 }}>
                {titulo} ({segundos} s)
              </div>
              {pasos.map((p, i) => (
                <div
                  key={p}
                  style={{ fontWeight: 700, fontSize: 28, opacity: 0.85 }}
                >
                  {i + 1}. {p}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Rótulo arriba de cada parte.
const Rotulo: React.FC<{
  readonly t: string;
  readonly desde: number;
  readonly hasta: number;
}> = ({ t, desde, hasta }) => {
  const f = useCurrentFrame();
  if (f < desde || f >= hasta) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 190,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: titular,
        fontSize: 76,
        color: k.blanco,
        textShadow: sombra,
        opacity:
          iv(f, [desde, desde + 8], [0, 1]) * iv(f, [hasta - 6, hasta], [1, 0]),
      }}
    >
      {t}
    </div>
  );
};

// ---- 26–30 s: cierre ----
const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.max(
    0,
    spring({ frame: f - 784, fps, config: { damping: 11 } }),
  );
  const b = Math.max(
    0,
    spring({ frame: f - 805, fps, config: { damping: 9 } }),
  );
  if (f < 780) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          marginTop: 520,
          textAlign: "center",
          fontFamily: titular,
          fontSize: 130,
          lineHeight: 1.02,
          color: k.blanco,
          textShadow: sombra,
          transform: `scale(${0.7 + 0.3 * s})`,
          opacity: Math.min(1, s),
          padding: "0 60px",
        }}
      >
        ¿QUERÉS ESTO PARA <span style={{ color: k.verde }}>TU NEGOCIO?</span>
      </div>
      <div
        style={{
          marginTop: 70,
          padding: "26px 60px",
          borderRadius: 80,
          background: k.verde,
          color: "#06210F",
          fontFamily: texto,
          fontWeight: 900,
          fontSize: 64,
          transform: `scale(${b})`,
          boxShadow: "0 20px 50px rgba(34,197,94,0.35)",
        }}
      >
        Escribime “VENTAS”
      </div>
    </AbsoluteFill>
  );
};

export const VentasApp: React.FC<VentasProps> = ({
  grabacionApp,
  grabacionPlanilla,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 40%, #1C2A40 0%, ${k.fondo} 70%)`,
    }}
  >
    <Sequence
      from={B.gancho[0]}
      durationInFrames={B.gancho[1] - B.gancho[0] + 4}
    >
      <Gancho />
    </Sequence>
    <Dolor />
    <Sequence
      from={B.solucion[0]}
      durationInFrames={B.solucion[1] - B.solucion[0]}
    >
      <Pantalla
        src={grabacionApp}
        titulo="La app en el celular"
        segundos={12}
        pasos={[
          "Elegís el producto",
          "Se agrega al carrito",
          "Aviso de sin stock",
          "Confirmás la venta",
          "Sale el número de factura",
        ]}
      />
    </Sequence>
    <Sequence
      from={B.resultado[0]}
      durationInFrames={B.resultado[1] - B.resultado[0]}
    >
      <Pantalla
        src={grabacionPlanilla}
        titulo="La planilla de resumen"
        segundos={6}
        pasos={["Ventas del mes", "Costo", "Ganancia neta actualizándose"]}
      />
    </Sequence>
    <Rotulo t="ASÍ LO HAGO YO" desde={B.solucion[0]} hasta={B.solucion[1]} />
    <Rotulo t="A FIN DE MES" desde={B.resultado[0]} hasta={B.resultado[1]} />
    <Cierre />
    <Subtitulo />
  </AbsoluteFill>
);

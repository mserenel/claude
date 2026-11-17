import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { iv, texto, titular } from "../Cafe/CafeTikTok";
import { AppMes, AppSolucion } from "./AppDemo";

// Video de 30 s para mostrar la app de carga de ventas, armado sobre el guion
// (gancho, dolor, solución, resultado y cierre). Arranca con un lío de papeles
// y lo resuelve una interfaz de ejemplo de una app de gestión (AppDemo.tsx):
// vender con control de stock, stock, reponer, gastos y el cierre del mes. Si hay
// grabaciones reales de la pantalla, se pasan en las props (archivos en
// public/ventas/) y reemplazan a la app y a la planilla de ejemplo.

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
    372,
    "Esto lo uso en mi negocio. Cargo la venta desde el celular *en *segundos,",
  ],
  [372, 440, "el sistema me *frena si no hay stock"],
  [440, 600, "y todo se *registra *solo."],
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
        top: 1470,
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

// ---- 0–3 s: el lío de papeles ----
// Hojas, notas y tickets que caen uno arriba del otro hasta tapar todo. En
// el dolor quedan atrás, apagados, y al pasar a la app se los "traga" el
// celular: el lío entra en la app y sale ordenado.

type Papel = {
  readonly tipo: "hoja" | "nota" | "ticket";
  readonly x: number;
  readonly y: number;
  readonly rot: number;
  readonly dx: number;
  readonly dy: number;
  readonly color: string;
  readonly lineas: string[];
  readonly tachar: number[];
  readonly mancha: boolean;
};

const textosHoja = [
  ["2 remeras  $24.000", "buzo M  $31.500", "fiado Juan $15.000", "¿pagó?"],
  ["medias x3  6.900", "campera  58.000", "buzo M  31.500", "TOTAL ??"],
  ["lunes: 4 ventas", "gorra 7.500", "remera 12.000", "pasar al Excel"],
  ["devolución buzo", "-31.500", "stock remeras: ¿12?", "contar"],
];
const textosNota = [
  ["¡SIN STOCK", "BUZO M!"],
  ["Cobrar", "a Juan"],
  ["¿Cuánto", "gané?"],
  ["Pedir", "remeras"],
  ["Total", "???"],
  ["NO", "VENDER", "campera"],
];
const textosTicket = [
  [
    "TICKET",
    "Remera 12.000",
    "Remera 12.000",
    "Medias 6.900",
    "------",
    "TOTAL 30.900",
  ],
  ["TICKET", "Buzo M 31.500", "------", "TOTAL 31.500"],
  ["TICKET", "Gorra 7.500", "Gorra 7.500", "------", "TOTAL 15.000"],
];

const papeles: Papel[] = new Array(30).fill(0).map((_, i) => {
  const r = (s: string) => random(`${s}${i}`);
  const tipo = i % 3 === 0 ? "nota" : i % 3 === 1 ? "hoja" : "ticket";
  const ang = r("a") * Math.PI * 2;
  const lineas =
    tipo === "hoja"
      ? textosHoja[i % textosHoja.length]
      : tipo === "nota"
        ? textosNota[i % textosNota.length]
        : textosTicket[i % textosTicket.length];
  return {
    tipo,
    x: 60 + r("x") * 760,
    y: 800 + r("y") * 700,
    rot: (r("r") - 0.5) * 60,
    dx: Math.cos(ang),
    dy: Math.sin(ang),
    color:
      tipo === "nota"
        ? ["#FDE68A", "#FBCFE8", "#BBF7D0"][i % 3]
        : tipo === "hoja"
          ? "#FBF6E9"
          : "#FFFFFF",
    lineas,
    tachar: tipo === "nota" ? [] : [1, r("t") > 0.5 ? 2 : -1],
    mancha: r("m") > 0.75,
  };
});

const Papeles: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= B.solucion[0] + 20) return null;
  // Apagados detrás del dolor.
  const fondo = iv(f, [88, 104], [1, 0.22]);
  return (
    <AbsoluteFill
      style={{ opacity: fondo, filter: `blur(${iv(f, [88, 104], [0, 3])}px)` }}
    >
      {papeles.map((p, i) => {
        const t0 = i * 2;
        const cae = iv(f, [t0, t0 + 12], [1, 0], Easing.out(Easing.cubic));
        // Al final, todo entra al celular.
        const t1 = 222 + i * 0.6;
        const traga = iv(f, [t1, t1 + 18], [0, 1], Easing.in(Easing.cubic));
        const x = p.x + p.dx * 1000 * cae;
        const y = p.y + p.dy * 1000 * cae;
        const xf = x + (540 - 110 - x) * traga;
        const yf = y + (820 - y) * traga;
        const w = p.tipo === "hoja" ? 330 : p.tipo === "nota" ? 230 : 200;
        const h = p.tipo === "hoja" ? 400 : p.tipo === "nota" ? 230 : 430;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: xf,
              top: yf - h / 2,
              width: w,
              height: h,
              background: p.color,
              borderRadius: p.tipo === "nota" ? 6 : 10,
              boxShadow: "0 14px 30px rgba(0,0,0,0.45)",
              transform: `rotate(${p.rot + traga * 220}deg) scale(${1 - traga * 0.9})`,
              opacity: f < t0 ? 0 : 1 - iv(traga, [0.8, 1], [0, 1]),
              padding: p.tipo === "ticket" ? "26px 18px" : "34px 26px",
              overflow: "hidden",
              fontFamily: texto,
              color: p.tipo === "ticket" ? "#222" : "#1E3A8A",
            }}
          >
            {p.tipo === "hoja"
              ? new Array(7).fill(0).map((_, j) => (
                  <div
                    key={j}
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 60 + j * 50,
                      height: 2,
                      background: "#9CC3E6",
                    }}
                  />
                ))
              : null}
            {p.lineas.map((l, j) => (
              <div
                key={j}
                style={{
                  position: "relative",
                  fontWeight: p.tipo === "nota" ? 900 : 700,
                  fontSize:
                    p.tipo === "nota" ? 40 : p.tipo === "ticket" ? 22 : 28,
                  lineHeight: p.tipo === "hoja" ? "50px" : 1.35,
                  whiteSpace: "nowrap",
                  textAlign: p.tipo === "ticket" && j === 0 ? "center" : "left",
                  letterSpacing: p.tipo === "ticket" ? 1 : 0,
                  transform: `rotate(${(j % 2 ? 1 : -1) * 1.2}deg)`,
                }}
              >
                {l}
                {p.tachar.includes(j) ? (
                  <div
                    style={{
                      position: "absolute",
                      left: -6,
                      right: -6,
                      top: "50%",
                      height: 5,
                      background: k.rojo,
                      transform: "rotate(-3deg)",
                    }}
                  />
                ) : null}
              </div>
            ))}
            {p.tipo === "ticket" ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -10,
                  height: 20,
                  background:
                    "linear-gradient(135deg, transparent 50%, #1C2A40 50%) 0 0/20px 20px",
                }}
              />
            ) : null}
            {p.mancha ? (
              <div
                style={{
                  position: "absolute",
                  right: 20,
                  bottom: 30,
                  width: 130,
                  height: 130,
                  borderRadius: "50%",
                  border: "14px solid rgba(120,72,30,0.28)",
                }}
              />
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.max(0, spring({ frame: f + 6, fps, config: { damping: 10 } }));
  if (f >= 92) return null;
  return (
    <AbsoluteFill style={{ opacity: iv(f, [84, 92], [1, 0]) }}>
      {/* Franja oscura para que el título se lea sobre el lío */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 0,
          right: 0,
          height: 330,
          background:
            "linear-gradient(to bottom, rgba(15,23,36,0) 0%, rgba(15,23,36,0.92) 18%, rgba(15,23,36,0.92) 82%, rgba(15,23,36,0) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 230,
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

// Marco de celular con la app de ejemplo, o con la grabación real si existe.
const Celular: React.FC<{
  readonly src?: string;
  readonly children: React.ReactNode;
}> = ({ src, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.max(0, spring({ frame: f, fps, config: { damping: 14 } }));
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 270 }}>
      <div
        style={{
          width: 660,
          height: 1180,
          borderRadius: 70,
          background: "#05080D",
          padding: 18,
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 4px #2A3442",
          transform: `translateY(${(1 - s) * 200}px) scale(${0.9 + 0.1 * s})`,
          opacity: Math.min(1, s),
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 54,
            overflow: "hidden",
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
            children
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
        top: 165,
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
    <Papeles />
    <Gancho />
    <Dolor />
    <Sequence
      from={B.solucion[0]}
      durationInFrames={B.solucion[1] - B.solucion[0]}
    >
      <Celular src={grabacionApp}>
        <AppSolucion />
      </Celular>
    </Sequence>
    <Sequence
      from={B.resultado[0]}
      durationInFrames={B.resultado[1] - B.resultado[0]}
    >
      <Celular src={grabacionPlanilla}>
        <AppMes />
      </Celular>
    </Sequence>
    <Rotulo t="ASÍ LO HAGO YO" desde={B.solucion[0]} hasta={490} />
    <Rotulo t="EL STOCK, AL DÍA" desde={490} hasta={530} />
    <Rotulo t="QUÉ REPONER" desde={530} hasta={565} />
    <Rotulo t="Y LOS GASTOS" desde={565} hasta={B.solucion[1]} />
    <Rotulo t="A FIN DE MES" desde={B.resultado[0]} hasta={B.resultado[1]} />
    <Cierre />
    <Subtitulo />
  </AbsoluteFill>
);

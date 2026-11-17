import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { iv } from "../Cafe/CafeTikTok";
import { AppMaterial } from "./AppMaterial";

// Video de 30 s para ofrecer una app de gestión a comercios chicos. Primero
// muestra, sobre tomas reales de objetos (manos, cuaderno, calculadora,
// tickets; sin personas), todos los problemas que resuelve; después la app de
// ejemplo en Material Design (AppMaterial.tsx) dentro de un Android, y cierra
// con el llamado. Datos de prueba, sin marcas. Tomas: tools/clips_ventas.sh.

export const VENTAS_FRAMES = 900;

const fuente = '"Inter", sans-serif';
const k = {
  blanco: "#FFFFFF",
  suave: "rgba(255,255,255,0.72)",
  acento: "#34D399",
  alerta: "#F87171",
  fondo: "#0B1220",
};

const sale = Easing.out(Easing.cubic);

// ---- Tomas reales ----
type Toma = {
  readonly desde: number;
  readonly hasta: number;
  readonly id: string;
  readonly inicio: number;
  readonly x: number;
};

const tomas: Toma[] = [
  { desde: 0, hasta: 75, id: "45926", inicio: 1, x: 50 }, // papeles revueltos
  { desde: 75, hasta: 126, id: "25595", inicio: 2, x: 55 }, // anotar a mano
  { desde: 126, hasta: 177, id: "22827", inicio: 2, x: 40 }, // planillas
  { desde: 177, hasta: 228, id: "46977", inicio: 1, x: 50 }, // lupa sobre números
  { desde: 228, hasta: 279, id: "20847", inicio: 3, x: 45 }, // tickets
  { desde: 279, hasta: 336, id: "34125", inicio: 2, x: 55 }, // calculadora
];

const Toma: React.FC<{ readonly t: Toma }> = ({ t }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const largo = t.hasta - t.desde;
  // Empuje lento de cámara, sin golpes.
  const kz = iv(f, [0, largo], [1.06, 1.0], Easing.linear);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "black" }}>
      <OffthreadVideo
        src={staticFile(`ventas/clips/${t.id}.mp4`)}
        trimBefore={Math.round(t.inicio * fps)}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${t.x}% 50%`,
          transform: `scale(${kz})`,
          filter: "contrast(1.05) saturate(0.85) brightness(0.92)",
        }}
      />
      {/* Fundido corto entre tomas */}
      <AbsoluteFill
        style={{
          backgroundColor: "black",
          opacity:
            iv(f, [0, 5], [0.6, 0]) + iv(f, [largo - 4, largo], [0, 0.4]),
        }}
      />
    </AbsoluteFill>
  );
};

// ---- Texto ----
const Titular: React.FC<{
  readonly desde: number;
  readonly hasta: number;
  readonly top: number;
  readonly children: React.ReactNode;
  readonly tam?: number;
  readonly kicker?: string;
}> = ({ desde, hasta, top, children, tam = 84, kicker }) => {
  const f = useCurrentFrame();
  if (f < desde - 1 || f >= hasta) return null;
  const e = iv(f, [desde, desde + 12], [0, 1], sale);
  const s = iv(f, [hasta - 8, hasta], [1, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top,
        fontFamily: fuente,
        color: k.blanco,
        opacity: e * s,
        transform: `translateY(${(1 - e) * 24}px)`,
        textShadow: "0 4px 30px rgba(0,0,0,0.45)",
      }}
    >
      {kicker ? (
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 8,
            color: k.acento,
            marginBottom: 14,
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div
        style={{
          fontSize: tam,
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: -2,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Subtítulos de la voz (tal como dice el guion), sobrios, abajo.
const voz: [number, number, string][] = [
  [
    366,
    530,
    "Cargás la venta desde el celular: si no hay stock te avisa, y la factura sale sola.",
  ],
  [
    530,
    690,
    "El stock se actualiza solo, te dice qué comprar y cargás los gastos en un toque.",
  ],
  [690, 752, "Y a fin de mes ves cuánto ganaste de verdad."],
  [
    758,
    VENTAS_FRAMES,
    "Escribime “ventas” y te muestro cómo quedaría con tus productos.",
  ],
];

const Subtitulo: React.FC = () => {
  const f = useCurrentFrame();
  const l = voz.find(([a, b]) => f >= a && f < b);
  if (!l) return null;
  const [a, b, t] = l;
  const o =
    iv(f, [a, a + 6], [0, 1]) *
    (b === VENTAS_FRAMES ? 1 : iv(f, [b - 5, b], [1, 0]));
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 150,
        top: 1420,
        display: "flex",
        justifyContent: "center",
        opacity: o,
      }}
    >
      <div
        style={{
          padding: "16px 28px",
          borderRadius: 18,
          background: "rgba(10,14,22,0.62)",
          backdropFilter: "blur(10px)",
          fontFamily: fuente,
          fontSize: 40,
          fontWeight: 600,
          lineHeight: 1.3,
          color: k.blanco,
          textAlign: "center",
        }}
      >
        {t}
      </div>
    </div>
  );
};

// ---- Celular (Android) ----
const Celular: React.FC<{
  readonly children: React.ReactNode;
  readonly entra: number;
  readonly sale?: number;
}> = ({ children, entra, sale: hasta }) => {
  const f = useCurrentFrame();
  const e = iv(f, [entra, entra + 22], [0, 1], sale);
  const fuera =
    hasta === undefined
      ? 0
      : iv(f, [hasta, hasta + 16], [0, 1], Easing.in(Easing.cubic));
  const giroY = -14 * (1 - e) + Math.sin(f / 60) * 2;
  const giroX = 5 * (1 - e) + Math.cos(f / 70) * 1;
  return (
    <AbsoluteFill
      style={{ alignItems: "center", paddingTop: 300, perspective: 2400 }}
    >
      <div
        style={{
          width: 600,
          height: 1072,
          borderRadius: 64,
          padding: 16,
          background:
            "linear-gradient(150deg, #2B2F36 0%, #15181D 50%, #2B2F36 100%)",
          boxShadow:
            "0 60px 120px rgba(0,0,0,0.55), 0 0 0 2px rgba(255,255,255,0.07)",
          transform: `translateY(${(1 - e) * 120 + fuera * 60}px) rotateY(${giroY}deg) rotateX(${giroX}deg) scale(${1 - fuera * 0.08})`,
          opacity: e * (1 - fuera),
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 50,
            overflow: "hidden",
            background: "#000",
          }}
        >
          {children}
          {/* Cámara frontal */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 14,
              width: 26,
              height: 26,
              marginLeft: -13,
              borderRadius: "50%",
              background: "#000",
              zIndex: 20,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 30%)",
              zIndex: 20,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Fondo de estudio para la parte de la app.
const Estudio: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1200px 900px at ${50 + Math.sin(f / 90) * 6}% 40%, #1E293B 0%, #0F172A 45%, ${k.fondo} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(600px 400px at 50% 85%, rgba(52,211,153,0.10), rgba(0,0,0,0))",
        }}
      />
    </AbsoluteFill>
  );
};

// Cada problema: número y frase, sobre la toma.
const problemas: [number, number, string, string][] = [
  [75, 126, "Anotás las ventas", "a mano."],
  [126, 177, "Vendés algo", "que ya no tenías."],
  [177, 228, "No sabés qué reponer", "ni cuánto gastar."],
  [228, 279, "Los gastos y tickets", "se pierden."],
  [279, 336, "Y a fin de mes,", "¿cuánto ganaste?"],
];

const Problema: React.FC = () => {
  const f = useCurrentFrame();
  const i = problemas.findIndex(([a, b]) => f >= a && f < b);
  if (i < 0) return null;
  const [a, b, l1, l2] = problemas[i];
  const e = iv(f, [a, a + 10], [0, 1], sale);
  const o = e * iv(f, [b - 5, b], [1, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 1080,
        fontFamily: fuente,
        color: k.blanco,
        opacity: o,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            background: k.alerta,
            color: "#1F0A0A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 34,
            fontWeight: 800,
          }}
        >
          {i + 1}
        </div>
        {/* Avance: cinco rayitas */}
        <div style={{ display: "flex", gap: 8 }}>
          {problemas.map((_, j) => (
            <div
              key={j}
              style={{
                width: 46,
                height: 6,
                borderRadius: 3,
                background: j <= i ? k.alerta : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          fontSize: 80,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: -2,
          transform: `translateY(${(1 - e) * 24}px)`,
          textShadow: "0 4px 30px rgba(0,0,0,0.5)",
        }}
      >
        {l1}
        <br />
        <span style={{ color: k.alerta }}>{l2}</span>
      </div>
    </div>
  );
};

// Botón del cierre.
const Llamado: React.FC = () => {
  const f = useCurrentFrame();
  const e = iv(f, [784, 800], [0, 1], sale);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1050,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 34,
        opacity: e,
        transform: `translateY(${(1 - e) * 20}px)`,
        fontFamily: fuente,
      }}
    >
      <div
        style={{
          padding: "28px 56px",
          borderRadius: 60,
          background: k.acento,
          color: "#03261A",
          fontSize: 50,
          fontWeight: 800,
          boxShadow: "0 20px 50px rgba(52,211,153,0.3)",
        }}
      >
        Escribime “VENTAS”
      </div>
      <div style={{ fontSize: 36, fontWeight: 500, color: k.suave }}>
        Se adapta a tus productos y tu forma de vender
      </div>
    </div>
  );
};

export const VentasPro: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    {/* Problemas, sobre objetos reales */}
    {tomas.map((t) => (
      <Sequence
        key={t.desde}
        from={t.desde}
        durationInFrames={t.hasta - t.desde}
      >
        <Toma t={t} />
      </Sequence>
    ))}
    <Sequence durationInFrames={336}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.8) 100%)",
        }}
      />
    </Sequence>
    <Titular desde={-12} hasta={75} top={1040} tam={86}>
      ¿Todavía llevás
      <br />
      tu negocio <span style={{ color: k.alerta }}>en papel?</span>
    </Titular>
    <Problema />

    {/* La app */}
    <Sequence from={330} durationInFrames={570}>
      <Estudio />
    </Sequence>
    <Titular desde={336} hasta={366} top={760} tam={84}>
      Hay una forma
      <br />
      <span style={{ color: k.acento }}>más simple.</span>
    </Titular>
    <Sequence from={360} durationInFrames={410}>
      <Celular entra={0} sale={392}>
        <AppMaterial />
      </Celular>
    </Sequence>
    <Titular desde={366} hasta={418} top={165} tam={58} kicker="VENDER">
      Una venta en segundos
    </Titular>
    <Titular
      desde={418}
      hasta={462}
      top={165}
      tam={58}
      kicker="CONTROL DE STOCK"
    >
      Si no hay, <span style={{ color: k.alerta }}>te avisa</span>
    </Titular>
    <Titular desde={462} hasta={530} top={165} tam={58} kicker="FACTURA">
      Sale sola, numerada
    </Titular>
    <Titular desde={530} hasta={585} top={165} tam={58} kicker="INVENTARIO">
      El stock, siempre al día
    </Titular>
    <Titular desde={585} hasta={640} top={165} tam={58} kicker="COMPRAS">
      Te dice qué reponer
    </Titular>
    <Titular desde={640} hasta={690} top={165} tam={58} kicker="GASTOS">
      Cargados en un toque
    </Titular>
    <Titular desde={690} hasta={752} top={165} tam={58} kicker="REPORTES">
      Tu <span style={{ color: k.acento }}>ganancia real</span>, al día
    </Titular>

    {/* Cierre */}
    <Titular desde={762} hasta={VENTAS_FRAMES + 1} top={700} tam={92}>
      ¿Querés esto
      <br />
      para <span style={{ color: k.acento }}>tu negocio?</span>
    </Titular>
    <Llamado />
    <Subtitulo />
  </AbsoluteFill>
);

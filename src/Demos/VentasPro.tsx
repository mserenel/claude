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
import { AppMes, AppSolucion, pesos } from "./AppDemo";

// Video de 30 s para ofrecer una app de gestión a comercios chicos, con
// estética de producto: tomas reales (Mixkit) del problema —papeles, cuentas a
// mano— y después la app de ejemplo en un celular, con títulos sobrios,
// movimientos suaves y datos de prueba. Sin marcas ni productos reales.
// Las tomas se bajan con tools/clips_ventas.sh a public/ventas/clips/.

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
  { desde: 0, hasta: 48, id: "45922", inicio: 1, x: 42 }, // tapado de papeles
  { desde: 48, hasta: 96, id: "45923", inicio: 2, x: 45 }, // pila de hojas
  { desde: 96, hasta: 150, id: "34126", inicio: 3, x: 50 }, // cuaderno y calculadora
  { desde: 150, hasta: 196, id: "25595", inicio: 2, x: 55 }, // anotando a mano
  { desde: 196, hasta: 244, id: "4526", inicio: 3, x: 48 }, // tira los papeles
  { desde: 780, hasta: VENTAS_FRAMES, id: "48714", inicio: 2, x: 50 }, // la dueña, tranquila
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
  [100, 168, "Anotás en un cuaderno, después lo pasás al Excel…"],
  [168, 240, "…y a fin de mes los números no dan."],
  [
    246,
    320,
    "Esto lo uso en mi negocio. Cargo la venta desde el celular en segundos,",
  ],
  [320, 390, "el sistema me frena si no hay stock"],
  [390, 600, "y todo se registra solo."],
  [606, 700, "Y al final del mes ya sé cuánto vendí y cuánto gané de verdad."],
  [700, 780, "Sin pasar nada a mano."],
  [
    792,
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

// ---- Celular ----
const Celular: React.FC<{
  readonly children: React.ReactNode;
  readonly entra: number;
}> = ({ children, entra }) => {
  const f = useCurrentFrame();
  const e = iv(f, [entra, entra + 22], [0, 1], sale);
  // Leve giro en 3D que se acomoda, y una deriva lenta.
  const giroY = -16 * (1 - e) + Math.sin(f / 60) * 2.5;
  const giroX = 6 * (1 - e) + Math.cos(f / 70) * 1.2;
  return (
    <AbsoluteFill
      style={{ alignItems: "center", paddingTop: 300, perspective: 2400 }}
    >
      <div
        style={{
          width: 600,
          height: 1072,
          borderRadius: 86,
          padding: 16,
          background:
            "linear-gradient(145deg, #4B5563 0%, #1F2937 35%, #111827 70%, #374151 100%)",
          boxShadow:
            "0 60px 120px rgba(0,0,0,0.55), 0 0 0 2px rgba(255,255,255,0.08), inset 0 0 0 3px rgba(255,255,255,0.06)",
          transform: `translateY(${(1 - e) * 120}px) rotateY(${giroY}deg) rotateX(${giroX}deg)`,
          opacity: e,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 70,
            overflow: "hidden",
            background: "#000",
          }}
        >
          {children}
          {/* Isla de la cámara */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 18,
              width: 150,
              height: 42,
              marginLeft: -75,
              borderRadius: 21,
              background: "#000",
              zIndex: 20,
            }}
          />
          {/* Reflejo del vidrio */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 32%)",
              pointerEvents: "none",
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

// Tarjetas con cifras que flotan al lado del celular en el resultado.
const Cifra: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly desde: number;
  readonly titulo: string;
  readonly valor: number;
  readonly color: string;
}> = ({ x, y, desde, titulo, valor, color }) => {
  const f = useCurrentFrame();
  if (f >= 780) return null;
  const e = iv(f, [desde, desde + 16], [0, 1], sale);
  const cuenta = iv(f, [desde, desde + 40], [0, 1], sale);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "26px 34px",
        borderRadius: 28,
        background: "rgba(255,255,255,0.92)",
        boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
        fontFamily: fuente,
        opacity: e,
        transform: `translateY(${(1 - e) * 30}px)`,
        zIndex: 30,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 600, color: "#64748B" }}>
        {titulo}
      </div>
      <div style={{ fontSize: 56, fontWeight: 800, color, letterSpacing: -1 }}>
        {pesos(valor * cuenta)}
      </div>
    </div>
  );
};

// Botón del cierre.
const Llamado: React.FC = () => {
  const f = useCurrentFrame();
  const e = iv(f, [806, 822], [0, 1], sale);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1010,
        display: "flex",
        justifyContent: "center",
        opacity: e,
        transform: `translateY(${(1 - e) * 20}px)`,
      }}
    >
      <div
        style={{
          padding: "28px 56px",
          borderRadius: 60,
          background: k.blanco,
          color: "#0F172A",
          fontFamily: fuente,
          fontSize: 50,
          fontWeight: 800,
          boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
        }}
      >
        Escribime “VENTAS”
      </div>
    </div>
  );
};

export const VentasPro: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    {/* Problema: tomas reales */}
    {tomas.map((t) => (
      <Sequence
        key={t.desde}
        from={t.desde}
        durationInFrames={t.hasta - t.desde}
      >
        <Toma t={t} />
      </Sequence>
    ))}
    {/* Sombra para leer el texto sobre las tomas */}
    <Sequence durationInFrames={244}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </Sequence>
    <Titular desde={-12} hasta={92} top={300}>
      ¿Todavía controlás
      <br />
      las ventas <span style={{ color: k.alerta }}>en papel?</span>
    </Titular>
    <Titular desde={176} hasta={242} top={300} tam={76}>
      Vendés lo que <span style={{ color: k.alerta }}>no tenés.</span>
      <br />
      No sabés <span style={{ color: k.alerta }}>cuánto ganás.</span>
    </Titular>

    {/* Solución: la app */}
    <Sequence from={240} durationInFrames={540}>
      <Estudio />
    </Sequence>
    <Sequence from={240} durationInFrames={360}>
      <Celular entra={0}>
        <AppSolucion />
      </Celular>
    </Sequence>
    <Sequence from={600} durationInFrames={180}>
      <Celular entra={-30}>
        <AppMes />
      </Celular>
    </Sequence>
    <Titular desde={244} hasta={318} top={165} tam={58} kicker="VENDER">
      Una venta en segundos
    </Titular>
    <Titular
      desde={318}
      hasta={390}
      top={165}
      tam={58}
      kicker="CONTROL DE STOCK"
    >
      Si no hay, <span style={{ color: k.alerta }}>no te deja vender</span>
    </Titular>
    <Titular desde={390} hasta={440} top={165} tam={58} kicker="VENDER">
      Sumás productos en un toque
    </Titular>
    <Titular desde={440} hasta={490} top={165} tam={58} kicker="FACTURA">
      Se genera sola
    </Titular>
    <Titular desde={490} hasta={530} top={165} tam={58} kicker="INVENTARIO">
      El stock se actualiza solo
    </Titular>
    <Titular desde={530} hasta={600} top={165} tam={58} kicker="COMPRAS">
      Te dice qué reponer
    </Titular>
    <Titular desde={600} hasta={780} top={165} tam={58} kicker="REPORTES">
      Cuánto vendiste y <span style={{ color: k.acento }}>cuánto ganaste</span>
    </Titular>
    <Cifra
      x={40}
      y={560}
      desde={612}
      titulo="Vendiste"
      valor={412300}
      color="#0F172A"
    />
    <Cifra
      x={600}
      y={980}
      desde={632}
      titulo="Ganancia"
      valor={128800}
      color="#059669"
    />

    {/* Cierre: la dueña del local, tranquila */}
    <Sequence from={780} durationInFrames={120}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.65))",
        }}
      />
    </Sequence>
    <Titular desde={786} hasta={VENTAS_FRAMES + 1} top={620} tam={88}>
      ¿Querés esto
      <br />
      para <span style={{ color: k.acento }}>tu negocio?</span>
    </Titular>
    <Llamado />
    <Subtitulo />
  </AbsoluteFill>
);

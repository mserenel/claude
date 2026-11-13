import {
  AbsoluteFill,
  Easing,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { iv, texto, titular } from "../Cafe/CafeTikTok";

// Demo para mostrarle a un amigo cómo podría ser un video de producto: codo
// de 90° de 20 mm para termofusión (Aquasystem). Sin fotos reales todavía: el
// codo está dibujado y el negocio es un lugar a completar. No usa el logo de la
// marca ni la presenta como oficial.

export const CODO_FRAMES = 300;

const k = {
  fondo: "#14202B",
  grilla: "rgba(255,255,255,0.05)",
  verde: "#2FA35A",
  verdeClaro: "#6FD08F",
  verdeOscuro: "#16592F",
  blanco: "#F4F7F5",
  amarillo: "#FFC83D",
};

const sombra = "0 6px 0 rgba(0,0,0,0.35), 0 10px 40px rgba(0,0,0,0.5)";

const Fondo: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 45%, #22394A 0%, ${k.fondo} 65%)`,
    }}
  >
    <svg width={1080} height={1920}>
      {new Array(28).fill(0).map((_, i) => (
        <path
          key={`v${i}`}
          d={`M${i * 40},0 V1920`}
          stroke={k.grilla}
          strokeWidth={i % 5 ? 1 : 2}
        />
      ))}
      {new Array(49).fill(0).map((_, i) => (
        <path
          key={`h${i}`}
          d={`M0,${i * 40} H1080`}
          stroke={k.grilla}
          strokeWidth={i % 5 ? 1 : 2}
        />
      ))}
    </svg>
  </AbsoluteFill>
);

// El codo, con volumen: dos bocas (izquierda y abajo) unidas por la curva.
const Codo: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="codo-h" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor={k.verdeClaro} />
        <stop offset="0.35" stopColor={k.verde} />
        <stop offset="1" stopColor={k.verdeOscuro} />
      </linearGradient>
      <linearGradient id="codo-v" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor={k.verdeClaro} />
        <stop offset="0.35" stopColor={k.verde} />
        <stop offset="1" stopColor={k.verdeOscuro} />
      </linearGradient>
      <radialGradient id="codo-curva" cx="0" cy="1" r="1.3">
        <stop offset="0.2" stopColor={k.verdeOscuro} />
        <stop offset="0.55" stopColor={k.verde} />
        <stop offset="0.8" stopColor={k.verdeClaro} />
        <stop offset="1" stopColor={k.verde} />
      </radialGradient>
    </defs>
    {/* Curva */}
    <path
      d="M-62,-64 L0,-64 C38,-64 64,-38 64,0 L64,62 L-62,62 Z"
      fill="url(#codo-curva)"
    />
    {/* Boca izquierda */}
    <rect
      x={-210}
      y={-70}
      width={150}
      height={140}
      rx={10}
      fill="url(#codo-h)"
    />
    <rect x={-70} y={-64} width={12} height={128} fill="rgba(0,0,0,0.18)" />
    {/* Boca de abajo */}
    <rect x={-70} y={58} width={140} height={150} rx={10} fill="url(#codo-v)" />
    <rect x={-64} y={58} width={128} height={12} fill="rgba(0,0,0,0.18)" />
    {/* Aberturas */}
    <ellipse cx={-210} cy={0} rx={18} ry={70} fill={k.verde} />
    <ellipse cx={-210} cy={0} rx={11} ry={47} fill="#0B2414" />
    <ellipse cx={0} cy={208} rx={70} ry={18} fill={k.verde} />
    <ellipse cx={0} cy={208} rx={47} ry={11} fill="#0B2414" />
    {/* Medida en relieve */}
    <text
      x={6}
      y={20}
      textAnchor="middle"
      fontFamily={titular}
      fontSize={54}
      fill="rgba(0,0,0,0.22)"
    >
      20
    </text>
    <text
      x={4}
      y={17}
      textAnchor="middle"
      fontFamily={titular}
      fontSize={54}
      fill="rgba(255,255,255,0.28)"
    >
      20
    </text>
  </g>
);

// Caño de 20 que entra en una boca.
const Cano: React.FC<{ readonly vertical?: boolean }> = ({ vertical }) =>
  vertical ? (
    <rect x={-46} y={0} width={92} height={520} fill="url(#codo-v)" />
  ) : (
    <rect x={-520} y={-46} width={520} height={92} fill="url(#codo-h)" />
  );

const Etiqueta: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly t: string;
  readonly desde: number;
}> = ({ x, y, t, desde }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.max(
    0,
    spring({ frame: f - desde, fps, config: { damping: 12 } }),
  );
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s})`,
        padding: "14px 30px",
        borderRadius: 60,
        background: k.amarillo,
        color: "#1A1A1A",
        fontFamily: texto,
        fontWeight: 900,
        fontSize: 54,
        whiteSpace: "nowrap",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      }}
    >
      {t}
    </div>
  );
};

const Escena: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = Math.max(
    0,
    spring({ frame: f + 4, fps, config: { damping: 11 } }),
  );
  // Gira al entrar y después flota apenas.
  const giro = (1 - entra) * 200 + Math.sin(f / 18) * 6;
  const uniones = iv(f, [150, 185], [0, 1], Easing.out(Easing.cubic));
  const alejar = iv(f, [140, 170], [1, 0.62]);
  const y = iv(f, [140, 170], [860, 820]);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <ellipse
        cx={540}
        cy={1230}
        rx={380 * entra}
        ry={30 * entra}
        fill="rgba(0,0,0,0.35)"
      />
      <g
        transform={`translate(560 ${y}) scale(${entra * alejar * 1.6}) rotate(${giro})`}
      >
        {/* Caños que entran por termofusión */}
        <g
          transform={`translate(${-200 - (1 - uniones) * 500} 0)`}
          opacity={f >= 150 ? 1 : 0}
        >
          <Cano />
        </g>
        <g
          transform={`translate(0 ${200 + (1 - uniones) * 500})`}
          opacity={f >= 150 ? 1 : 0}
        >
          <Cano vertical />
        </g>
        <Codo />
        {/* Destello de calor en la unión */}
        {[
          [-210, 0],
          [0, 208],
        ].map(([cx, cy]) => (
          <circle
            key={cx}
            cx={cx}
            cy={cy}
            r={90}
            fill={k.amarillo}
            opacity={iv(f, [182, 188, 205], [0, 0.55, 0])}
          />
        ))}
      </g>
    </svg>
  );
};

const Textos: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.max(0, spring({ frame: f + 6, fps, config: { damping: 10 } }));
  const fin = Math.max(
    0,
    spring({ frame: f - 232, fps, config: { damping: 12 } }),
  );
  return (
    <>
      {/* Gancho y título */}
      {f < 232 ? (
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 40,
            right: 40,
            textAlign: "center",
            textShadow: sombra,
            transform: `scale(${0.7 + 0.3 * s})`,
            opacity: Math.min(1, s) * iv(f, [224, 232], [1, 0]),
          }}
        >
          <div
            style={{
              fontFamily: texto,
              fontWeight: 800,
              fontSize: 60,
              color: k.blanco,
            }}
          >
            {f < 60 ? "¿Necesitás un" : "Aquasystem"}
          </div>
          <div
            style={{
              fontFamily: titular,
              fontSize: 150,
              whiteSpace: "nowrap",
              lineHeight: 1,
              color: k.amarillo,
            }}
          >
            {f < 60 ? "CODO DE 20?" : "CODO 90° DE 20"}
          </div>
        </div>
      ) : null}
      {/* Datos del producto */}
      {f >= 60 && f < 150 ? (
        <>
          <Etiqueta x={290} y={1380} t={'20 mm (½")'} desde={66} />
          <Etiqueta x={790} y={1380} t="Ángulo 90°" desde={80} />
          <Etiqueta x={540} y={1510} t="Para termofusión" desde={94} />
        </>
      ) : null}
      {f >= 150 && f < 232 ? (
        <div
          style={{
            position: "absolute",
            top: 1300,
            left: 60,
            right: 150,
            textAlign: "center",
            fontFamily: texto,
            fontWeight: 900,
            fontSize: 72,
            lineHeight: 1.12,
            color: k.blanco,
            textShadow: sombra,
            opacity: iv(f, [186, 196], [0, 1]) * iv(f, [224, 232], [1, 0]),
          }}
        >
          Unión <span style={{ color: k.amarillo }}>firme</span> por{" "}
          <span style={{ color: k.amarillo }}>termofusión</span>
        </div>
      ) : null}
      {/* Cierre: el negocio (a completar) */}
      {f >= 232 ? (
        <div
          style={{
            position: "absolute",
            top: 230,
            left: 40,
            right: 40,
            textAlign: "center",
            textShadow: sombra,
            opacity: Math.min(1, fin),
            transform: `translateY(${(1 - fin) * 40}px)`,
          }}
        >
          <div
            style={{
              fontFamily: titular,
              fontSize: 150,
              lineHeight: 1,
              color: k.amarillo,
            }}
          >
            HAY STOCK
          </div>
          <div
            style={{
              fontFamily: texto,
              fontWeight: 800,
              fontSize: 58,
              color: k.blanco,
              marginTop: 10,
            }}
          >
            Pedilo hoy en
          </div>
          <div
            style={{
              display: "inline-block",
              marginTop: 18,
              padding: "16px 40px",
              border: `4px dashed ${k.blanco}`,
              borderRadius: 18,
              fontFamily: texto,
              fontWeight: 900,
              fontSize: 64,
              color: k.blanco,
            }}
          >
            TU NEGOCIO
          </div>
          <div
            style={{
              fontFamily: texto,
              fontWeight: 700,
              fontSize: 44,
              color: k.blanco,
              marginTop: 18,
              opacity: 0.85,
            }}
          >
            Consultá por WhatsApp
          </div>
        </div>
      ) : null}
    </>
  );
};

export const CodoAquasystem: React.FC = () => (
  <AbsoluteFill>
    <Fondo />
    <Escena />
    <Textos />
  </AbsoluteFill>
);

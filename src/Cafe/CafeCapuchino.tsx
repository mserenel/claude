import {
  AbsoluteFill,
  Easing,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Clip, type Toma } from "./CafeReal";
import { c, iv, texto, titular } from "./CafeTikTok";

// "Tu capuchino, de principio a fin": un barista lo prepara paso a paso, en
// tomas reales (Mixkit). Formato de proceso, casi sin texto: arranca con el
// resultado (el latte art) para enganchar y después muestra cómo se llega.

export const CAPUCHINO_FRAMES = 450;

const tomas: Toma[] = [
  { desde: 0, hasta: 36, id: "41859", inicio: 4, x: 42 }, // el resultado
  { desde: 36, hasta: 81, id: "3575", inicio: 2, x: 22 }, // molinillo
  { desde: 81, hasta: 126, id: "3572", inicio: 1, x: 24 }, // dosis en el portafiltro
  { desde: 126, hasta: 186, id: "41865", inicio: 3, x: 50 }, // extracción
  { desde: 186, hasta: 231, id: "3574", inicio: 2, x: 64 }, // vaporizador
  { desde: 231, hasta: 276, id: "3576", inicio: 2, x: 35 }, // leche cremosa
  { desde: 276, hasta: 366, id: "810", inicio: 6, x: 45 }, // latte art
  { desde: 366, hasta: CAPUCHINO_FRAMES, id: "41859", inicio: 7, x: 42 }, // servido
];

const pasos: [number, number, string][] = [
  [36, 81, "Moler el café"],
  [81, 126, "Dosificar y compactar"],
  [126, 186, "Extraer el espresso"],
  [186, 276, "Vaporizar la leche"],
  [276, 366, "Hacer el latte art"],
];

const sombra = "0 6px 0 rgba(0,0,0,0.5), 0 10px 40px rgba(0,0,0,0.7)";

const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.max(0, spring({ frame: f + 6, fps, config: { damping: 10 } }));
  if (f >= 40) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 300,
        left: 40,
        right: 40,
        textAlign: "center",
        transform: `scale(${0.7 + 0.3 * s})`,
        opacity: Math.min(1, s) * iv(f, [32, 40], [1, 0]),
        textShadow: sombra,
      }}
    >
      <div
        style={{
          fontFamily: titular,
          fontSize: 170,
          lineHeight: 0.95,
          color: c.caramelo,
        }}
      >
        TU CAPUCHINO
      </div>
      <div
        style={{
          fontFamily: texto,
          fontWeight: 800,
          fontSize: 64,
          color: c.crema,
        }}
      >
        de principio a fin
      </div>
    </div>
  );
};

// Etiqueta de cada paso, abajo: número y nombre.
const Paso: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const i = pasos.findIndex(([a, b]) => f >= a && f < b);
  if (i < 0) return null;
  const [a, b, nombre] = pasos[i];
  const s = Math.max(0, spring({ frame: f - a, fps, config: { damping: 12 } }));
  return (
    <div
      style={{
        position: "absolute",
        top: 1230,
        left: 0,
        right: 120,
        display: "flex",
        justifyContent: "center",
        opacity: iv(f, [b - 5, b], [1, 0]),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "16px 36px 16px 18px",
          borderRadius: 80,
          background: "rgba(20,12,8,0.72)",
          transform: `translateY(${(1 - s) * 40}px) scale(${0.85 + 0.15 * s})`,
          opacity: Math.min(1, s),
        }}
      >
        <div
          style={{
            width: 78,
            height: 78,
            borderRadius: 40,
            background: c.caramelo,
            color: c.espresso,
            fontFamily: titular,
            fontSize: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {i + 1}
        </div>
        <div
          style={{
            fontFamily: texto,
            fontWeight: 800,
            fontSize: 56,
            color: c.crema,
          }}
        >
          {nombre}
        </div>
      </div>
    </div>
  );
};

const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.max(
    0,
    spring({ frame: f - 372, fps, config: { damping: 12 } }),
  );
  const s2 = Math.max(
    0,
    spring({ frame: f - 395, fps, config: { damping: 12 } }),
  );
  if (f < 366) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: titular,
          fontSize: 190,
          color: c.caramelo,
          transform: `scale(${0.7 + 0.3 * s})`,
          opacity: Math.min(1, s),
          textShadow: sombra,
        }}
      >
        LISTO.
      </div>
      <div
        style={{
          position: "absolute",
          top: 1230,
          left: 60,
          right: 150,
          textAlign: "center",
          fontFamily: texto,
          fontWeight: 900,
          fontSize: 64,
          lineHeight: 1.15,
          color: c.crema,
          opacity: Math.min(1, s2),
          transform: `translateY(${(1 - s2) * 30}px)`,
          textShadow: sombra,
        }}
      >
        ¿Del 1 al 10, <span style={{ color: c.caramelo }}>cuánto le das?</span>
      </div>
    </>
  );
};

// Barra fina de avance arriba: muestra que falta poco para el resultado.
const Avance: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 190,
        left: 90,
        right: 90,
        height: 10,
        borderRadius: 5,
        background: "rgba(244,233,220,0.2)",
        overflow: "hidden",
        opacity: iv(f, [30, 40], [0, 1]) * iv(f, [360, 370], [1, 0]),
      }}
    >
      <div
        style={{
          width: `${iv(f, [36, 366], [0, 100], Easing.linear)}%`,
          height: "100%",
          background: c.caramelo,
        }}
      />
    </div>
  );
};

export const CafeCapuchino: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    {tomas.map((t) => (
      <Sequence
        key={t.desde}
        from={t.desde}
        durationInFrames={t.hasta - t.desde}
      >
        <Clip t={t} />
      </Sequence>
    ))}
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 56%, rgba(0,0,0,0.65) 78%, rgba(0,0,0,0.4) 100%)",
      }}
    />
    <Gancho />
    <Avance />
    <Paso />
    <Cierre />
  </AbsoluteFill>
);

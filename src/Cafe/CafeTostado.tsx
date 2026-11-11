import {
  AbsoluteFill,
  Easing,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Clip, type Toma } from "./CafeReal";
import {
  c,
  iv,
  type Linea,
  Progreso,
  Subtitulos,
  texto,
  titular,
  TituloError,
} from "./CafeTikTok";

// Mito 8 de la serie de café: "¿El tostado oscuro tiene más cafeína?". La
// cafeína casi no cambia al tostar; el oscuro sólo sabe más fuerte, y medido
// con cuchara el claro tiene apenas más (su grano es más denso). Tomas reales
// de Mixkit (tools/clips_cafe.sh).

export const TOSTADO_FRAMES = 600;

const P = {
  p1: [60, 200],
  p2: [200, 340],
  p3: [340, 480],
} as const;

const tomas: Toma[] = [
  { desde: 0, hasta: 60, id: "100239", inicio: 1, x: 50 }, // granos tostados humeando
  { desde: 60, hasta: 130, id: "3571", inicio: 2, x: 52 }, // espresso oscuro
  { desde: 130, hasta: 200, id: "100241", inicio: 2, x: 60 }, // tostado oscuro
  { desde: 200, hasta: 270, id: "4676", inicio: 2, x: 58 }, // tostando al fuego
  { desde: 270, hasta: 340, id: "4982", inicio: 2, x: 50 }, // granos cayendo
  { desde: 340, hasta: 410, id: "3572", inicio: 1, x: 24 }, // dosis medida
  { desde: 410, hasta: 480, id: "100246", inicio: 3, x: 50 }, // granos de cerca
  { desde: 480, hasta: TOSTADO_FRAMES, id: "43940", inicio: 0, x: 45 }, // taza entre granos
];

const lineas: Linea[] = [
  { desde: 34, hasta: 60, t: "Spoiler: *no" },
  { desde: 66, hasta: 130, t: "El oscuro es más *amargo e *intenso" },
  { desde: 130, hasta: 200, t: "Por eso *parece más fuerte" },
  { desde: 206, hasta: 270, t: "Pero la cafeína *aguanta el tostado" },
  { desde: 270, hasta: 340, t: "Casi no cambia entre *claro y *oscuro" },
  {
    desde: 346,
    hasta: 410,
    t: "Con cuchara, el *claro tiene *un *poquito *más",
  },
  { desde: 410, hasta: 480, t: "Porque su grano es más *denso" },
  { desde: 488, hasta: TOSTADO_FRAMES, t: "¿Vos lo tomás *claro u *oscuro?" },
];

const sombraTexto = "0 6px 0 rgba(0,0,0,0.5), 0 10px 40px rgba(0,0,0,0.7)";

const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.max(0, spring({ frame: f + 6, fps, config: { damping: 10 } }));
  const mito = Math.max(
    0,
    spring({ frame: f - 30, fps, config: { damping: 8 } }),
  );
  if (f >= 64) return null;
  return (
    <AbsoluteFill style={{ opacity: iv(f, [56, 64], [1, 0]) }}>
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 40,
          right: 40,
          textAlign: "center",
          transform: `scale(${0.7 + 0.3 * s})`,
          opacity: Math.min(1, s),
          textShadow: sombraTexto,
        }}
      >
        <div
          style={{
            fontFamily: texto,
            fontWeight: 800,
            fontSize: 62,
            color: c.crema,
          }}
        >
          ¿El café oscuro tiene
        </div>
        <div
          style={{
            fontFamily: titular,
            fontSize: 150,
            lineHeight: 0.95,
            whiteSpace: "nowrap",
            color: c.caramelo,
          }}
        >
          MÁS CAFEÍNA?
        </div>
      </div>
      {/* Sello de "MITO" */}
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: f >= 30 ? 1 : 0,
        }}
      >
        <div
          style={{
            padding: "6px 40px",
            border: `10px solid ${c.rojo}`,
            borderRadius: 18,
            color: c.rojo,
            fontFamily: titular,
            fontSize: 150,
            lineHeight: 1.05,
            letterSpacing: 8,
            background: "rgba(0,0,0,0.35)",
            transform: `rotate(-10deg) scale(${2 - mito})`,
            opacity: Math.min(1, mito),
          }}
        >
          MITO
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.max(
    0,
    spring({ frame: f - 484, fps, config: { damping: 12 } }),
  );
  if (f < 480) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 290,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: texto,
        fontWeight: 800,
        fontSize: 54,
        color: c.crema,
        opacity: Math.min(1, s),
        transform: `translateY(${(1 - s) * 30}px)`,
        textShadow: sombraTexto,
      }}
    >
      Elegilo por su
      <div
        style={{
          fontFamily: titular,
          fontSize: 170,
          lineHeight: 1,
          color: c.caramelo,
        }}
      >
        SABOR
      </div>
      no por la cafeína
    </div>
  );
};

// "≈" grande en el dato 2: claro y oscuro, casi igual.
const CasiIgual: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 276 || f >= 340) return null;
  const s = iv(f, [276, 284], [0.6, 1], Easing.out(Easing.back(2)));
  const o = iv(f, [276, 281], [0, 1]) * iv(f, [334, 340], [1, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top: 620,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 34,
        fontFamily: titular,
        fontSize: 96,
        color: c.crema,
        opacity: o,
        transform: `scale(${s})`,
        textShadow: sombraTexto,
      }}
    >
      CLARO
      {/* "Casi igual" (≈), dibujado: la tipografía no trae el signo. */}
      <svg width={110} height={90} viewBox="0 0 110 90">
        {[28, 62].map((y) => (
          <path
            key={y}
            d={`M8,${y} C30,${y - 18} 50,${y - 18} 55,${y} C60,${y + 18} 80,${y + 18} 102,${y}`}
            stroke={c.caramelo}
            strokeWidth={13}
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </svg>
      OSCURO
    </div>
  );
};

export const CafeTostado: React.FC = () => (
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
          "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.85) 74%, rgba(0,0,0,0.6) 100%)",
      }}
    />
    <Gancho />
    <TituloError
      n={1}
      etiqueta="DATO"
      titulo="Sabor no es cafeína"
      desde={P.p1[0]}
      hasta={P.p1[1]}
    />
    <TituloError
      n={2}
      etiqueta="DATO"
      titulo="El tostado"
      desde={P.p2[0]}
      hasta={P.p2[1]}
    />
    <TituloError
      n={3}
      etiqueta="DATO"
      titulo="Medido con cuchara"
      desde={P.p3[0]}
      hasta={P.p3[1]}
    />
    <CasiIgual />
    <Cierre />
    <Progreso tramos={[P.p1, P.p2, P.p3]} />
    <Subtitulos lineas={lineas} total={TOSTADO_FRAMES} />
  </AbsoluteFill>
);

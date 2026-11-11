import {
  AbsoluteFill,
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

// "¿Qué molienda va con tu café?": fina para espresso, media para filtro y
// gruesa para Chemex y prensa francesa, cada una con su comparación (sal fina,
// arena, sal gruesa). Tomas reales de Mixkit (tools/clips_cafe.sh).

export const MOLIENDA_FRAMES = 600;

const P = {
  p1: [60, 200],
  p2: [200, 340],
  p3: [340, 480],
} as const;

const tomas: Toma[] = [
  { desde: 0, hasta: 60, id: "100256", inicio: 2, x: 53 }, // molido cayendo
  { desde: 60, hasta: 110, id: "3575", inicio: 2, x: 22 }, // molinillo de espresso
  { desde: 110, hasta: 150, id: "3572", inicio: 1, x: 24 }, // molienda fina
  { desde: 150, hasta: 200, id: "41865", inicio: 3, x: 50 }, // espresso
  { desde: 200, hasta: 270, id: "4984", inicio: 2, x: 62 }, // molienda media al filtro
  { desde: 270, hasta: 340, id: "816", inicio: 4, x: 60 }, // café de filtro
  { desde: 340, hasta: 390, id: "100343", inicio: 4, x: 50 }, // molienda gruesa
  { desde: 390, hasta: 480, id: "100345", inicio: 4, x: 50 }, // Chemex
  { desde: 480, hasta: MOLIENDA_FRAMES, id: "43935", inicio: 2, x: 52 }, // taza
];

const lineas: Linea[] = [
  { desde: 30, hasta: 60, t: "Si la errás, tu café sale *mal" },
  { desde: 66, hasta: 130, t: "*Fina, como sal fina" },
  { desde: 130, hasta: 200, t: "Para *espresso" },
  { desde: 206, hasta: 270, t: "*Media, como arena" },
  { desde: 270, hasta: 340, t: "Para café de *filtro" },
  { desde: 346, hasta: 410, t: "*Gruesa, como sal gruesa" },
  { desde: 410, hasta: 480, t: "Para *Chemex y *prensa *francesa" },
  { desde: 488, hasta: MOLIENDA_FRAMES, t: "Guardalo para *no *errarle" },
];

const sombraTexto = "0 6px 0 rgba(0,0,0,0.5), 0 10px 40px rgba(0,0,0,0.7)";

const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.max(0, spring({ frame: f + 6, fps, config: { damping: 10 } }));
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
          ¿Qué molienda va
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
          CON TU CAFÉ?
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
      ¿Y vos con qué
      <div
        style={{
          fontFamily: titular,
          fontSize: 170,
          lineHeight: 1,
          color: c.caramelo,
        }}
      >
        LO HACÉS?
      </div>
    </div>
  );
};

export const CafeMolienda: React.FC = () => (
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
      etiqueta="MOLIENDA"
      titulo="Fina"
      desde={P.p1[0]}
      hasta={P.p1[1]}
    />
    <TituloError
      n={2}
      etiqueta="MOLIENDA"
      titulo="Media"
      desde={P.p2[0]}
      hasta={P.p2[1]}
    />
    <TituloError
      n={3}
      etiqueta="MOLIENDA"
      titulo="Gruesa"
      desde={P.p3[0]}
      hasta={P.p3[1]}
    />
    <Cierre />
    <Progreso tramos={[P.p1, P.p2, P.p3]} />
    <Subtitulos lineas={lineas} total={MOLIENDA_FRAMES} />
  </AbsoluteFill>
);

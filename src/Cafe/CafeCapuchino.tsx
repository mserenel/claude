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

// Videos de proceso ("Tu capuchino, de principio a fin", "Café de Chemex"):
// alguien prepara un café paso a paso, en tomas reales (Mixkit). Casi sin
// texto: arranca con el resultado para enganchar y después muestra cómo se
// llega.

// Cada video de proceso es una receta: tomas, pasos, título y pregunta final.
// El cierre arranca donde termina el último paso.
export type Receta = {
  readonly total: number;
  readonly tomas: Toma[];
  readonly pasos: [number, number, string][];
  readonly titulo: string;
  readonly subtitulo: string;
  readonly pregunta: [string, string]; // texto normal + parte resaltada
};

export const CAPUCHINO_FRAMES = 450;

export const capuchino: Receta = {
  total: CAPUCHINO_FRAMES,
  titulo: "TU CAPUCHINO",
  subtitulo: "de principio a fin",
  pregunta: ["¿Del 1 al 10, ", "cuánto le das?"],
  tomas: [
    { desde: 0, hasta: 36, id: "41859", inicio: 4, x: 42 }, // el resultado
    { desde: 36, hasta: 81, id: "3575", inicio: 2, x: 22 }, // molinillo
    { desde: 81, hasta: 126, id: "3572", inicio: 1, x: 24 }, // dosis
    { desde: 126, hasta: 186, id: "41865", inicio: 3, x: 50 }, // extracción
    { desde: 186, hasta: 231, id: "3574", inicio: 2, x: 64 }, // vaporizador
    { desde: 231, hasta: 276, id: "3576", inicio: 2, x: 35 }, // leche
    { desde: 276, hasta: 366, id: "810", inicio: 6, x: 45 }, // latte art
    { desde: 366, hasta: CAPUCHINO_FRAMES, id: "41859", inicio: 7, x: 42 },
  ],
  pasos: [
    [36, 81, "Moler el café"],
    [81, 126, "Dosificar y compactar"],
    [126, 186, "Extraer el espresso"],
    [186, 276, "Vaporizar la leche"],
    [276, 366, "Hacer el latte art"],
  ],
};

// Café de Chemex: todas las tomas de la misma mesa (Mixkit).
export const CHEMEX_FRAMES = 450;

export const chemex: Receta = {
  total: CHEMEX_FRAMES,
  titulo: "CAFÉ DE CHEMEX",
  subtitulo: "como en una cafetería",
  pregunta: ["¿Chemex o ", "espresso?"],
  tomas: [
    { desde: 0, hasta: 36, id: "100344", inicio: 8, x: 50 }, // agua cayendo
    { desde: 36, hasta: 81, id: "4985", inicio: 0, x: 36 }, // molinillo
    { desde: 81, hasta: 141, id: "100256", inicio: 3, x: 53 }, // la mesa
    { desde: 141, hasta: 186, id: "100343", inicio: 3, x: 50 }, // al filtro
    { desde: 186, hasta: 246, id: "100344", inicio: 2, x: 50 }, // bloom
    { desde: 246, hasta: 321, id: "100345", inicio: 4, x: 50 }, // vertido
    { desde: 321, hasta: 366, id: "43941", inicio: 3, x: 52 }, // servir
    { desde: 366, hasta: CHEMEX_FRAMES, id: "43935", inicio: 2, x: 52 },
  ],
  pasos: [
    [36, 81, "Moler grueso"],
    [81, 186, "Café al filtro"],
    [186, 246, "Mojar y esperar 30 s"],
    [246, 321, "Verter de a poco"],
    [321, 366, "Servir"],
  ],
};

// Del grano a la taza: tostado, granos, molienda, extracción y servido.
export const GRANO_FRAMES = 450;

export const granoATaza: Receta = {
  total: GRANO_FRAMES,
  titulo: "DEL GRANO",
  subtitulo: "a tu taza",
  pregunta: ["¿Cuántos tomás ", "por día?"],
  tomas: [
    { desde: 0, hasta: 36, id: "100263", inicio: 1, x: 50 }, // granos cayendo a la bolsa
    { desde: 36, hasta: 96, id: "4676", inicio: 2, x: 58 }, // tostado al fuego
    { desde: 96, hasta: 141, id: "100239", inicio: 1, x: 50 }, // recién tostados
    { desde: 141, hasta: 186, id: "100247", inicio: 2, x: 42 }, // la bolsa
    { desde: 186, hasta: 231, id: "3575", inicio: 2, x: 22 }, // molinillo
    { desde: 231, hasta: 261, id: "3572", inicio: 1, x: 24 }, // dosis
    { desde: 261, hasta: 321, id: "41865", inicio: 3, x: 50 }, // extracción
    { desde: 321, hasta: 366, id: "236", inicio: 3, x: 47 }, // a la taza
    { desde: 366, hasta: GRANO_FRAMES, id: "43935", inicio: 2, x: 52 },
  ],
  pasos: [
    [36, 141, "Tostar el grano"],
    [141, 186, "Granos recién tostados"],
    [186, 231, "Molerlos al momento"],
    [231, 321, "Extraer el espresso"],
    [321, 366, "A la taza"],
  ],
};

const sombra = "0 6px 0 rgba(0,0,0,0.5), 0 10px 40px rgba(0,0,0,0.7)";

const Gancho: React.FC<{ readonly r: Receta }> = ({ r }) => {
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
        {r.titulo}
      </div>
      <div
        style={{
          fontFamily: texto,
          fontWeight: 800,
          fontSize: 64,
          color: c.crema,
        }}
      >
        {r.subtitulo}
      </div>
    </div>
  );
};

// Etiqueta de cada paso, abajo: número y nombre.
const Paso: React.FC<{ readonly r: Receta }> = ({ r }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const i = r.pasos.findIndex(([a, b]) => f >= a && f < b);
  if (i < 0) return null;
  const [a, b, nombre] = r.pasos[i];
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

const Cierre: React.FC<{ readonly r: Receta }> = ({ r }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fin = r.pasos[r.pasos.length - 1][1];
  const s = Math.max(
    0,
    spring({ frame: f - fin - 6, fps, config: { damping: 12 } }),
  );
  const s2 = Math.max(
    0,
    spring({ frame: f - fin - 29, fps, config: { damping: 12 } }),
  );
  if (f < fin) return null;
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
        {r.pregunta[0]}
        <span style={{ color: c.caramelo }}>{r.pregunta[1]}</span>
      </div>
    </>
  );
};

// Barra fina de avance arriba: muestra que falta poco para el resultado.
const Avance: React.FC<{ readonly r: Receta }> = ({ r }) => {
  const f = useCurrentFrame();
  const ini = r.pasos[0][0];
  const fin = r.pasos[r.pasos.length - 1][1];
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
        opacity:
          iv(f, [ini - 6, ini + 4], [0, 1]) * iv(f, [fin - 6, fin + 4], [1, 0]),
      }}
    >
      <div
        style={{
          width: `${iv(f, [ini, fin], [0, 100], Easing.linear)}%`,
          height: "100%",
          background: c.caramelo,
        }}
      />
    </div>
  );
};

export const ProcesoCafe: React.FC<{ readonly r: Receta }> = ({ r }) => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    {r.tomas.map((t) => (
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
    <Gancho r={r} />
    <Avance r={r} />
    <Paso r={r} />
    <Cierre r={r} />
  </AbsoluteFill>
);

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
import {
  B,
  c,
  CAFE_FRAMES,
  iv,
  Progreso,
  Sello,
  Subtitulos,
  texto,
  titular,
  TituloError,
} from "./CafeTikTok";

// Versión con tomas reales de "3 errores que arruinan tu café": mismos
// textos, tiempos y sellos que la animada, sobre videos de stock gratuitos de
// Mixkit (licencia libre para uso comercial). Las tomas pesan mucho y no se
// suben al repositorio: tools/clips_cafe.sh las baja a public/cafe/clips/.

export type Toma = {
  readonly desde: number;
  readonly hasta: number;
  readonly id: string;
  readonly inicio: number; // segundo del clip donde arranca
  readonly x: number; // encuadre horizontal (0 a 100) al recortar a 9:16
};

const tomas: Toma[] = [
  { desde: 0, hasta: 60, id: "41865", inicio: 2, x: 50 }, // espresso cayendo
  { desde: 60, hasta: 140, id: "816", inicio: 4, x: 60 }, // pava sobre el filtro
  { desde: 140, hasta: 220, id: "236", inicio: 3, x: 47 }, // taza llenándose
  { desde: 220, hasta: 300, id: "4984", inicio: 2, x: 62 }, // café ya molido
  { desde: 300, hasta: 380, id: "4985", inicio: 1, x: 32 }, // granos al molinillo
  { desde: 380, hasta: 460, id: "100343", inicio: 2, x: 50 }, // molido a ojo
  { desde: 460, hasta: 540, id: "43941", inicio: 3, x: 52 }, // servido justo
  { desde: 540, hasta: CAFE_FRAMES, id: "41859", inicio: 3, x: 42 }, // latte art
];

export const Clip: React.FC<{ readonly t: Toma }> = ({ t }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const largo = t.hasta - t.desde;
  // Golpe de zoom en cada corte y un empuje lento después.
  const k =
    iv(f, [0, 8], [1.14, 1.03], Easing.out(Easing.cubic)) +
    iv(f, [8, largo], [0, 0.05], Easing.linear);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "black" }}>
      <OffthreadVideo
        src={staticFile(`cafe/clips/${t.id}.mp4`)}
        trimBefore={Math.round(t.inicio * fps)}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${t.x}% 50%`,
          transform: `scale(${k})`,
          filter: "contrast(1.06) saturate(1.08)",
        }}
      />
    </AbsoluteFill>
  );
};

const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.max(0, spring({ frame: f + 6, fps, config: { damping: 10 } }));
  if (f >= 64) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 250,
        left: 0,
        right: 0,
        textAlign: "center",
        transform: `scale(${0.7 + 0.3 * s})`,
        opacity: Math.min(1, s) * iv(f, [56, 64], [1, 0]),
        textShadow: "0 6px 0 rgba(0,0,0,0.5), 0 10px 40px rgba(0,0,0,0.7)",
      }}
    >
      <div
        style={{
          fontFamily: titular,
          fontSize: 190,
          lineHeight: 0.95,
          color: c.caramelo,
        }}
      >
        3 ERRORES
      </div>
      <div
        style={{
          fontFamily: texto,
          fontWeight: 800,
          fontSize: 62,
          color: c.crema,
          marginTop: 6,
        }}
      >
        que arruinan tu café
      </div>
    </div>
  );
};

const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = Math.max(
    0,
    spring({ frame: f - 546, fps, config: { damping: 12 } }),
  );
  if (f < 540) return null;
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
        fontSize: 52,
        color: c.crema,
        opacity: Math.min(1, s),
        transform: `translateY(${(1 - s) * 30}px)`,
        textShadow: "0 6px 0 rgba(0,0,0,0.5), 0 10px 40px rgba(0,0,0,0.7)",
      }}
    >
      Guardalo para tu
      <div
        style={{
          fontFamily: titular,
          fontSize: 140,
          lineHeight: 1,
          color: c.caramelo,
        }}
      >
        PRÓXIMO CAFÉ
      </div>
    </div>
  );
};

// La proporción, grande, en el error 3.
const Proporcion: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 505 || f >= 540) return null;
  const s = iv(f, [505, 513], [0.6, 1], Easing.out(Easing.back(2)));
  return (
    <div
      style={{
        position: "absolute",
        top: 600,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: titular,
        fontSize: 190,
        color: c.caramelo,
        transform: `scale(${s})`,
        opacity: iv(f, [505, 510], [0, 1]) * iv(f, [534, 540], [1, 0]),
        textShadow: "0 6px 0 rgba(0,0,0,0.5), 0 10px 40px rgba(0,0,0,0.7)",
      }}
    >
      1 : 16
    </div>
  );
};

export const CafeReal: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    {tomas.map((t) => (
      <Sequence key={t.id} from={t.desde} durationInFrames={t.hasta - t.desde}>
        <Clip t={t} />
      </Sequence>
    ))}
    {/* Sombras arriba y abajo para que el texto se lea sobre cualquier toma */}
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.85) 74%, rgba(0,0,0,0.6) 100%)",
      }}
    />
    <Gancho />
    <TituloError
      n={1}
      titulo="Agua hirviendo"
      desde={B.e1[0]}
      hasta={B.e1[1]}
    />
    <TituloError n={2} titulo="Café viejo" desde={B.e2[0]} hasta={B.e2[1]} />
    <TituloError n={3} titulo="Medir a ojo" desde={B.e3[0]} hasta={B.e3[1]} />
    <Proporcion />
    <Cierre />
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Sello bien={false} desde={108} hasta={140} x={830} y={1020} />
      <Sello bien desde={168} hasta={220} x={830} y={1020} />
      <Sello bien={false} desde={262} hasta={300} x={830} y={1020} />
      <Sello bien desde={330} hasta={380} x={830} y={1020} />
      <Sello bien={false} desde={420} hasta={460} x={830} y={1020} />
      <Sello bien desde={512} hasta={540} x={830} y={1020} />
    </svg>
    <Progreso />
    <Subtitulos />
  </AbsoluteFill>
);

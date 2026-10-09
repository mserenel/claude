import { AbsoluteFill, Sequence, Series } from "remotion";
import { Caption } from "./Caption";
import { Clip } from "./Clip";
import { EndCard } from "./EndCard";
import { Photo } from "./Photo";

// Material:
// - public/escena.jpg: foto real del mate en la mesa, con luz de ventana.
// - public/giro-escena.mp4: el giro real del mate (public/giro.mp4), recortado
//   cuadro a cuadro y apoyado sobre su base en la misma escena
//   (tools/compose_escena.py). Arranca en el segundo 3,5 del giro original.
//   Pasan por el frente: el 8 a los 1,5 s, el escudo a los 6,5 s y la
//   bandera a los 11,2 s.
// - public/logo-herencia-patria.png: logo original.

const HOOK = 75;
const GIRO = 360;
const CIERRE = 90;
export const AD_FRAMES = HOOK + GIRO + CIERRE;

type Texto = {
  readonly at: number;
  readonly frames: number;
  readonly text: string;
};

// Momentos del giro (en cuadros desde que empieza) donde aparece cada texto.
const textosGiro: Texto[] = [
  { at: 30, frames: 60, text: "Tu número." },
  { at: 105, frames: 75, text: "Terminación en cada detalle." },
  { at: 180, frames: 60, text: "Tu escudo." },
  { at: 315, frames: 45, text: "Tus colores." },
];

export type AdProps = {
  readonly hook: "A" | "B";
  readonly cta: string;
};

const hooks: Record<AdProps["hook"], string> = {
  A: "Un mate hecho a tu gusto.",
  B: "¿Cómo sería el tuyo?",
};

export const Ad: React.FC<AdProps> = ({ hook, cta }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Series>
        <Series.Sequence durationInFrames={HOOK}>
          {/* Arranca cerca del escudo con el sol encima y se abre. */}
          <Photo src="escena.jpg" zoom={[1.45, 1.12]} focus={[52, 38]} />
          <Caption text={hooks[hook]} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={GIRO}>
          <Clip src="giro-escena.mp4" zoom={[1, 1.06]} focus={[50, 55]} />
          {textosGiro.map((t) => (
            <Sequence key={t.text} from={t.at} durationInFrames={t.frames}>
              <Caption text={t.text} />
            </Sequence>
          ))}
        </Series.Sequence>
        <Series.Sequence durationInFrames={CIERRE}>
          <Photo src="escena.jpg" zoom={[1.05, 1]} focus={[50, 50]} />
          <EndCard cta={cta} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

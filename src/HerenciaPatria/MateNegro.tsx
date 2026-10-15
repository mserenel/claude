import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { BigTitle } from "./BigTitle";
import { Caption } from "./Caption";
import { EndCard } from "./EndCard";

// Mate negro con virola grabada, armado con dos fotos (frente y boca) con la
// luz corregida (tools/luz_producto.py), sin recortar ni componer nada: sólo
// movimientos de cámara sobre cada foto y fundidos cortos entre tomas. Sin
// sonido: se publica con un audio de la biblioteca de Instagram.

export const MATE_NEGRO_FRAMES = 450;
const FUNDIDO = 8;

// Las fotos son de 1024x1530: a 1080x1920 ya van ampliadas 1,25 veces. El
// acercamiento no pasa de 1,6 para que no se vean blandas.
const FOTO = { w: 1024, h: 1530 };
const BASE = 1920 / FOTO.h;

// Clave de cámara: cuadro de la toma, zoom y punto de la foto (en píxeles de
// la foto) que queda en el centro del cuadro.
type Clave = [frame: number, zoom: number, x: number, y: number];

const Toma: React.FC<{
  readonly src: string;
  readonly claves: Clave[];
  readonly fundido?: boolean;
}> = ({ src, claves, fundido = true }) => {
  const f = useCurrentFrame();
  const at = (i: 1 | 2 | 3) =>
    interpolate(
      f,
      claves.map((k) => k[0]),
      claves.map((k) => k[i]),
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.sin),
      },
    );
  const s = BASE * at(1);
  const w = FOTO.w * s;
  const h = FOTO.h * s;
  // El punto elegido va al centro, sin dejar ver bordes de la foto.
  const left = Math.min(0, Math.max(1080 - w, 540 - at(2) * s));
  const top = Math.min(0, Math.max(1920 - h, 960 - at(3) * s));
  const o = fundido
    ? interpolate(f, [0, FUNDIDO], [0, 1], {
        extrapolateRight: "clamp",
      })
    : 1;
  return (
    <AbsoluteFill style={{ opacity: o, overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{ position: "absolute", left, top, width: w, height: h }}
      />
    </AbsoluteFill>
  );
};

const benefits = [
  "Envío gratis",
  "3 cuotas sin interés",
  "20% de descuento en transferencia",
];

// [desde, hasta, texto]
const textos: [number, number, string][] = [
  [84, 174, "Cada borde tiene su dibujo."],
  [174, 264, "Un grabado que se luce en cada mate."],
  [264, 340, "Una pieza con identidad propia."],
];

export const MateNegro: React.FC<{ readonly cta: string }> = ({ cta }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#EEEEEE" }}>
      {/* Gancho: el mate entero, acercándose despacio. */}
      <Sequence durationInFrames={84 + FUNDIDO}>
        <Toma
          src="mate-negro-frente.png"
          fundido={false}
          claves={[
            [0, 1, 512, 830],
            [92, 1.15, 512, 790],
          ]}
        />
        <BigTitle lines={["Detalles", "que se miran", "de cerca."]} />
      </Sequence>
      {/* La boca, desde arriba. */}
      <Sequence from={84} durationInFrames={90 + FUNDIDO}>
        <Toma
          src="mate-negro-boca.png"
          claves={[
            [0, 1.25, 360, 900],
            [98, 1.5, 310, 880],
          ]}
        />
      </Sequence>
      {/* La virola, recorrida de izquierda a derecha. */}
      <Sequence from={174} durationInFrames={90 + FUNDIDO}>
        <Toma
          src="mate-negro-frente.png"
          claves={[
            [0, 1.6, 400, 730],
            [98, 1.6, 620, 730],
          ]}
        />
      </Sequence>
      {/* El grabado del costado, desde la foto de la boca. (La base queda
          muy abajo en la foto de frente: la taparía la interfaz.) */}
      <Sequence from={264} durationInFrames={76 + FUNDIDO}>
        <Toma
          src="mate-negro-boca.png"
          claves={[
            [0, 1.5, 580, 990],
            [84, 1.6, 520, 950],
          ]}
        />
      </Sequence>
      {/* Cierre: el mate entero otra vez, con el logo y los beneficios. */}
      <Sequence from={340}>
        <Toma
          src="mate-negro-frente.png"
          claves={[
            [0, 1.05, 512, 900],
            [110, 1, 512, 900],
          ]}
        />
      </Sequence>
      {textos.map(([from, to, text], i) => (
        <Sequence key={text} from={from} durationInFrames={to - from}>
          <Caption text={text} position="top" last={i === textos.length - 1} />
        </Sequence>
      ))}
      <Sequence from={340}>
        <EndCard cta={cta} benefits={benefits} />
      </Sequence>
    </AbsoluteFill>
  );
};

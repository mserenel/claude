import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors, fonts } from "./brand";
import {
  Arabescos,
  copa,
  Costura,
  elipse,
  Linea,
  Sombra,
  TrazoFiltro,
} from "./Trazo";
import {
  Cierre,
  Encabezado,
  Fondo,
  iv,
  p,
  type Paso,
  Subtitulo,
} from "./Cebar";

// "Tipos de mate": tercer video explicativo animado (9:16, 25 s), mismo
// estilo que los anteriores. Primero las formas (torpedo, imperial,
// camionero), dibujadas a partir de las fotos de referencia de la marca, con
// su base de patas de cuero; después los materiales, de a pares. La calabaza
// y el algarrobo arrancan mostrando de dónde salen.

export const TIPOS_FRAMES = 750;

const pasos: Paso[] = [
  { desde: 0, hasta: 60, frase: p("No todos los mates son *iguales.") },
  {
    desde: 60,
    hasta: 150,
    frase: p("El *torpedo: ovalado, con la boca más *cerrada."),
  },
  {
    desde: 150,
    hasta: 240,
    frase: p("El *imperial: virola *ancha y cincelada."),
  },
  {
    desde: 240,
    hasta: 330,
    frase: p("El *camionero: el de boca más *ancha."),
  },
  {
    desde: 330,
    hasta: 460,
    frase: p("*Calabaza y *algarrobo: suman sabor, pero hay que *curarlos."),
  },
  {
    desde: 460,
    hasta: 560,
    frase: p("*Acero y *cerámica: no se curan y se lavan fácil."),
  },
  {
    desde: 560,
    hasta: 660,
    frase: p("*Vidrio para ver la yerba; *plástico para llevar."),
  },
  {
    desde: 660,
    hasta: TIPOS_FRAMES,
    frase: p("Guardalo para la *próxima *ronda."),
  },
];

// Aguadas debajo del trazo: cuero negro, suela y alpaca. Son opacas para
// que las patas, adelante, tapen el borde del cuerpo.
export const aguaNegro = "#0D121C";
const aguaSuela = "#8C5226";
export const aguaAlpaca = "#4E5A72";

// ---- Formas (cada dibujo en una caja de 260x440), dibujadas a mano ----

// Base de patas de cuero cosidas, común a los tres: dos aletas a los
// costados que abrazan el cuerpo, una al frente y la suela de apoyo.
export const Patas: React.FC<{ readonly t: number; readonly agua: string }> = ({
  t,
  agua,
}) => (
  <>
    <Linea
      d="M40,270 C34,330 26,390 14,426 L96,426 C80,392 72,340 74,300"
      t={t}
      fill={agua}
    />
    <Linea
      d="M220,270 C226,330 234,390 246,426 L164,426 C180,392 188,340 186,300"
      t={t}
      fill={agua}
    />
    <Linea d="M10,426 L250,426 L250,436 L10,436 Z" t={t} fill={agua} />
    <Linea
      d="M120,432 C118,400 118,360 121,330 C124,320 136,320 139,330 C142,360 142,400 140,432"
      t={t}
      fill={agua}
    />
    <Costura d="M66,306 C62,350 56,392 50,420" t={t} />
    <Costura d="M194,306 C198,350 204,392 210,420" t={t} />
  </>
);

export const torpedoCuerpo =
  "M40,138 C10,175 10,260 30,310 C50,360 90,395 130,395 C170,395 210,360 230,310 C250,260 250,175 220,138 Z";
export const torpedoVirola =
  "M60,92 L200,92 C216,104 222,124 214,142 L46,142 C38,124 44,104 60,92 Z";

// Ovalado, virola redondeada y boca más cerrada.
export const Torpedo: React.FC<{ readonly t: number }> = ({ t }) => (
  <>
    <Linea d={torpedoCuerpo} t={t} fill={aguaNegro} />
    <Sombra d="M34,190 C26,232 32,276 50,312" t={t} />
    <Patas t={t} agua={aguaNegro} />
    <Linea d={torpedoVirola} t={t} fill={aguaAlpaca} />
    <Linea d="M62,96 C100,88 160,88 198,96" t={t} w={3} />
    <Arabescos x={66} y={116} n={6} t={t} />
  </>
);

// Virola recta, ancha y cincelada.
const Imperial: React.FC<{ readonly t: number }> = ({ t }) => (
  <>
    <Linea
      d="M42,140 C20,190 18,260 34,310 C54,365 92,395 130,395 C168,395 206,365 226,310 C242,260 240,190 218,140 Z"
      t={t}
      fill={aguaNegro}
    />
    <Sombra d="M38,190 C30,232 36,276 54,312" t={t} />
    <Patas t={t} agua={aguaNegro} />
    <Linea d="M38,74 L222,74 L222,144 L38,144 Z" t={t} fill={aguaAlpaca} />
    <Linea d="M38,86 L222,86" t={t} w={3} />
    <Linea d="M38,132 L222,132" t={t} w={3} />
    <Arabescos x={56} y={106} n={6} t={t} />
  </>
);

// La boca más ancha, de suela.
const Camionero: React.FC<{ readonly t: number }> = ({ t }) => (
  <>
    <Linea
      d="M12,120 C2,190 10,270 40,320 C66,365 100,392 130,392 C160,392 194,365 220,320 C250,270 258,190 248,120"
      t={t}
      fill={aguaSuela}
    />
    <Sombra d="M30,170 C26,214 34,256 52,290" t={t} />
    <Patas t={t} agua={aguaSuela} />
    <Linea
      d="M8,108 L8,130 C60,146 200,146 252,130 L252,108"
      t={t}
      fill={aguaAlpaca}
    />
    <Linea d={elipse(130, 108, 122, 20)} t={t} fill={aguaAlpaca} />
    <Linea d={elipse(130, 109, 102, 13)} t={t} w={3} fill="rgba(0,0,0,0.35)" />
    <Arabescos x={52} y={104} n={6} t={t} />
  </>
);

const formas: [string, React.FC<{ readonly t: number }>, number][] = [
  ["TORPEDO", Torpedo, 60],
  ["IMPERIAL", Imperial, 150],
  ["CAMIONERO", Camionero, 240],
];

const Formas: React.FC = () => {
  const f = useCurrentFrame();
  const sale = iv(f, [318, 332], [1, 0]);
  if (sale <= 0) return null;
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, opacity: sale }}
    >
      <defs>
        <TrazoFiltro id="trazo-formas" />
      </defs>
      {formas.map(([nombre, Dibujo, desde], i) => {
        const t = iv(f, [i * 8, i * 8 + 30], [0, 1]);
        const activo = f >= desde && f < desde + 90;
        const foco = f < 60 ? 1 : activo ? 1 : 0.3;
        const k = 1 + (activo ? 0.1 : 0);
        const cx = 210 + i * 280;
        return (
          <g
            key={nombre}
            opacity={foco}
            transform={`translate(${cx} 1000) scale(${k}) translate(-130 -440)`}
          >
            <g filter="url(#trazo-formas)">
              <Dibujo t={t} />
            </g>
            <text
              x={130}
              y={500}
              textAnchor="middle"
              fontFamily={fonts.sans}
              fontWeight={700}
              fontSize={30}
              letterSpacing={5}
              fill={colors.crema}
              opacity={t}
            >
              {nombre}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ---- Materiales (de a pares), también a mano ----

const calabaza =
  "M80,40 C70,100 20,140 20,230 C20,330 80,380 130,380 C180,380 240,330 240,230 C240,140 190,100 180,40 Z";
const vaso =
  "M45,40 L215,40 L205,370 C204,385 195,390 180,390 L80,390 C65,390 56,385 55,370 Z";

type Material = {
  readonly nombre: string;
  readonly forma: string;
  readonly agua: string;
  readonly vetas?: boolean;
  readonly yerba?: boolean;
  readonly franja?: boolean;
};

const materiales: Material[] = [
  {
    nombre: "Calabaza",
    forma: calabaza,
    agua: "rgba(188,143,87,0.65)",
    vetas: true,
  },
  {
    nombre: "Algarrobo",
    forma: calabaza,
    agua: "rgba(122,69,40,0.75)",
    vetas: true,
  },
  { nombre: "Acero", forma: vaso, agua: "rgba(195,200,207,0.35)" },
  {
    nombre: "Cerámica",
    forma: calabaza,
    agua: "rgba(243,235,221,0.3)",
    franja: true,
  },
  {
    nombre: "Vidrio",
    forma: vaso,
    agua: "rgba(191,224,240,0.12)",
    yerba: true,
  },
  { nombre: "Plástico", forma: vaso, agua: "rgba(78,138,116,0.6)" },
];

const Mate: React.FC<{ readonly m: Material; readonly t: number }> = ({
  m,
  t,
}) => (
  <>
    {m.yerba ? (
      <path
        d="M50,170 L210,170 L205,370 C204,385 195,390 180,390 L80,390 C65,390 56,385 55,370 Z"
        fill="rgba(140,154,86,0.75)"
        opacity={t}
      />
    ) : null}
    <Linea d={m.forma} t={t} fill={m.agua} />
    {m.forma === calabaza ? (
      <Linea d={elipse(130, 42, 50, 9)} t={t} w={3} fill="rgba(0,0,0,0.35)" />
    ) : (
      <Linea d={elipse(130, 40, 85, 10)} t={t} w={3} />
    )}
    {m.vetas
      ? [0, 1, 2].map((i) => (
          <Linea
            key={i}
            d={`M${85 + i * 45},70 C${70 + i * 45},170 ${100 + i * 45},270 ${85 + i * 45},360`}
            t={t}
            w={2.5}
            o={0.45}
          />
        ))
      : null}
    {m.franja ? (
      <>
        <Linea d="M22,205 C90,215 170,215 238,205" t={t} w={3} />
        <Linea d="M22,245 C90,255 170,255 238,245" t={t} w={3} />
      </>
    ) : null}
    {m.yerba ? <Linea d="M50,170 L210,170" t={t} w={3} o={0.7} /> : null}
    <Sombra
      d={m.forma === vaso ? "M66,90 L74,350" : "M42,170 C30,220 34,280 54,330"}
      t={t}
    />
  </>
);

// De dónde salen: la planta de calabaza (los porongos colgando) y el
// algarrobo. Misma caja de 260x440 que los mates.
const porongo =
  "M48,30 C46,80 52,110 38,140 C-5,175 -15,280 30,315 C50,330 70,330 90,315 C135,280 125,175 82,140 C68,110 74,80 72,30 Z";

const Planta: React.FC<{ readonly t: number }> = ({ t }) => (
  <>
    <Linea d="M0,40 C80,20 180,30 260,60" t={t} w={6} />
    {[
      [20, 70, -20],
      [200, 90, 25],
      [130, 30, 10],
    ].map(([x, y, a], i) => (
      <g key={i} transform={`rotate(${a} ${x} ${y})`}>
        <Linea
          d={`M${x - 28},${y} C${x - 10},${y - 16} ${x + 10},${y - 16} ${x + 28},${y} C${x + 10},${y + 16} ${x - 10},${y + 16} ${x - 28},${y} Z`}
          t={t}
          w={3}
          fill="rgba(122,106,62,0.6)"
        />
      </g>
    ))}
    {[
      [80, 1],
      [185, 0.8],
    ].map(([x, k], i) => (
      <g key={i} transform={`translate(${x} 34) scale(${k}) translate(-60 0)`}>
        <Linea d="M60,0 L60,30" t={t} w={4} />
        <Linea d={porongo} t={t} fill="rgba(216,203,154,0.6)" />
        <Sombra d="M12,190 C2,230 8,270 28,296" t={t} n={2} paso={12} />
      </g>
    ))}
  </>
);

const Arbol: React.FC<{ readonly t: number }> = ({ t }) => (
  <>
    <Linea
      d="M112,424 C120,380 104,340 116,300 C100,280 70,250 50,215 M124,276 C130,250 128,220 120,190 M140,282 C160,252 186,232 214,214 M156,424 C146,380 158,340 152,300"
      t={t}
      w={5}
    />
    <Linea
      d="M112,424 C120,380 104,340 116,300 L152,300 C158,340 146,380 156,424 Z"
      t={t}
      w={0.1}
      fill="rgba(92,58,34,0.8)"
    />
    <Linea d={copa(130, 150, 130, 80, 16)} t={t} fill="rgba(127,145,74,0.6)" />
    <Sombra d="M40,190 C70,215 150,222 220,195" t={t} n={2} paso={0} />
    <Linea d="M-10,424 L270,424" t={t} w={4} />
  </>
);

const pares = [
  { desde: 330, hasta: 460 },
  { desde: 460, hasta: 560 },
  { desde: 560, hasta: 660 },
];
const MATE_EN = 60; // en el primer par, cuándo pasa del origen al mate

const Materiales: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <TrazoFiltro id="trazo-materiales" />
      </defs>
      {pares.map(({ desde, hasta }, par) => {
        if (f < desde || f >= hasta) return null;
        const sale = iv(f, [hasta - 10, hasta], [1, 0]);
        const conOrigen = par === 0;
        const t0 = conOrigen ? desde + MATE_EN : desde;
        return [0, 1].map((lado) => {
          const m = materiales[par * 2 + lado];
          const cx = lado ? 720 : 340;
          const tOrigen = iv(f - desde - lado * 6, [0, 30], [0, 1]);
          const fueraOrigen = iv(f, [t0 - 12, t0], [1, 0]);
          const t = iv(f - t0 - lado * 6, [0, 28], [0, 1]);
          return (
            <g key={m.nombre} opacity={sale}>
              <g
                transform={`translate(${cx} 1000) scale(1.15) translate(-130 -420)`}
                filter="url(#trazo-materiales)"
              >
                {conOrigen && f < t0 ? (
                  <g opacity={fueraOrigen}>
                    {lado ? <Arbol t={tOrigen} /> : <Planta t={tOrigen} />}
                  </g>
                ) : null}
                {f >= t0 ? <Mate m={m} t={t} /> : null}
              </g>
              <text
                x={cx}
                y={1063}
                textAnchor="middle"
                fontFamily={fonts.sans}
                fontWeight={700}
                fontSize={34}
                letterSpacing={5}
                fill={colors.crema}
                opacity={conOrigen ? tOrigen : t}
              >
                {m.nombre.toUpperCase()}
              </text>
            </g>
          );
        });
      })}
    </svg>
  );
};

export const TiposDeMate: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Fondo />
      {f < 335 ? (
        <Encabezado titulo="Tipos de mate" hasta={332} />
      ) : (
        <Encabezado titulo="¿De qué material?" desde={335} hasta={662} />
      )}
      <Formas />
      <Materiales />
      <Cierre desde={670} />
      <Subtitulo pasos={pasos} total={TIPOS_FRAMES} />
    </AbsoluteFill>
  );
};

import {
  AbsoluteFill,
  Easing,
  Img,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "./brand";
import {
  agua,
  Cierre,
  Encabezado,
  Fondo,
  iv,
  p,
  type Paso,
  Subtitulo,
} from "./Cebar";
import {
  DefsRealista,
  Imperial,
  imperialCuerpo,
  GuardaPampa,
  SombraPiso,
  Superficie,
} from "./Realista";

// "Cómo curar tu mate": cuarto video explicativo animado (9:16, 44 s), mismo
// estilo que los anteriores. Primero el de calabaza (el imperial de "Tipos de
// mate", con fleje de guarda pampa, en corte) y después el de algarrobo, con
// los pasos que da la tienda (curado con grasa).

// Primero el de calabaza; desde ALG, el de algarrobo (pasos de la tienda).
const ALG = 560;
export const CURAR_FRAMES = ALG + 750;

const pasos: Paso[] = [
  {
    desde: 0,
    hasta: 60,
    frase: p("Un mate nuevo de *calabaza se cura antes de usarlo."),
  },
  {
    desde: 60,
    hasta: 160,
    num: 1,
    frase: p("Llenalo con yerba *usada y agua *tibia."),
  },
  { desde: 160, hasta: 260, num: 2, frase: p("Dejalo reposar *24 *horas.") },
  {
    desde: 260,
    hasta: 370,
    num: 3,
    frase: p("Vacialo y *raspá suave las paredes con una cuchara."),
  },
  { desde: 370, hasta: 460, num: 4, frase: p("Repetilo *2 *o *3 *días.") },
  {
    desde: 460,
    hasta: 560,
    num: 5,
    frase: p("Dejalo *secar bien en un ambiente *ventilado."),
  },
  ...(
    [
      [0, 70, 0, "El de *algarrobo se cura con *grasa."],
      [
        70,
        160,
        1,
        "Untá el interior con *manteca o aceite de *maíz o *girasol.",
      ],
      [160, 240, 2, "Dejalo absorber *6 *horas en un lugar seco."],
      [240, 320, 3, "Llenalo con yerba *nueva."],
      [320, 400, 4, "Humedecela con agua *tibia, nunca hirviendo."],
      [400, 480, 5, "Dejalo reposar *12 *horas."],
      [480, 580, 6, "Vacialo y quitá la grasa con *papel *de *cocina."],
      [580, 660, 7, "Repetí una vez más, pero *sin grasa."],
    ] as const
  ).map(([a, b, num, t]) => ({
    desde: ALG + a,
    hasta: ALG + b,
    num: num || undefined,
    frase: p(t),
  })),
  {
    desde: ALG + 660,
    hasta: CURAR_FRAMES,
    frase: p("Guardalo para cuando quieras *estrenar tu mate."),
  },
];

const yerba = "#8C9A56";
const yerbaOscura = "#5E7038";

// El imperial (caja de 260x440) agrandado al centro de la pantalla.
const K = 1.7;
const TX = 540 - 130 * K;
const TY = 314;
const boca = { x: 540, y: TY + 135 * K };

// Corte: el cuerpo es todo calabaza, forrado por un cuero muy fino. Se ve
// el cuero apenas como un filo, la pared de calabaza y el hueco adentro.
const enEscala = (k: number) =>
  `translate(130 267) scale(${k}) translate(-130 -267)`;
const PARED = enEscala(0.94);
const HUECO = enEscala(0.87);

// Reloj que gira rápido para mostrar las horas de reposo.
const Reloj: React.FC<{
  readonly horas: number;
  readonly avance: number;
  readonly o: number;
}> = ({ horas, avance, o }) => (
  <g transform="translate(850 640)" opacity={o}>
    <circle r={64} fill={colors.crema} />
    <circle r={64} fill="none" stroke={colors.madera} strokeWidth={6} />
    {new Array(12).fill(0).map((_, i) => (
      <rect
        key={i}
        x={-2}
        y={-56}
        width={4}
        height={10}
        fill={colors.azul}
        transform={`rotate(${i * 30})`}
      />
    ))}
    <rect
      x={-4}
      y={-38}
      width={8}
      height={42}
      rx={4}
      fill={colors.azul}
      transform={`rotate(${avance * (horas / 12) * 360})`}
    />
    <rect
      x={-3}
      y={-56}
      width={6}
      height={60}
      rx={3}
      fill={colors.madera}
      transform={`rotate(${avance * 360 * Math.min(horas, 8)})`}
    />
    <circle r={7} fill={colors.azul} />
    <text
      y={122}
      textAnchor="middle"
      fontFamily={fonts.serif}
      fontWeight={700}
      fontSize={44}
      fill={colors.crema}
      style={{ fontVariantNumeric: "lining-nums" }}
    >
      {horas} h
    </text>
  </g>
);

const Escena: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = Math.max(0, spring({ frame: f, fps, config: { damping: 14 } }));
  const sale = iv(f, [550, 568], [1, 0]);

  const nivel =
    iv(f, [65, 110], [380, 165], Easing.out(Easing.quad)) +
    iv(f, [268, 300], [0, 215]);
  const mojado = iv(f, [112, 150], [0, 1]);
  const cuchara = f >= 290 && f < 365 ? 1 : 0;
  const raspa = Math.sin((f - 290) / 5) * 45;
  const reloj = iv(f, [168, 250], [0, 1], Easing.inOut(Easing.quad));
  const enReloj = iv(f, [160, 172], [0, 1]) * iv(f, [250, 260], [1, 0]);

  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, opacity: sale }}
    >
      <DefsRealista />
      <defs>
        <clipPath id="curar-interior">
          <path d={imperialCuerpo} transform={HUECO} />
        </clipPath>
      </defs>

      {/* Yerba que cae (paso 1) */}
      {new Array(30).fill(0).map((_, i) => {
        const t0 = 64 + i * 1.5;
        const y = iv(
          f,
          [t0, t0 + 16],
          [boca.y - 130, boca.y + 30],
          Easing.in(Easing.quad),
        );
        return (
          <rect
            key={i}
            x={boca.x + (random(`cy${i}`) - 0.5) * 140}
            y={y}
            width={8}
            height={6}
            rx={2}
            fill={i % 3 ? yerba : yerbaOscura}
            opacity={f >= t0 && f < t0 + 16 ? 1 : 0}
          />
        );
      })}
      {/* Agua tibia (paso 1) */}
      {new Array(6).fill(0).map((_, i) => {
        const t0 = 114 + i * 6;
        const y = iv(
          f,
          [t0, t0 + 14],
          [boca.y - 120, boca.y + 30],
          Easing.in(Easing.quad),
        );
        return (
          <ellipse
            key={i}
            cx={boca.x + (i % 2 ? 18 : -18)}
            cy={y}
            rx={10}
            ry={15}
            fill={agua}
            opacity={f >= t0 && f < t0 + 14 ? 1 : 0}
          />
        );
      })}

      <g
        transform={`translate(${TX} ${TY}) scale(${K}) translate(130 434) scale(${entra}) translate(-130 -434)`}
      >
        <Imperial
          id="curar"
          hueco={
            <>
              {/* Corte: se ve la calabaza por dentro */}
              {/* Cuero negro, fino, por fuera */}
              <path d={imperialCuerpo} fill="#141110" />
              <path d={imperialCuerpo} transform={PARED} fill="#E3C68E" />
              <path
                d={imperialCuerpo}
                transform={PARED}
                fill="#fff"
                filter="url(#r-grano)"
                opacity={0.35}
              />
              <path d={imperialCuerpo} transform={HUECO} fill="url(#r-pulpa)" />
              <g clipPath="url(#curar-interior)">
                <path
                  d={`M0,${nivel} C80,${nivel - 8} 180,${nivel + 8} 260,${nivel} L260,440 L0,440 Z`}
                  fill={yerba}
                />
                <rect
                  x={0}
                  y={nivel}
                  width={260}
                  height={440}
                  fill={yerbaOscura}
                  opacity={0.75 * mojado}
                />
                <rect
                  x={0}
                  y={nivel}
                  width={260}
                  height={440}
                  fill="#fff"
                  filter="url(#r-grano)"
                  opacity={nivel < 375 ? 0.6 : 0}
                />
                {/* Sombra interna del borde cortado */}
                <path
                  d={imperialCuerpo}
                  transform={HUECO}
                  fill="none"
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth={14}
                  filter="url(#r-blur-s)"
                />
                {/* Lo que se desprende al raspar */}
                {new Array(10).fill(0).map((_, i) => {
                  const t0 = 296 + i * 6;
                  return (
                    <rect
                      key={i}
                      x={140 + random(`fx${i}`) * 40}
                      y={iv(f, [t0, t0 + 20], [200 + raspa * 0.5, 356])}
                      width={6}
                      height={4}
                      fill="#8E7446"
                      opacity={f >= t0 && f < t0 + 20 ? 1 : 0}
                    />
                  );
                })}
              </g>
              {/* Borde del corte: el espesor de la calabaza */}
              <path
                d={imperialCuerpo}
                transform={HUECO}
                fill="none"
                stroke="rgba(90,60,30,0.6)"
                strokeWidth={2}
              />
              {/* Cuchara raspando la pared */}
              <g
                transform={`translate(0 ${raspa}) rotate(-8 170 150)`}
                opacity={cuchara}
              >
                <path
                  d="M158,100 L170,100 L176,200 L164,200 Z"
                  fill="url(#r-alpaca)"
                />
                <path
                  d="M170,192 C198,192 200,276 170,276 C140,276 142,192 170,192 Z"
                  fill="url(#r-alpaca)"
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth={1.5}
                />
              </g>
            </>
          }
        />
      </g>

      {/* Reloj: 24 horas (paso 2) */}
      <Reloj horas={24} avance={reloj} o={enReloj} />

      {/* Días (paso 4) */}
      {[0, 1, 2].map((i) => {
        const t0 = 380 + i * 22;
        const s = spring({ frame: f - t0, fps, config: { damping: 12 } });
        const fuera = iv(f, [450, 460], [1, 0]);
        return (
          <g
            key={i}
            transform={`translate(850 ${560 + i * 120}) scale(${Math.max(0, s)})`}
            opacity={fuera}
          >
            <circle r={42} fill={colors.crema} />
            <text
              y={16}
              textAnchor="middle"
              fontFamily={fonts.serif}
              fontWeight={800}
              fontSize={46}
              fill={colors.azul}
              style={{ fontVariantNumeric: "lining-nums" }}
            >
              {i + 1}
            </text>
          </g>
        );
      })}
      {f >= 380 && f < 460 ? (
        <text
          x={850}
          y={530 - 30}
          textAnchor="middle"
          fontFamily={fonts.sans}
          fontWeight={700}
          fontSize={26}
          letterSpacing={5}
          fill={colors.crema}
          opacity={0.7 * iv(f, [380, 390], [0, 1]) * iv(f, [450, 460], [1, 0])}
        >
          DÍAS
        </text>
      ) : null}

      {/* Aire que seca (paso 5) */}
      {[0, 1, 2].map((i) => {
        const t = ((f - 470 - i * 10) % 40) / 40;
        return (
          <path
            key={i}
            d={`M0,0 C40,-18 80,18 120,0 C150,-12 170,-6 180,4`}
            stroke={colors.crema}
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
            transform={`translate(${200 + t * 560} ${560 + i * 110})`}
            opacity={
              f >= 470 && f < 550
                ? iv(t, [0, 0.2, 0.8, 1], [0, 0.6, 0.6, 0])
                : 0
            }
          />
        );
      })}
    </svg>
  );
};

// ---- Mate de algarrobo (cuadros locales, desde ALG) ----

// El de algarrobo de la tienda: madera torneada, panza arriba, cintura y pie
// abierto, con fleje ancho de guarda pampa y borde volcado. En corte: pared
// gruesa de madera y el hueco debajo del fleje.
const madera =
  "M20,184 C14,205 12,226 16,250 C22,296 40,320 46,338 C46,348 38,356 40,368 C42,378 46,381 60,382 L200,382 C214,381 218,378 220,368 C222,356 214,348 214,338 C220,320 238,296 244,250 C248,226 246,205 240,184 Z";
const huecoMadera =
  "M38,150 L222,150 L224,190 C232,222 228,258 212,288 C198,310 170,322 130,322 C90,322 62,310 48,288 C32,258 28,222 36,190 Z";
const K2 = 2;
const TX2 = 540 - 130 * K2;
const TY2 = 1060 - 384 * K2;
const boca2 = { x: 540, y: TY2 + 108 * K2 };

const EscenaAlgarrobo: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = Math.max(
    0,
    spring({ frame: f - 6, fps, config: { damping: 14 } }),
  );
  const sale = iv(f, [650, 668], [1, 0]);

  const grasa = iv(f, [80, 150], [0, 1]) - iv(f, [535, 575], [0, 0.6]);
  const pincel = f >= 75 && f < 155 ? 1 : 0;
  const unta = Math.sin((f - 75) / 4) * 40;
  const nivel =
    iv(f, [245, 300], [330, 192], Easing.out(Easing.quad)) +
    iv(f, [488, 525], [0, 140]);
  const mojado = iv(f, [330, 380], [0, 1]);
  const cuchara = f >= 485 && f < 530 ? 1 : 0;
  const saca = Math.sin((f - 485) / 5) * 35;
  const papel = f >= 532 && f < 578 ? 1 : 0;
  const pasa = Math.sin((f - 532) / 4) * 40;
  const reloj6 = iv(f, [168, 232], [0, 1], Easing.inOut(Easing.quad));
  const en6 = iv(f, [160, 172], [0, 1]) * iv(f, [232, 240], [1, 0]);
  const reloj12 = iv(f, [408, 472], [0, 1], Easing.inOut(Easing.quad));
  const en12 = iv(f, [400, 412], [0, 1]) * iv(f, [472, 480], [1, 0]);
  const otraVez = iv(f, [585, 650], [0, 1], Easing.inOut(Easing.cubic));
  const enOtra = iv(f, [580, 592], [0, 1]) * iv(f, [650, 660], [1, 0]);

  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, opacity: sale }}
    >
      <DefsRealista />
      <defs>
        <radialGradient id="alg-madera" cx="0.32" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#E3A468" />
          <stop offset="0.45" stopColor="#B36D35" />
          <stop offset="1" stopColor="#6A3714" />
        </radialGradient>
        <radialGradient id="alg-corte" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#E2AE78" />
          <stop offset="1" stopColor="#B07440" />
        </radialGradient>
        <radialGradient id="alg-hueco" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#7A4526" />
          <stop offset="1" stopColor="#3E200E" />
        </radialGradient>
        <clipPath id="alg-clip">
          <path d={huecoMadera} />
        </clipPath>
      </defs>

      {/* Yerba nueva que cae (paso 3) */}
      {new Array(30).fill(0).map((_, i) => {
        const t0 = 244 + i * 1.5;
        const y = iv(
          f,
          [t0, t0 + 16],
          [boca2.y - 130, boca2.y + 30],
          Easing.in(Easing.quad),
        );
        return (
          <rect
            key={i}
            x={boca2.x + (random(`ay${i}`) - 0.5) * 110}
            y={y}
            width={8}
            height={6}
            rx={2}
            fill={i % 3 ? yerba : yerbaOscura}
            opacity={f >= t0 && f < t0 + 16 ? 1 : 0}
          />
        );
      })}
      {/* Agua tibia (paso 4) */}
      {new Array(6).fill(0).map((_, i) => {
        const t0 = 330 + i * 7;
        const y = iv(
          f,
          [t0, t0 + 14],
          [boca2.y - 120, boca2.y + 30],
          Easing.in(Easing.quad),
        );
        return (
          <ellipse
            key={i}
            cx={boca2.x + (i % 2 ? 16 : -16)}
            cy={y}
            rx={10}
            ry={15}
            fill={agua}
            opacity={f >= t0 && f < t0 + 14 ? 1 : 0}
          />
        );
      })}

      <g
        transform={`translate(${TX2} ${TY2}) scale(${K2}) translate(130 384) scale(${entra}) translate(-130 -384)`}
      >
        <SombraPiso cx={130} cy={384} rx={100} />
        <Superficie
          id="alg-cuerpo"
          d={madera}
          relleno="url(#alg-madera)"
          brillo={[70, 200, 26, 80]}
        />
        {/* Corte de la madera, con sus vetas */}
        <path
          d={madera}
          transform="translate(130 280) scale(0.95) translate(-130 -280)"
          fill="url(#alg-corte)"
        />
        <g clipPath="url(#alg-cuerpo)">
          {/* Vetas: los anillos de la madera torneada */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <ellipse
              key={i}
              cx={95}
              cy={262}
              rx={18 + i * 22}
              ry={12 + i * 16}
              stroke="rgba(90,45,15,0.28)"
              strokeWidth={2.5}
              fill="none"
            />
          ))}
        </g>
        <path d={huecoMadera} fill="url(#alg-hueco)" />
        <g clipPath="url(#alg-clip)">
          {/* La grasa: el interior queda brilloso */}
          <path d={huecoMadera} fill="rgba(255,205,110,0.35)" opacity={grasa} />
          <ellipse
            cx={90}
            cy={200}
            rx={14}
            ry={90}
            fill="#fff"
            opacity={0.45 * grasa}
            filter="url(#r-blur-s)"
          />
          <path
            d={`M0,${nivel} C80,${nivel - 8} 180,${nivel + 8} 260,${nivel} L260,440 L0,440 Z`}
            fill={yerba}
          />
          <rect
            x={0}
            y={nivel}
            width={260}
            height={440}
            fill={yerbaOscura}
            opacity={0.75 * mojado}
          />
          <rect
            x={0}
            y={nivel}
            width={260}
            height={440}
            fill="#fff"
            filter="url(#r-grano)"
            opacity={nivel < 355 ? 0.6 : 0}
          />
          <path
            d={huecoMadera}
            fill="none"
            stroke="rgba(0,0,0,0.4)"
            strokeWidth={16}
            filter="url(#r-blur-s)"
          />
        </g>
        {/* Fleje de guarda pampa y borde volcado */}
        <Superficie
          id="alg-fleje"
          d="M16,114 L244,114 L240,186 L20,186 Z"
          relleno="url(#r-alpaca)"
          grano={false}
        />
        <GuardaPampa x={18} y={118} w={224} h={66} />
        <ellipse cx={130} cy={110} rx={126} ry={11} fill="url(#r-alpaca-v)" />
        <ellipse cx={130} cy={110} rx={112} ry={7} fill="url(#r-hueco)" />

        {/* Pincel con grasa (paso 1) */}
        <g
          transform={`translate(${unta * 0.3} ${110 + unta}) rotate(-10 130 120)`}
          opacity={pincel}
        >
          <rect x={124} y={20} width={12} height={70} rx={5} fill="#8A5A34" />
          <rect x={121} y={88} width={18} height={22} fill="url(#r-alpaca)" />
          <path
            d="M121,110 L139,110 C142,130 136,146 130,150 C124,146 118,130 121,110 Z"
            fill="#E8D6A8"
          />
        </g>
        {/* Cuchara que vacía (paso 6) */}
        <g
          transform={`translate(0 ${70 + saca}) rotate(-8 170 150)`}
          opacity={cuchara}
        >
          <path d="M158,40 L170,40 L176,180 L164,180 Z" fill="url(#r-alpaca)" />
          <path
            d="M170,172 C198,172 200,256 170,256 C140,256 142,172 170,172 Z"
            fill="url(#r-alpaca)"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth={1.5}
          />
        </g>
        {/* Papel de cocina (paso 6) */}
        <g
          transform={`translate(${pasa * 0.6} ${50 + pasa * 0.5}) rotate(12 130 200)`}
          opacity={papel}
        >
          <path
            d="M96,150 L160,146 L164,224 C150,230 140,220 128,228 C116,234 106,226 98,230 Z"
            fill="#F7F3EA"
            stroke="rgba(0,0,0,0.15)"
          />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${108 + i * 16},160 L${110 + i * 16},218`}
              stroke="rgba(0,0,0,0.08)"
              strokeWidth={3}
            />
          ))}
        </g>
      </g>

      <Reloj horas={6} avance={reloj6} o={en6} />
      <Reloj horas={12} avance={reloj12} o={en12} />

      {/* Otra vez (paso 7): flecha que da la vuelta */}
      <g
        transform={`translate(850 640) rotate(${otraVez * 360})`}
        opacity={enOtra}
      >
        <path
          d="M0,-56 A56,56 0 1,1 -48,-29"
          fill="none"
          stroke={colors.crema}
          strokeWidth={12}
          strokeLinecap="round"
        />
        <path d="M-64,-44 L-26,-46 L-50,-12 Z" fill={colors.crema} />
      </g>
    </svg>
  );
};

export const Curar: React.FC = () => (
  <AbsoluteFill>
    <Fondo />
    <Encabezado titulo="Cómo curar tu mate" hasta={568} />
    <Escena />
    <Sequence from={ALG}>
      <Encabezado titulo="¿Y el de algarrobo?" desde={12} hasta={668} />
      <EscenaAlgarrobo />
      <Cierre desde={675} />
    </Sequence>
    <Subtitulo pasos={pasos} total={CURAR_FRAMES} />
  </AbsoluteFill>
);

// ---- Portada del reel ----

// El de algarrobo entero (sin corte), para la portada.
const AlgarroboEntero: React.FC = () => (
  <>
    <defs>
      <radialGradient id="port-madera" cx="0.32" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#E3A468" />
        <stop offset="0.45" stopColor="#B36D35" />
        <stop offset="1" stopColor="#6A3714" />
      </radialGradient>
    </defs>
    <SombraPiso cx={130} cy={384} rx={110} />
    <Superficie
      id="port-alg"
      d={madera}
      relleno="url(#port-madera)"
      brillo={[70, 250, 22, 60]}
    />
    <g clipPath="url(#port-alg)">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <ellipse
          key={i}
          cx={30}
          cy={280}
          rx={40 + i * 30}
          ry={26 + i * 20}
          stroke="rgba(90,45,15,0.2)"
          strokeWidth={2.5}
          fill="none"
        />
      ))}
    </g>
    <Superficie
      id="port-fleje"
      d="M16,114 L244,114 L240,186 L20,186 Z"
      relleno="url(#r-alpaca)"
      grano={false}
    />
    <GuardaPampa x={18} y={118} w={224} h={66} />
    <ellipse cx={130} cy={110} rx={126} ry={11} fill="url(#r-alpaca-v)" />
    <ellipse cx={130} cy={110} rx={112} ry={7} fill="url(#r-hueco)" />
  </>
);

// Portada 9:16 con lo importante dentro del recorte 3:4 de la grilla del
// perfil (de 240 a 1680 de alto).
export const PortadaCurar: React.FC = () => (
  <AbsoluteFill>
    <Fondo />
    <div
      style={{
        position: "absolute",
        top: 330,
        left: 0,
        right: 0,
        textAlign: "center",
        color: colors.crema,
        fontFamily: fonts.serif,
        lineHeight: 1.02,
        textShadow: "0 4px 24px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 136 }}>Cómo curar</div>
      <div style={{ fontStyle: "italic", fontWeight: 600, fontSize: 136 }}>
        tu mate
      </div>
    </div>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <DefsRealista />
      {/* Los dos apoyados en la misma línea de piso (y = 1250). */}
      <g
        transform={`translate(${300 - 130 * 1.5} ${1250 - 414 * 1.5}) scale(1.5)`}
      >
        <Imperial id="port-imperial" />
      </g>
      <g
        transform={`translate(${780 - 130 * 1.5} ${1250 - 384 * 1.5}) scale(1.5)`}
      >
        <AlgarroboEntero />
      </g>
      {[
        [300, "CALABAZA"],
        [780, "ALGARROBO"],
      ].map(([x, t]) => (
        <text
          key={t}
          x={x}
          y={1330}
          textAnchor="middle"
          fontFamily={fonts.sans}
          fontWeight={700}
          fontSize={36}
          letterSpacing={6}
          fill={colors.crema}
        >
          {t}
        </text>
      ))}
    </svg>
    <Img
      src={staticFile("logo-herencia-patria.png")}
      style={{
        position: "absolute",
        width: 150,
        height: 150,
        left: 465,
        top: 1420,
      }}
    />
  </AbsoluteFill>
);

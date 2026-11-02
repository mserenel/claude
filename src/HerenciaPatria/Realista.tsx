import React from "react";

// Mates dibujados con volumen: degradés de luz y sombra, grano de cuero,
// virola de alpaca con brillo metálico y cincelado en relieve, costuras y
// sombra en el piso. Los degradés usan la caja de cada forma, así sirven para
// cualquier trayecto.

export const DefsRealista: React.FC = () => (
  <defs>
    <radialGradient id="r-negro" cx="0.32" cy="0.32" r="0.8">
      <stop offset="0" stopColor="#5C5550" />
      <stop offset="0.4" stopColor="#272220" />
      <stop offset="1" stopColor="#090807" />
    </radialGradient>
    <radialGradient id="r-suela" cx="0.32" cy="0.32" r="0.8">
      <stop offset="0" stopColor="#E9A468" />
      <stop offset="0.45" stopColor="#B4642B" />
      <stop offset="1" stopColor="#5A2C10" />
    </radialGradient>
    <linearGradient id="r-cil-negro" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor="#0B0A09" />
      <stop offset="0.38" stopColor="#4D4642" />
      <stop offset="1" stopColor="#141210" />
    </linearGradient>
    <linearGradient id="r-cil-suela" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor="#5A2C10" />
      <stop offset="0.38" stopColor="#D88E52" />
      <stop offset="1" stopColor="#6E3816" />
    </linearGradient>
    <linearGradient id="r-alpaca" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor="#66655F" />
      <stop offset="0.12" stopColor="#C9C7C1" />
      <stop offset="0.3" stopColor="#F7F6F1" />
      <stop offset="0.46" stopColor="#A6A49E" />
      <stop offset="0.62" stopColor="#E6E4DE" />
      <stop offset="0.82" stopColor="#8A8883" />
      <stop offset="1" stopColor="#56554F" />
    </linearGradient>
    <linearGradient id="r-alpaca-v" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#FFFFFB" />
      <stop offset="0.5" stopColor="#BDBBB5" />
      <stop offset="1" stopColor="#6D6B66" />
    </linearGradient>
    <linearGradient id="r-hueco" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#0B0908" />
      <stop offset="1" stopColor="#3A2C20" />
    </linearGradient>
    <linearGradient id="r-sombra-boca" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#000" stopOpacity="0.6" />
      <stop offset="1" stopColor="#000" stopOpacity="0" />
    </linearGradient>
    <radialGradient id="r-pulpa" cx="0.5" cy="0.45" r="0.6">
      <stop offset="0" stopColor="#D9BE88" />
      <stop offset="0.7" stopColor="#B4935C" />
      <stop offset="1" stopColor="#7C6038" />
    </radialGradient>
    {/* Grano del cuero: ruido fino, gris, apenas visible. */}
    <filter id="r-grano" x="0" y="0" width="1" height="1">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.9"
        numOctaves="2"
        seed="7"
      />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.9 -0.3"
      />
      <feComposite in2="SourceGraphic" operator="in" />
    </filter>
    <filter id="r-blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="9" />
    </filter>
    <filter id="r-blur-s" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" />
    </filter>
  </defs>
);

export type Cuero = "negro" | "suela";

// Superficie con volumen: degradé, grano, brillo difuso y sombra bajo la
// virola, todo recortado a la forma.
export const Superficie: React.FC<{
  readonly id: string;
  readonly d: string;
  readonly relleno: string;
  readonly grano?: boolean;
  readonly brillo?: [number, number, number, number];
  readonly sombraDesde?: number;
}> = ({ id, d, relleno, grano = true, brillo, sombraDesde }) => (
  <>
    <clipPath id={id}>
      <path d={d} />
    </clipPath>
    <path d={d} fill={relleno} />
    <g clipPath={`url(#${id})`}>
      {grano ? (
        <rect
          x={-20}
          y={-20}
          width={700}
          height={800}
          fill="#fff"
          filter="url(#r-grano)"
          opacity={0.35}
        />
      ) : null}
      {brillo ? (
        <ellipse
          cx={brillo[0]}
          cy={brillo[1]}
          rx={brillo[2]}
          ry={brillo[3]}
          fill="#fff"
          opacity={0.22}
          filter="url(#r-blur)"
        />
      ) : null}
      {sombraDesde !== undefined ? (
        <rect
          x={-20}
          y={sombraDesde}
          width={700}
          height={40}
          fill="url(#r-sombra-boca)"
        />
      ) : null}
    </g>
    <path d={d} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth={2} />
  </>
);

// Cincelado en relieve: arabescos oscuros con un filo de luz.
export const Cincelado: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly n: number;
  readonly paso?: number;
}> = ({ x, y, n, paso = 26 }) => (
  <>
    {new Array(n).fill(0).map((_, i) => {
      const d = `M${x + i * paso},${y + 4} c0,-12 14,-12 14,-3 c0,6 -8,6 -8,1 M${x + i * paso + 14},${y - 3} c4,6 8,8 12,6`;
      return (
        <g key={i}>
          <path
            d={d}
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth={2}
            transform="translate(0.8 1.2)"
          />
          <path
            d={d}
            fill="none"
            stroke="#4E4C47"
            strokeWidth={2.2}
            strokeLinecap="round"
          />
        </g>
      );
    })}
  </>
);

// Patas: tiras finas de cuero cosido que bajan por la calabaza hasta el
// piso (caja de 260x440).
export const Patas: React.FC<{ readonly id: string; readonly c: Cuero }> = ({
  id,
  c,
}) => {
  // Del mismo cuero que el mate: liso, sin costuras ni brillos.
  const relleno = `url(#r-${c})`;
  return (
    <>
      <Superficie
        id={`${id}-pi`}
        d="M56,288 C50,336 44,380 30,414 L64,414 C68,380 70,340 74,296 Z"
        relleno={relleno}
        grano={false}
      />
      <Superficie
        id={`${id}-pd`}
        d="M204,288 C210,336 216,380 230,414 L196,414 C192,380 190,340 186,296 Z"
        relleno={relleno}
        grano={false}
      />
      <Superficie
        id={`${id}-pf`}
        d="M121,414 C122,394 122,374 124,356 C126,348 134,348 136,356 C138,374 138,394 139,414 Z"
        relleno={relleno}
        grano={false}
      />
    </>
  );
};

// Guarda pampa cincelada en el fleje: rombos escalonados con una cruz al
// centro, triangulitos arriba y abajo y doble filete en los bordes.
const rombo = (cx: number, cy: number, s: number, n: number) => {
  const pts: string[] = [`M${cx},${cy - n * s}`];
  for (let i = 0; i < n; i++) pts.push(`h${s}`, `v${s}`);
  for (let i = 0; i < n; i++) pts.push(`v${s}`, `h${-s}`);
  for (let i = 0; i < n; i++) pts.push(`h${-s}`, `v${-s}`);
  for (let i = 0; i < n; i++) pts.push(`v${-s}`, `h${s}`);
  return pts.join(" ") + " Z";
};

export const GuardaPampa: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}> = ({ x, y, w, h }) => {
  const cy = y + h / 2;
  const unidad = 46;
  const n = Math.floor(w / unidad);
  const x0 = x + (w - n * unidad) / 2;
  const trazos: string[] = [
    `M${x},${y + 5} H${x + w}`,
    `M${x},${y + 9} H${x + w}`,
    `M${x},${y + h - 5} H${x + w}`,
    `M${x},${y + h - 9} H${x + w}`,
  ];
  for (let i = 0; i < n; i++) {
    const cx = x0 + unidad * i + unidad / 2;
    trazos.push(rombo(cx, cy, 4.5, 4), rombo(cx, cy, 4.5, 2));
    trazos.push(`M${cx - 4},${cy} h8 M${cx},${cy - 4} v8`);
  }
  // Triangulitos entre rombos, contra los filetes.
  for (let i = 0; i <= n; i++) {
    const bx = x0 + unidad * i;
    trazos.push(
      `M${bx - 7},${y + 9} L${bx},${y + 17} L${bx + 7},${y + 9}`,
      `M${bx - 7},${y + h - 9} L${bx},${y + h - 17} L${bx + 7},${y + h - 9}`,
    );
  }
  const d = trazos.join(" ");
  const id = `guarda-${x}-${y}`;
  return (
    <g clipPath={`url(#${id})`}>
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <path
        d={d}
        fill="none"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth={1.6}
        transform="translate(0.7 1)"
      />
      <path
        d={d}
        fill="none"
        stroke="#4E4C47"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </g>
  );
};

// Sombra en el piso, difusa.
export const SombraPiso: React.FC<{
  readonly cx: number;
  readonly cy: number;
  readonly rx: number;
}> = ({ cx, cy, rx }) => (
  <ellipse
    cx={cx}
    cy={cy}
    rx={rx}
    ry={rx * 0.11}
    fill="rgba(0,0,0,0.55)"
    filter="url(#r-blur-s)"
  />
);

// Las fotos muestran mates más bajos y panzones que el dibujo base: se
// achatan desde el piso.
export const ACHATE = 0.84;
const Achatado: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <g transform={`translate(0 414) scale(1 ${ACHATE}) translate(0 -414)`}>
    {children}
  </g>
);

export const torpedoCuerpo =
  "M40,138 C10,175 10,260 30,310 C50,360 90,395 130,395 C170,395 210,360 230,310 C250,260 250,175 220,138 Z";
export const torpedoVirola =
  "M60,92 L200,92 C216,104 222,124 214,142 L46,142 C38,124 44,104 60,92 Z";

// Ovalado, virola redondeada y boca más cerrada.
export const Torpedo: React.FC<{
  readonly id: string;
  readonly hueco?: React.ReactNode;
}> = ({ id, hueco }) => (
  <Achatado>
    <SombraPiso cx={130} cy={416} rx={130} />
    <Superficie
      id={`${id}-c`}
      d={torpedoCuerpo}
      relleno="url(#r-negro)"
      brillo={[80, 200, 30, 70]}
      sombraDesde={138}
    />
    {hueco}
    <Patas id={id} c="negro" />
    <Superficie
      id={`${id}-v`}
      d={torpedoVirola}
      relleno="url(#r-alpaca)"
      grano={false}
    />
    <path
      d="M60,92 L200,92 C206,96 208,100 206,104 L54,104 C52,100 54,96 60,92 Z"
      fill="url(#r-alpaca-v)"
    />
    <Cincelado x={70} y={124} n={5} />
  </Achatado>
);

// Virola (fleje) recta y ancha, cincelada con guarda pampa.
export const imperialCuerpo =
  "M42,140 C20,190 18,260 34,310 C54,365 92,395 130,395 C168,395 206,365 226,310 C242,260 240,190 218,140 Z";
export const Imperial: React.FC<{
  readonly id: string;
  readonly hueco?: React.ReactNode;
}> = ({ id, hueco }) => (
  <Achatado>
    <SombraPiso cx={130} cy={416} rx={130} />
    <Superficie
      id={`${id}-c`}
      d={imperialCuerpo}
      relleno="url(#r-negro)"
      brillo={[80, 210, 30, 70]}
      sombraDesde={140}
    />
    {hueco}
    <Patas id={id} c="negro" />
    <Superficie
      id={`${id}-v`}
      d="M38,74 L222,74 L222,144 L38,144 Z"
      relleno="url(#r-alpaca)"
      grano={false}
    />
    <rect x={38} y={74} width={184} height={6} fill="url(#r-alpaca-v)" />
    <GuardaPampa x={38} y={78} w={184} h={64} />
  </Achatado>
);

// La boca más ancha, de suela.
const camioneroCuerpo =
  "M12,120 C2,190 10,270 40,320 C66,365 100,392 130,392 C160,392 194,365 220,320 C250,270 258,190 248,120 Z";
export const Camionero: React.FC<{ readonly id: string }> = ({ id }) => (
  <Achatado>
    <SombraPiso cx={130} cy={416} rx={130} />
    <Superficie
      id={`${id}-c`}
      d={camioneroCuerpo}
      relleno="url(#r-suela)"
      brillo={[70, 200, 34, 70]}
      sombraDesde={128}
    />
    <Patas id={id} c="suela" />
    <Superficie
      id={`${id}-v`}
      d="M8,108 L8,130 C60,146 200,146 252,130 L252,108 Z"
      relleno="url(#r-alpaca)"
      grano={false}
    />
    <ellipse cx={130} cy={108} rx={122} ry={20} fill="url(#r-alpaca-v)" />
    <ellipse cx={130} cy={109} rx={102} ry={13} fill="url(#r-hueco)" />
    <Cincelado x={48} y={134} n={7} paso={24} />
  </Achatado>
);

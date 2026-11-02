import { useCurrentFrame } from "remotion";
import { colors } from "./brand";

// Dibujo a mano: trazo crema que se va dibujando, con un leve temblor (como
// una línea hecha a pulso) y aguadas de color suaves debajo.

export const TrazoFiltro: React.FC<{ readonly id: string }> = ({ id }) => {
  const f = useCurrentFrame();
  return (
    <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency={0.035}
        numOctaves={2}
        seed={Math.floor(f / 5) % 4}
      />
      <feDisplacementMap in="SourceGraphic" scale={5} />
    </filter>
  );
};

// Una línea que se dibuja de 0 a 1 (t). Con `fill`, lleva una aguada abajo.
export const Linea: React.FC<{
  readonly d: string;
  readonly t?: number;
  readonly w?: number;
  readonly fill?: string;
  readonly o?: number;
}> = ({ d, t = 1, w = 5, fill, o = 1 }) => (
  <>
    {fill ? <path d={d} fill={fill} opacity={t} /> : null}
    <path
      d={d}
      fill="none"
      stroke={colors.crema}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - t}
      opacity={o}
    />
  </>
);

// Costura: puntadas en línea punteada.
export const Costura: React.FC<{ readonly d: string; readonly t?: number }> = ({
  d,
  t = 1,
}) => (
  <path
    d={d}
    fill="none"
    stroke={colors.crema}
    strokeWidth={4}
    strokeLinecap="round"
    strokeDasharray="1 13"
    opacity={0.85 * t}
  />
);

// Sombreado a mano: líneas paralelas que siguen el borde del cuerpo.
export const Sombra: React.FC<{
  readonly d: string;
  readonly t?: number;
  readonly n?: number;
  readonly paso?: number;
}> = ({ d, t = 1, n = 3, paso = 13 }) => (
  <>
    {new Array(n).fill(0).map((_, i) => (
      <path
        key={i}
        d={d}
        transform={`translate(${i * paso} 0)`}
        fill="none"
        stroke={colors.crema}
        strokeWidth={2.5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - t}
        opacity={0.5 - i * 0.12}
      />
    ))}
  </>
);

// Arabescos del cincelado de la virola.
export const Arabescos: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly n: number;
  readonly t?: number;
}> = ({ x, y, n, t = 1 }) => (
  <>
    {new Array(n).fill(0).map((_, i) => (
      <path
        key={i}
        d={`M${x + i * 26},${y + 4} c0,-12 14,-12 14,-3 c0,6 -8,6 -8,1`}
        fill="none"
        stroke={colors.crema}
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.8 * t}
      />
    ))}
  </>
);

// Elipse como trayecto, para poder dibujarla de a poco.
export const elipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx},${cy} A${rx},${ry} 0 1,0 ${cx + rx},${cy} A${rx},${ry} 0 1,0 ${cx - rx},${cy} Z`;

// Copa de árbol con borde ondulado (festón) alrededor de una elipse.
export const copa = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  n: number,
) => {
  const pts = new Array(n).fill(0).map((_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });
  const r = (Math.PI * (rx + ry)) / n / 1.6;
  return (
    `M${pts[0][0]},${pts[0][1]} ` +
    pts
      .map((_, i) => {
        const [x, y] = pts[(i + 1) % n];
        return `A${r},${r} 0 0,1 ${x},${y}`;
      })
      .join(" ") +
    " Z"
  );
};

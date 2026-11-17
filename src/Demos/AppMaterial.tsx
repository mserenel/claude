import {
  cancelRender,
  continueRender,
  delayRender,
  Easing,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { iv } from "../Cafe/CafeTikTok";

// App de gestión de ejemplo para un comercio chico, con Material Design 3
// (Roboto, Material Symbols, barra de navegación, FAB, chips, snackbars,
// hojas inferiores y diálogos). Las funciones están inspiradas en una app
// real, pero el diseño, el nombre y los productos son genéricos y todos los
// datos son de prueba. Se dibuja en "dp" (pantalla de 412 dp de ancho) y se
// achica para entrar en el celular del video.

const DP = 2.24; // px por dp en el lienzo de 924 px
const d = (n: number) => n * DP;
const W = 924;
export const ESCALA = 568 / W;
const H = Math.round(1040 / ESCALA);

// Esquema de color Material 3 (verde azulado, claro).
const m = {
  primary: "#006C4C",
  onPrimary: "#FFFFFF",
  primaryContainer: "#89F8C7",
  onPrimaryContainer: "#002114",
  secondaryContainer: "#CEE9DB",
  onSecondaryContainer: "#082016",
  tertiaryContainer: "#C1E8FB",
  onTertiaryContainer: "#001F29",
  surface: "#FBFDF9",
  surfaceLow: "#F5F8F4",
  surfaceCont: "#EFF2EE",
  surfaceHigh: "#E9ECE8",
  onSurface: "#191C1A",
  onSurfaceVar: "#404943",
  outline: "#707973",
  outlineVar: "#BFC9C2",
  error: "#BA1A1A",
  errorContainer: "#FFDAD6",
  onErrorContainer: "#410002",
  inverseSurface: "#2E312F",
  inverseOnSurface: "#EFF1ED",
  inversePrimary: "#6CDBAC",
};

const roboto = '"Roboto", sans-serif';

const archivos: [string, string, string][] = [
  ["Roboto", "roboto-latin-400-normal.woff2", "400"],
  ["Roboto", "roboto-latin-500-normal.woff2", "500"],
  ["Roboto", "roboto-latin-700-normal.woff2", "700"],
  ["Material Symbols Rounded", "material-symbols-rounded.woff2", "100 700"],
];
const espera = delayRender("Fuentes de la app Material");
Promise.all(
  archivos.map(([family, file, weight]) => {
    const font = new FontFace(
      family,
      `url(${staticFile(`ventas/fonts/${file}`)})`,
      {
        weight,
      },
    );
    return font.load().then(() => {
      document.fonts.add(font);
    });
  }),
)
  .then(() => continueRender(espera))
  .catch((err) => cancelRender(err));

export const pesos = (n: number) =>
  "$" +
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// Ícono de Material Symbols (por ligadura).
const Ic: React.FC<{
  readonly n: string;
  readonly s?: number;
  readonly c?: string;
  readonly fill?: boolean;
}> = ({ n, s = 24, c = m.onSurfaceVar, fill }) => (
  <span
    style={{
      fontFamily: '"Material Symbols Rounded"',
      fontSize: d(s),
      lineHeight: 1,
      color: c,
      fontVariationSettings: `"FILL" ${fill ? 1 : 0}, "wght" 400, "GRAD" 0, "opsz" 24`,
      fontFeatureSettings: '"liga"',
      display: "inline-block",
      width: d(s),
      height: d(s),
      overflow: "hidden",
      whiteSpace: "nowrap",
    }}
  >
    {n}
  </span>
);

// ---- Estructura de pantalla ----

const Lienzo: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: W,
      height: H,
      background: m.surface,
      transform: `scale(${ESCALA})`,
      transformOrigin: "0 0",
      overflow: "hidden",
      fontFamily: roboto,
      color: m.onSurface,
    }}
  >
    {children}
  </div>
);

const BarraEstado: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: d(28),
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: `0 ${d(20)}px`,
      fontSize: d(14),
      fontWeight: 500,
      zIndex: 5,
    }}
  >
    <span>9:41</span>
    <span style={{ display: "flex", gap: d(2) }}>
      <Ic n="signal_cellular_alt" s={16} c={m.onSurface} />
      <Ic n="wifi" s={16} c={m.onSurface} />
      <Ic n="battery_full" s={16} c={m.onSurface} />
    </span>
  </div>
);

const TopBar: React.FC<{
  readonly titulo: string;
  readonly derecha?: string;
}> = ({ titulo, derecha = "more_vert" }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: d(28),
      height: d(64),
      display: "flex",
      alignItems: "center",
      gap: d(8),
      padding: `0 ${d(8)}px`,
      background: m.surface,
      zIndex: 4,
    }}
  >
    <div
      style={{
        width: d(48),
        height: d(48),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ic n="menu" c={m.onSurface} />
    </div>
    <div style={{ flex: 1, fontSize: d(22), fontWeight: 400 }}>{titulo}</div>
    <div
      style={{
        width: d(48),
        height: d(48),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ic n={derecha} c={m.onSurfaceVar} />
    </div>
  </div>
);

const destinos: [string, string][] = [
  ["point_of_sale", "Vender"],
  ["inventory_2", "Inventario"],
  ["shopping_cart", "Compras"],
  ["receipt_long", "Gastos"],
  ["monitoring", "Reportes"],
];

const BarraNav: React.FC<{ readonly activa: number }> = ({ activa }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: d(80),
      background: m.surfaceCont,
      display: "flex",
      zIndex: 4,
    }}
  >
    {destinos.map(([icono, n], i) => (
      <div
        key={n}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: d(12),
        }}
      >
        <div
          style={{
            width: d(64),
            height: d(32),
            borderRadius: d(16),
            background: i === activa ? m.secondaryContainer : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ic
            n={icono}
            c={i === activa ? m.onSecondaryContainer : m.onSurfaceVar}
            fill={i === activa}
          />
        </div>
        <div
          style={{
            marginTop: d(4),
            fontSize: d(12),
            fontWeight: i === activa ? 700 : 500,
            color: i === activa ? m.onSurface : m.onSurfaceVar,
          }}
        >
          {n}
        </div>
      </div>
    ))}
  </div>
);

// Onda de toque Material.
const Onda: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly t: number;
  readonly r?: number;
}> = ({ x, y, t, r = 90 }) => {
  const f = useCurrentFrame();
  const l = f - t;
  if (l < 0 || l > 16) return null;
  const rad = d(r) * iv(l, [0, 12], [0.15, 1], Easing.out(Easing.cubic));
  return (
    <div
      style={{
        position: "absolute",
        left: x - rad,
        top: y - rad,
        width: rad * 2,
        height: rad * 2,
        borderRadius: "50%",
        background: m.onSurface,
        opacity: iv(l, [0, 3, 16], [0.06, 0.14, 0]),
        zIndex: 9,
        pointerEvents: "none",
      }}
    />
  );
};

const Snackbar: React.FC<{
  readonly desde: number;
  readonly hasta: number;
  readonly texto: string;
  readonly icono?: string;
  readonly accion?: string;
  readonly arriba?: number;
}> = ({ desde, hasta, texto, icono, accion, arriba = 0 }) => {
  const f = useCurrentFrame();
  const o = iv(f, [desde, desde + 6, hasta - 6, hasta], [0, 1, 1, 0]);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: d(16),
        right: d(16),
        bottom: d(80 + 16) + arriba,
        minHeight: d(48),
        borderRadius: d(4),
        background: m.inverseSurface,
        color: m.inverseOnSurface,
        display: "flex",
        alignItems: "center",
        gap: d(12),
        padding: `${d(10)}px ${d(16)}px`,
        fontSize: d(14),
        boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
        opacity: o,
        transform: `translateY(${(1 - o) * d(20)}px)`,
        zIndex: 8,
      }}
    >
      {icono ? <Ic n={icono} s={20} c={m.inversePrimary} fill /> : null}
      <div style={{ flex: 1 }}>{texto}</div>
      {accion ? (
        <div style={{ fontWeight: 500, color: m.inversePrimary }}>{accion}</div>
      ) : null}
    </div>
  );
};

const Chip: React.FC<{ readonly t: string; readonly sel?: boolean }> = ({
  t,
  sel,
}) => (
  <div
    style={{
      height: d(32),
      padding: `0 ${d(16)}px 0 ${d(sel ? 8 : 16)}px`,
      borderRadius: d(8),
      border: sel ? "none" : `${d(1)}px solid ${m.outlineVar}`,
      background: sel ? m.secondaryContainer : "transparent",
      color: sel ? m.onSecondaryContainer : m.onSurfaceVar,
      display: "flex",
      alignItems: "center",
      gap: d(6),
      fontSize: d(14),
      fontWeight: 500,
      whiteSpace: "nowrap",
    }}
  >
    {sel ? <Ic n="check" s={18} c={m.onSecondaryContainer} /> : null}
    {t}
  </div>
);

const Avatar: React.FC<{
  readonly icono: string;
  readonly bg?: string;
  readonly c?: string;
}> = ({ icono, bg = m.primaryContainer, c = m.onPrimaryContainer }) => (
  <div
    style={{
      width: d(40),
      height: d(40),
      borderRadius: d(12),
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <Ic n={icono} s={22} c={c} />
  </div>
);

// ---- Productos de prueba ----
type P = {
  readonly n: string;
  readonly precio: number;
  readonly stock: number;
  readonly icono: string;
};
const productos: P[] = [
  { n: "Remera básica", precio: 12000, stock: 14, icono: "checkroom" },
  { n: "Buzo M", precio: 31500, stock: 0, icono: "dry_cleaning" },
  { n: "Medias x3", precio: 6900, stock: 22, icono: "footprint" },
  { n: "Campera", precio: 58000, stock: 3, icono: "styler" },
  { n: "Gorra", precio: 7500, stock: 9, icono: "face" },
];

const LISTA_Y = d(28 + 64 + 16 + 56 + 16 + 32 + 12);
const FILA = d(72);
const filaY = (i: number) => LISTA_Y + i * FILA;

// ---- 1. Vender (0–170) ----
const Vender: React.FC = () => {
  const f = useCurrentFrame();
  const remera = f >= 38 ? 2 : f >= 20 ? 1 : 0;
  const medias = f >= 105 ? 1 : 0;
  const total = remera * 12000 + medias * 6900;
  const hoja = iv(f, [122, 136], [0, 1], Easing.out(Easing.cubic));
  const pago = f >= 140 ? 1 : 0;
  const dialogo = iv(f, [154, 162], [0, 1], Easing.out(Easing.cubic));
  return (
    <Lienzo>
      <BarraEstado />
      <TopBar titulo="Nueva venta" derecha="person_add" />
      {/* Barra de búsqueda */}
      <div
        style={{
          position: "absolute",
          left: d(16),
          right: d(16),
          top: d(28 + 64 + 8),
          height: d(56),
          borderRadius: d(28),
          background: m.surfaceHigh,
          display: "flex",
          alignItems: "center",
          gap: d(16),
          padding: `0 ${d(16)}px`,
          fontSize: d(16),
          color: m.onSurfaceVar,
        }}
      >
        <Ic n="search" />
        Buscar productos
        <div style={{ flex: 1 }} />
        <Ic n="barcode_scanner" />
      </div>
      <div
        style={{
          position: "absolute",
          left: d(16),
          top: d(28 + 64 + 8 + 56 + 16),
          display: "flex",
          gap: d(8),
        }}
      >
        <Chip t="Todos" sel />
        <Chip t="Remeras" />
        <Chip t="Abrigo" />
        <Chip t="Accesorios" />
      </div>
      {productos.map((p, i) => {
        const n = i === 0 ? remera : i === 2 ? medias : 0;
        const agotado = p.stock === 0;
        return (
          <div
            key={p.n}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: filaY(i),
              height: FILA,
              display: "flex",
              alignItems: "center",
              gap: d(16),
              padding: `0 ${d(16)}px`,
              background: n > 0 ? m.surfaceLow : "transparent",
            }}
          >
            <Avatar
              icono={p.icono}
              bg={agotado ? m.errorContainer : m.primaryContainer}
              c={agotado ? m.onErrorContainer : m.onPrimaryContainer}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: d(16) }}>{p.n}</div>
              <div
                style={{
                  fontSize: d(14),
                  color: agotado ? m.error : m.onSurfaceVar,
                }}
              >
                {pesos(p.precio)} ·{" "}
                {agotado ? "Sin stock" : `${p.stock} en stock`}
              </div>
            </div>
            {n > 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: d(4) }}>
                <div
                  style={{
                    width: d(36),
                    height: d(36),
                    borderRadius: "50%",
                    border: `${d(1)}px solid ${m.outlineVar}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ic n="remove" s={20} />
                </div>
                <div
                  style={{
                    width: d(28),
                    textAlign: "center",
                    fontSize: d(16),
                    fontWeight: 500,
                  }}
                >
                  {n}
                </div>
                <div
                  style={{
                    width: d(36),
                    height: d(36),
                    borderRadius: "50%",
                    background: m.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ic n="add" s={20} c={m.onPrimary} />
                </div>
              </div>
            ) : (
              <Ic
                n={agotado ? "block" : "add_circle"}
                c={agotado ? m.error : m.primary}
              />
            )}
          </div>
        );
      })}
      {/* FAB extendido: cobrar */}
      <div
        style={{
          position: "absolute",
          right: d(16),
          bottom: d(80 + 16),
          height: d(56),
          borderRadius: d(16),
          background: m.primaryContainer,
          color: m.onPrimaryContainer,
          display: "flex",
          alignItems: "center",
          gap: d(12),
          padding: `0 ${d(20)}px 0 ${d(16)}px`,
          fontSize: d(14),
          fontWeight: 500,
          boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
          transform: `scale(${iv(f, [20, 28], [0.6, 1], Easing.out(Easing.cubic))})`,
          opacity: total > 0 ? 1 : 0,
          zIndex: 6,
        }}
      >
        <Ic n="shopping_cart_checkout" c={m.onPrimaryContainer} />
        Cobrar {pesos(total)}
      </div>
      <BarraNav activa={0} />
      <Snackbar
        desde={60}
        hasta={100}
        texto="No hay stock de Buzo M"
        icono="error"
        accion="Reponer"
        arriba={d(72)}
      />
      {/* Hoja inferior: cobrar */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.32)",
          opacity: hoja * (1 - dialogo * 0.3),
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: d(430),
          borderRadius: `${d(28)}px ${d(28)}px 0 0`,
          background: m.surfaceLow,
          transform: `translateY(${(1 - hoja) * d(440)}px)`,
          zIndex: 11,
          padding: `${d(22)}px ${d(24)}px`,
        }}
      >
        <div
          style={{
            width: d(32),
            height: d(4),
            borderRadius: d(2),
            background: m.outline,
            margin: "0 auto",
            opacity: 0.6,
          }}
        />
        <div style={{ marginTop: d(24), fontSize: d(24) }}>Cobrar</div>
        <div
          style={{ fontSize: d(14), color: m.onSurfaceVar, marginTop: d(4) }}
        >
          3 productos · Lucía G.
        </div>
        <div
          style={{
            marginTop: d(20),
            fontSize: d(14),
            fontWeight: 500,
            color: m.onSurfaceVar,
          }}
        >
          Forma de pago
        </div>
        <div
          style={{
            marginTop: d(8),
            display: "flex",
            height: d(40),
            borderRadius: d(20),
            border: `${d(1)}px solid ${m.outline}`,
            overflow: "hidden",
          }}
        >
          {["Efectivo", "Transferencia", "Tarjeta"].map((t, i) => (
            <div
              key={t}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: d(6),
                fontSize: d(14),
                fontWeight: 500,
                background:
                  pago === 1 && i === 1 ? m.secondaryContainer : "transparent",
                borderLeft: i > 0 ? `${d(1)}px solid ${m.outline}` : "none",
                color: m.onSurface,
              }}
            >
              {pago === 1 && i === 1 ? (
                <Ic n="check" s={18} c={m.onSecondaryContainer} />
              ) : null}
              {t}
            </div>
          ))}
        </div>
        {[
          ["Remera básica × 2", 24000],
          ["Medias x3 × 1", 6900],
        ].map(([t, v]) => (
          <div
            key={t as string}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: d(16),
              marginTop: d(16),
            }}
          >
            <span>{t as string}</span>
            <span>{pesos(v as number)}</span>
          </div>
        ))}
        <div
          style={{
            height: d(1),
            background: m.outlineVar,
            margin: `${d(16)}px 0`,
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: d(22),
            fontWeight: 500,
          }}
        >
          <span>Total</span>
          <span>{pesos(30900)}</span>
        </div>
        <div
          style={{
            marginTop: d(24),
            height: d(48),
            borderRadius: d(24),
            background: m.primary,
            color: m.onPrimary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: d(8),
            fontSize: d(14),
            fontWeight: 500,
          }}
        >
          <Ic n="check" s={18} c={m.onPrimary} />
          Confirmar venta
        </div>
      </div>
      {/* Diálogo: venta registrada */}
      <div
        style={{
          position: "absolute",
          left: d(40),
          right: d(40),
          top: d(190),
          borderRadius: d(28),
          background: m.surfaceHigh,
          padding: `${d(24)}px`,
          textAlign: "center",
          opacity: dialogo,
          transform: `scale(${0.9 + 0.1 * dialogo})`,
          zIndex: 13,
          boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
        }}
      >
        <Ic n="check_circle" s={36} c={m.primary} fill />
        <div style={{ marginTop: d(16), fontSize: d(24) }}>
          Venta registrada
        </div>
        <div
          style={{
            marginTop: d(12),
            fontSize: d(14),
            color: m.onSurfaceVar,
            lineHeight: 1.5,
          }}
        >
          Factura N° 0001-00000124
          <br />
          Transferencia · Lucía G.
        </div>
        <div style={{ marginTop: d(12), fontSize: d(32), fontWeight: 500 }}>
          {pesos(30900)}
        </div>
        <div
          style={{
            marginTop: d(16),
            display: "flex",
            justifyContent: "flex-end",
            gap: d(8),
            fontSize: d(14),
            fontWeight: 500,
            color: m.primary,
          }}
        >
          <span style={{ padding: `${d(10)}px ${d(12)}px` }}>Compartir</span>
          <span style={{ padding: `${d(10)}px ${d(12)}px` }}>Nueva venta</span>
        </div>
      </div>
      <Onda t={20} x={d(360)} y={filaY(0) + FILA / 2} />
      <Onda t={38} x={d(374)} y={filaY(0) + FILA / 2} r={30} />
      <Onda t={58} x={d(300)} y={filaY(1) + FILA / 2} />
      <Onda t={105} x={d(360)} y={filaY(2) + FILA / 2} />
      <Onda t={122} x={d(320)} y={H - d(80 + 16 + 28)} r={60} />
      <Onda
        t={140}
        x={d(206)}
        y={H - d(430) + d(22 + 4 + 24 + 30 + 4 + 20 + 20 + 8 + 20)}
        r={60}
      />
      <Onda t={152} x={d(206)} y={H - d(22 + 24)} r={70} />
    </Lienzo>
  );
};

// ---- 2. Inventario (0–55) ----
const Inventario: React.FC = () => {
  const f = useCurrentFrame();
  const baja = f >= 10;
  const filas: [string, string, number, number][] = [
    ["Remera básica", "checkroom", 14, 12],
    ["Medias x3", "footprint", 22, 21],
    ["Campera", "styler", 3, 3],
    ["Buzo M", "dry_cleaning", 0, 0],
    ["Gorra", "face", 9, 9],
  ];
  return (
    <Lienzo>
      <BarraEstado />
      <TopBar titulo="Inventario" derecha="filter_list" />
      <div
        style={{
          position: "absolute",
          left: d(16),
          right: d(16),
          top: d(28 + 64 + 8),
          display: "flex",
          gap: d(12),
        }}
      >
        {[
          ["Unidades", baja ? "45" : "48", m.surfaceCont, m.onSurface],
          ["Por agotarse", "2", m.tertiaryContainer, m.onTertiaryContainer],
          ["Agotados", "1", m.errorContainer, m.onErrorContainer],
        ].map(([t, v, bg, c]) => (
          <div
            key={t}
            style={{
              flex: 1,
              borderRadius: d(16),
              background: bg,
              color: c,
              padding: `${d(12)}px ${d(14)}px`,
            }}
          >
            <div style={{ fontSize: d(12), fontWeight: 500 }}>{t}</div>
            <div style={{ fontSize: d(28) }}>{v}</div>
          </div>
        ))}
      </div>
      {filas.map(([n, icono, a, b], i) => {
        const v = baja ? b : a;
        const cambia = a !== b;
        return (
          <div
            key={n}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: d(28 + 64 + 8 + 80 + 16) + i * FILA,
              height: FILA,
              display: "flex",
              alignItems: "center",
              gap: d(16),
              padding: `0 ${d(16)}px`,
              background:
                cambia && baja
                  ? `rgba(137,248,199,${iv(f, [10, 16, 50], [0, 0.45, 0.2])})`
                  : "transparent",
            }}
          >
            <Avatar
              icono={icono}
              bg={v === 0 ? m.errorContainer : m.primaryContainer}
              c={v === 0 ? m.onErrorContainer : m.onPrimaryContainer}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: d(16) }}>{n}</div>
              <div style={{ fontSize: d(14), color: m.onSurfaceVar }}>
                {cambia && baja
                  ? `Vendiste ${a - b} hoy`
                  : v === 0
                    ? "Agotado"
                    : v <= 3
                      ? "Quedan pocas"
                      : "Stock normal"}
              </div>
            </div>
            <div
              style={{
                minWidth: d(56),
                height: d(32),
                borderRadius: d(8),
                background:
                  v === 0
                    ? m.errorContainer
                    : v <= 3
                      ? m.tertiaryContainer
                      : m.secondaryContainer,
                color:
                  v === 0
                    ? m.onErrorContainer
                    : v <= 3
                      ? m.onTertiaryContainer
                      : m.onSecondaryContainer,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: d(14),
                fontWeight: 500,
                transform: cambia
                  ? `scale(${iv(f, [10, 15, 22], [1, 1.2, 1])})`
                  : undefined,
              }}
            >
              {v} u.
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          right: d(16),
          bottom: d(80 + 16),
          width: d(56),
          height: d(56),
          borderRadius: d(16),
          background: m.primaryContainer,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
        }}
      >
        <Ic n="add" c={m.onPrimaryContainer} />
      </div>
      <BarraNav activa={1} />
    </Lienzo>
  );
};

// ---- 3. Compras sugeridas (0–55) ----
const Compras: React.FC = () => {
  const f = useCurrentFrame();
  const total = 160000 * iv(f, [4, 26], [0, 1], Easing.out(Easing.cubic));
  return (
    <Lienzo>
      <BarraEstado />
      <TopBar titulo="Compras" derecha="history" />
      <div
        style={{
          position: "absolute",
          left: d(16),
          right: d(16),
          top: d(28 + 64 + 8),
        }}
      >
        <div
          style={{
            display: "flex",
            height: d(40),
            borderRadius: d(20),
            border: `${d(1)}px solid ${m.outline}`,
            overflow: "hidden",
          }}
        >
          {["30 días", "60 días", "90 días"].map((t, i) => (
            <div
              key={t}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: d(6),
                fontSize: d(14),
                fontWeight: 500,
                background: i === 0 ? m.secondaryContainer : "transparent",
                borderLeft: i > 0 ? `${d(1)}px solid ${m.outline}` : "none",
              }}
            >
              {i === 0 ? (
                <Ic n="check" s={18} c={m.onSecondaryContainer} />
              ) : null}
              {t}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: d(16),
            borderRadius: d(24),
            background: m.primaryContainer,
            color: m.onPrimaryContainer,
            padding: d(20),
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: d(8),
              fontSize: d(14),
              fontWeight: 500,
            }}
          >
            <Ic n="auto_awesome" s={20} c={m.onPrimaryContainer} fill />
            Compra sugerida
          </div>
          <div style={{ fontSize: d(36), marginTop: d(6) }}>{pesos(total)}</div>
          <div style={{ fontSize: d(14) }}>
            10 unidades · según tus ventas de los últimos 90 días
          </div>
        </div>
        {[
          [
            "Buzo M",
            "dry_cleaning",
            "Vendiste 6 · quedan 0",
            "Comprar 4",
            true,
          ],
          ["Campera", "styler", "Vendiste 5 · quedan 3", "Comprar 2", false],
          [
            "Remera básica",
            "checkroom",
            "Vendiste 20 · quedan 12",
            "Comprar 4",
            false,
          ],
        ].map(([n, icono, sub, c, urgente], i) => (
          <div
            key={n as string}
            style={{
              marginTop: d(12),
              borderRadius: d(16),
              background: m.surfaceLow,
              border: `${d(1)}px solid ${m.outlineVar}`,
              display: "flex",
              alignItems: "center",
              gap: d(14),
              padding: d(14),
              opacity: iv(f, [8 + i * 5, 14 + i * 5], [0, 1]),
              transform: `translateY(${iv(f, [8 + i * 5, 14 + i * 5], [d(12), 0], Easing.out(Easing.cubic))}px)`,
            }}
          >
            <Avatar
              icono={icono as string}
              bg={urgente ? m.errorContainer : m.primaryContainer}
              c={urgente ? m.onErrorContainer : m.onPrimaryContainer}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: d(16) }}>{n as string}</div>
              <div style={{ fontSize: d(14), color: m.onSurfaceVar }}>
                {sub as string}
              </div>
            </div>
            <div
              style={{
                height: d(32),
                padding: `0 ${d(12)}px`,
                borderRadius: d(8),
                background: urgente ? m.errorContainer : m.secondaryContainer,
                color: urgente ? m.onErrorContainer : m.onSecondaryContainer,
                display: "flex",
                alignItems: "center",
                fontSize: d(14),
                fontWeight: 500,
              }}
            >
              {c as string}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          right: d(16),
          bottom: d(80 + 16),
          height: d(56),
          borderRadius: d(16),
          background: m.primaryContainer,
          color: m.onPrimaryContainer,
          display: "flex",
          alignItems: "center",
          gap: d(12),
          padding: `0 ${d(20)}px 0 ${d(16)}px`,
          fontSize: d(14),
          fontWeight: 500,
          boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
        }}
      >
        <Ic n="send" c={m.onPrimaryContainer} />
        Armar pedido
      </div>
      <BarraNav activa={2} />
    </Lienzo>
  );
};

// ---- 4. Gastos (0–50) ----
const Gastos: React.FC = () => {
  const f = useCurrentFrame();
  const dialogo = iv(
    f,
    [6, 14, 30, 36],
    [0, 1, 1, 0],
    Easing.out(Easing.cubic),
  );
  const nuevo = f >= 34;
  const lista: [string, string, string, number][] = [
    ["Alquiler del local", "storefront", "Fijo · 17 nov", 60000],
    ["Internet", "wifi", "Fijo · 10 nov", 15000],
    ["Bolsas y etiquetas", "inventory", "Variable · 8 nov", 9500],
    ["Sistema de cobro", "credit_card", "Fijo · 1 nov", 10500],
  ];
  return (
    <Lienzo>
      <BarraEstado />
      <TopBar titulo="Gastos" derecha="calendar_month" />
      <div
        style={{
          position: "absolute",
          left: d(16),
          right: d(16),
          top: d(28 + 64 + 8),
          borderRadius: d(16),
          background: m.surfaceCont,
          padding: d(16),
        }}
      >
        <div
          style={{ fontSize: d(12), fontWeight: 500, color: m.onSurfaceVar }}
        >
          Gastos de noviembre
        </div>
        <div style={{ fontSize: d(28) }}>{pesos(nuevo ? 95000 : 35000)}</div>
      </div>
      {lista.map(([n, icono, sub, v], i) => {
        const es = i === 0;
        if (es && !nuevo) return null;
        const y = d(28 + 64 + 8 + 88 + 8) + (nuevo ? i : i - 1) * FILA;
        return (
          <div
            key={n}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: y,
              height: FILA,
              display: "flex",
              alignItems: "center",
              gap: d(16),
              padding: `0 ${d(16)}px`,
              background: es
                ? `rgba(137,248,199,${iv(f, [34, 40, 50], [0, 0.45, 0.25])})`
                : "transparent",
            }}
          >
            <Avatar
              icono={icono}
              bg={m.tertiaryContainer}
              c={m.onTertiaryContainer}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: d(16) }}>{n}</div>
              <div style={{ fontSize: d(14), color: m.onSurfaceVar }}>
                {sub}
              </div>
            </div>
            <div style={{ fontSize: d(16), fontWeight: 500 }}>-{pesos(v)}</div>
          </div>
        );
      })}
      <BarraNav activa={3} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.32)",
          opacity: dialogo,
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: d(24),
          right: d(24),
          top: d(170),
          borderRadius: d(28),
          background: m.surfaceHigh,
          padding: d(24),
          opacity: dialogo,
          transform: `scale(${0.92 + 0.08 * dialogo})`,
          zIndex: 11,
        }}
      >
        <div style={{ fontSize: d(24) }}>Nuevo gasto</div>
        {[
          ["Categoría", "Alquiler del local"],
          ["Monto", "$60.000"],
        ].map(([l, v]) => (
          <div key={l} style={{ marginTop: d(18), position: "relative" }}>
            <div
              style={{
                height: d(56),
                borderRadius: d(4),
                border: `${d(1.5)}px solid ${l === "Monto" ? m.primary : m.outline}`,
                display: "flex",
                alignItems: "center",
                padding: `0 ${d(16)}px`,
                fontSize: d(16),
              }}
            >
              {v}
            </div>
            <div
              style={{
                position: "absolute",
                left: d(12),
                top: -d(8),
                padding: `0 ${d(4)}px`,
                background: m.surfaceHigh,
                fontSize: d(12),
                color: l === "Monto" ? m.primary : m.onSurfaceVar,
              }}
            >
              {l}
            </div>
          </div>
        ))}
        <div
          style={{
            marginTop: d(24),
            display: "flex",
            justifyContent: "flex-end",
            gap: d(8),
            fontSize: d(14),
            fontWeight: 500,
          }}
        >
          <span style={{ padding: `${d(10)}px ${d(12)}px`, color: m.primary }}>
            Cancelar
          </span>
          <span
            style={{
              padding: `${d(10)}px ${d(24)}px`,
              borderRadius: d(20),
              background: m.primary,
              color: m.onPrimary,
            }}
          >
            Guardar
          </span>
        </div>
      </div>
      <Snackbar
        desde={36}
        hasta={60}
        texto="Gasto guardado"
        icono="check_circle"
      />
      <Onda
        t={28}
        x={d(330)}
        y={d(170 + 24 + 32 + 18 + 56 + 18 + 56 + 24 + 20)}
        r={50}
      />
    </Lienzo>
  );
};

// ---- 5. Reportes (0–60 en la app; sigue quieto después) ----
const VENDIDO = 412300;
const COSTO = 198500;
const FIJOS = 85000;
const GANANCIA = VENDIDO - COSTO - FIJOS;

export const Reportes: React.FC = () => {
  const f = useCurrentFrame();
  const c = iv(f, [4, 40], [0, 1], Easing.out(Easing.cubic));
  const semanas = [62, 88, 74, 112];
  return (
    <Lienzo>
      <BarraEstado />
      <TopBar titulo="Reportes" derecha="ios_share" />
      <div
        style={{
          position: "absolute",
          left: d(16),
          right: d(16),
          top: d(28 + 64 + 8),
        }}
      >
        <div style={{ display: "flex", gap: d(8) }}>
          <Chip t="Noviembre" sel />
          <Chip t="Octubre" />
          <Chip t="Septiembre" />
        </div>
        <div
          style={{
            marginTop: d(16),
            borderRadius: d(24),
            background: m.primary,
            color: m.onPrimary,
            padding: d(20),
          }}
        >
          <div style={{ fontSize: d(14), fontWeight: 500, opacity: 0.85 }}>
            Ganancia del mes
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: d(10) }}>
            <div style={{ fontSize: d(40) }}>{pesos(GANANCIA * c)}</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: d(14),
                fontWeight: 500,
                color: m.primaryContainer,
              }}
            >
              <Ic n="trending_up" s={18} c={m.primaryContainer} />
              12%
            </div>
          </div>
          {/* Barras por semana */}
          <div
            style={{
              marginTop: d(14),
              display: "flex",
              alignItems: "flex-end",
              gap: d(14),
              height: d(70),
            }}
          >
            {semanas.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: d(4),
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height:
                      d((h / 112) * 52) *
                      iv(
                        f,
                        [6 + i * 4, 26 + i * 4],
                        [0, 1],
                        Easing.out(Easing.cubic),
                      ),
                    borderRadius: d(6),
                    background:
                      i === 3 ? m.primaryContainer : "rgba(255,255,255,0.35)",
                  }}
                />
                <div style={{ fontSize: d(11), opacity: 0.85 }}>
                  Sem {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: d(12), display: "flex", gap: d(12) }}>
          {[
            ["Vendiste", VENDIDO, m.surfaceCont, m.onSurface],
            ["Costo", COSTO, m.surfaceCont, m.onSurface],
            ["Gastos", FIJOS, m.surfaceCont, m.onSurface],
          ].map(([t, v, bg, col]) => (
            <div
              key={t as string}
              style={{
                flex: 1,
                borderRadius: d(16),
                background: bg as string,
                color: col as string,
                padding: `${d(12)}px ${d(12)}px`,
              }}
            >
              <div
                style={{
                  fontSize: d(12),
                  fontWeight: 500,
                  color: m.onSurfaceVar,
                }}
              >
                {t as string}
              </div>
              <div style={{ fontSize: d(17), fontWeight: 500 }}>
                {pesos((v as number) * c)}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: d(12),
            borderRadius: d(16),
            border: `${d(1)}px solid ${m.outlineVar}`,
            padding: `${d(4)}px ${d(16)}px`,
          }}
        >
          {[
            ["Más vendido", "Remera básica"],
            ["Margen", "52%"],
            ["Ventas del mes", "38"],
          ].map(([a, b], i) => (
            <div
              key={a}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: `${d(12)}px 0`,
                borderTop: i > 0 ? `${d(1)}px solid ${m.outlineVar}` : "none",
                fontSize: d(15),
              }}
            >
              <span style={{ color: m.onSurfaceVar }}>{a}</span>
              <span style={{ fontWeight: 500 }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
      <BarraNav activa={4} />
    </Lienzo>
  );
};

// La app completa en orden: vender, inventario, compras, gastos y reportes.
export const APP_TRAMOS = {
  vender: 170,
  inventario: 55,
  compras: 55,
  gastos: 50,
} as const;

export const AppMaterial: React.FC = () => {
  const a = APP_TRAMOS.vender;
  const b = a + APP_TRAMOS.inventario;
  const c2 = b + APP_TRAMOS.compras;
  const e = c2 + APP_TRAMOS.gastos;
  return (
    <>
      <Sequence durationInFrames={a} layout="none">
        <Vender />
      </Sequence>
      <Sequence from={a} durationInFrames={b - a} layout="none">
        <Inventario />
      </Sequence>
      <Sequence from={b} durationInFrames={c2 - b} layout="none">
        <Compras />
      </Sequence>
      <Sequence from={c2} durationInFrames={e - c2} layout="none">
        <Gastos />
      </Sequence>
      <Sequence from={e} layout="none">
        <Reportes />
      </Sequence>
    </>
  );
};

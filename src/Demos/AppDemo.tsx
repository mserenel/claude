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

// Interfaz de ejemplo de una app de gestión para un comercio chico, tomando
// como referencia las funciones de una app real (cargar ventas con control de
// stock, ver stock, sugerir qué reponer, cargar gastos y cerrar el mes) pero
// con diseño, nombre y productos genéricos. Todos los datos son de prueba.
// Se dibuja a 924 px de ancho y se achica para entrar en el celular.

const W = 924;
export const ESCALA = 568 / W;
const H = Math.round(1040 / ESCALA);

const ui = {
  fondo: "#F3F5F9",
  blanco: "#FFFFFF",
  tinta: "#0F172A",
  gris: "#64748B",
  claro: "#94A3B8",
  borde: "#E2E8F0",
  campo: "#F8FAFC",
  verde: "#16A34A",
  verdeSuave: "#DCFCE7",
  rojo: "#DC2626",
  rojoSuave: "#FEE2E2",
  ambar: "#B45309",
  ambarSuave: "#FEF3C7",
  violeta: "#4F46E5",
};

const fuente = '"Inter", sans-serif';

const archivos: [string, string][] = [
  ["400", "inter-latin-400-normal.woff2"],
  ["500", "inter-latin-500-normal.woff2"],
  ["600", "inter-latin-600-normal.woff2"],
  ["700", "inter-latin-700-normal.woff2"],
  ["800", "inter-latin-800-normal.woff2"],
];
const espera = delayRender("Tipografía de la app");
Promise.all(
  archivos.map(([weight, file]) => {
    const font = new FontFace(
      "Inter",
      `url(${staticFile(`ventas/fonts/${file}`)})`,
      { weight },
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

// ---- Piezas ----

const Pantalla: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: W,
      height: H,
      background: ui.fondo,
      transform: `scale(${ESCALA})`,
      transformOrigin: "0 0",
      overflow: "hidden",
      fontFamily: fuente,
      color: ui.tinta,
    }}
  >
    {children}
  </div>
);

// Barra de estado y encabezado con el nombre del negocio (genérico).
const Encabezado: React.FC<{
  readonly titulo: string;
  readonly sub?: string;
}> = ({ titulo, sub }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: 290,
      background: ui.blanco,
      borderBottom: `2px solid ${ui.borde}`,
      zIndex: 3,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "34px 80px 0 82px",
        fontSize: 40,
        fontWeight: 700,
      }}
    >
      <span>9:41</span>
      <span
        style={{
          width: 66,
          height: 30,
          borderRadius: 9,
          background: ui.tinta,
          marginTop: 6,
        }}
      />
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "44px 44px 0",
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 28,
          background: "#E2E8F0",
          color: ui.tinta,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 38,
          fontWeight: 800,
        }}
      >
        MT
      </div>
      <div>
        <div style={{ fontSize: 50, fontWeight: 800, letterSpacing: -1 }}>
          {titulo}
        </div>
        <div style={{ fontSize: 30, fontWeight: 500, color: ui.gris }}>
          {sub ?? "Mi Tienda · Martes 17/11"}
        </div>
      </div>
    </div>
  </div>
);

const Icono: React.FC<{ readonly i: number; readonly color: string }> = ({
  i,
  color,
}) => {
  const p = {
    stroke: color,
    strokeWidth: 3.4,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg width={54} height={54} viewBox="0 0 48 48">
      {i === 0 ? (
        <>
          <path d="M6,10 H12 L17,32 H37 L42,16 H14" {...p} />
          <circle cx={19} cy={39} r={2.5} {...p} />
          <circle cx={35} cy={39} r={2.5} {...p} />
        </>
      ) : i === 1 ? (
        <>
          <path d="M24,5 L40,14 V33 L24,42 L8,33 V14 Z" {...p} />
          <path d="M8,14 L24,23 L40,14 M24,23 V42" {...p} />
        </>
      ) : i === 2 ? (
        <>
          <path d="M40,20 A16,16 0 1,0 38,34" {...p} />
          <path d="M40,8 V20 H28" {...p} />
        </>
      ) : i === 3 ? (
        <>
          <rect x={8} y={12} width={32} height={26} rx={4} {...p} />
          <path d="M8,20 H40 M15,30 H24" {...p} />
        </>
      ) : (
        <path
          d="M10,40 L10,24 M20,40 L20,14 M30,40 L30,28 M40,40 L40,8"
          {...p}
        />
      )}
    </svg>
  );
};

const Pestanas: React.FC<{ readonly activa: number }> = ({ activa }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 160,
      background: ui.blanco,
      borderTop: `2px solid ${ui.borde}`,
      display: "flex",
      zIndex: 3,
    }}
  >
    {["Vender", "Inventario", "Compras", "Gastos", "Reportes"].map((n, i) => {
      const c = i === activa ? ui.verde : ui.claro;
      return (
        <div
          key={n}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 24,
          }}
        >
          <div
            style={{
              padding: "6px 26px",
              borderRadius: 30,
              background: i === activa ? ui.verdeSuave : "transparent",
            }}
          >
            <Icono i={i} color={c} />
          </div>
          <div
            style={{
              fontSize: 27,
              fontWeight: i === activa ? 800 : 600,
              color: c,
              marginTop: 4,
            }}
          >
            {n}
          </div>
        </div>
      );
    })}
  </div>
);

const Rotulo: React.FC<{ readonly t: string }> = ({ t }) => (
  <div
    style={{
      fontSize: 30,
      fontWeight: 700,
      color: ui.gris,
      margin: "0 0 14px 4px",
    }}
  >
    {t}
  </div>
);

const Tarjeta: React.FC<{
  readonly children: React.ReactNode;
  readonly borde?: string;
  readonly fondo?: string;
  readonly estilo?: React.CSSProperties;
}> = ({ children, borde, fondo, estilo }) => (
  <div
    style={{
      background: fondo ?? ui.blanco,
      borderRadius: 30,
      border: `3px solid ${borde ?? ui.borde}`,
      padding: "28px 32px",
      ...estilo,
    }}
  >
    {children}
  </div>
);

const Toque: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly t: number;
}> = ({ x, y, t }) => {
  const f = useCurrentFrame();
  const l = f - t;
  if (l < -5 || l > 10) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 46,
        top: y - 46,
        width: 92,
        height: 92,
        borderRadius: "50%",
        background: "rgba(15,23,42,0.22)",
        boxShadow: "0 0 0 2px rgba(255,255,255,0.6)",
        transform: `scale(${iv(l, [-5, 0, 10], [1.15, 0.9, 1.05])})`,
        opacity: iv(l, [-5, -1, 5, 10], [0, 1, 1, 0]),
        zIndex: 10,
      }}
    />
  );
};

const Aviso: React.FC<{
  readonly o: number;
  readonly color: string;
  readonly fondo: string;
  readonly titulo: string;
  readonly texto: string;
}> = ({ o, color, fondo, titulo, texto }) => (
  <div
    style={{
      position: "absolute",
      left: 40,
      right: 40,
      top: 310,
      padding: "28px 34px",
      borderRadius: 28,
      background: fondo,
      border: `3px solid ${color}`,
      color,
      opacity: o,
      transform: `translateY(${(1 - o) * -40}px)`,
      zIndex: 6,
      boxShadow: "0 18px 40px rgba(15,23,42,0.15)",
    }}
  >
    <div style={{ fontSize: 36, fontWeight: 800 }}>{titulo}</div>
    <div style={{ fontSize: 30, fontWeight: 600, marginTop: 6 }}>{texto}</div>
  </div>
);

// ---- Productos de prueba ----
type Producto = {
  readonly n: string;
  readonly precio: number;
  readonly stock: number;
  readonly color: string;
};
const prod: Producto[] = [
  { n: "Remera básica", precio: 12000, stock: 14, color: "#60A5FA" },
  { n: "Buzo M", precio: 31500, stock: 0, color: "#A78BFA" },
  { n: "Medias x3", precio: 6900, stock: 22, color: "#F472B6" },
  { n: "Campera", precio: 58000, stock: 3, color: "#FBBF24" },
];

// ---- 1. Vender (cuadros locales 0–250) ----
const Vender: React.FC = () => {
  const f = useCurrentFrame();
  const cliente = "Lucía G.".slice(0, Math.max(0, Math.floor((f - 10) / 2.5)));
  const pago = f >= 38 ? 1 : -1;
  const scroll = -iv(f, [52, 68], [0, 560]);
  const alerta = iv(f, [82, 88, 124, 132], [0, 1, 1, 0]);
  const sacude = f >= 82 && f < 98 ? Math.sin((f - 82) * 1.6) * 14 : 0;
  const remera = f >= 155 ? 2 : f >= 137 ? 1 : 0;
  const medias = f >= 172 ? 1 : 0;
  const total = remera * 12000 + medias * 6900;
  const exito = iv(f, [204, 212], [0, 1]);
  const tocar = (y: number) => y + scroll;
  // Posiciones (en la pantalla sin desplazar) de cada producto de la grilla.
  const celda = (i: number) => ({
    x: 44 + (i % 2) * 428,
    y: 1040 + Math.floor(i / 2) * 250,
  });

  return (
    <Pantalla>
      <div style={{ position: "absolute", left: 0, right: 0, top: scroll }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 330 }}>
          <Rotulo t="Cliente" />
          <div
            style={{
              height: 110,
              borderRadius: 26,
              background: ui.blanco,
              border: `3px solid ${f >= 8 && f < 34 ? ui.verde : ui.borde}`,
              display: "flex",
              alignItems: "center",
              padding: "0 34px",
              fontSize: 38,
              color: cliente ? ui.tinta : ui.claro,
            }}
          >
            {cliente || "Nombre (opcional)"}
          </div>
          <div style={{ height: 36 }} />
          <Rotulo t="Forma de pago" />
          <div style={{ display: "flex", gap: 18 }}>
            {["Efectivo", "Transferencia", "Tarjeta"].map((m, i) => (
              <div
                key={m}
                style={{
                  padding: "24px 30px",
                  borderRadius: 60,
                  fontSize: 32,
                  fontWeight: 700,
                  background: pago === i ? ui.tinta : ui.blanco,
                  color: pago === i ? "#fff" : ui.gris,
                  border: `3px solid ${pago === i ? ui.tinta : ui.borde}`,
                }}
              >
                {m}
              </div>
            ))}
          </div>
          <div style={{ height: 36 }} />
          <Rotulo t="Fecha" />
          <div
            style={{
              height: 110,
              borderRadius: 26,
              background: ui.blanco,
              border: `3px solid ${ui.borde}`,
              display: "flex",
              alignItems: "center",
              padding: "0 34px",
              fontSize: 38,
            }}
          >
            Hoy, 17 nov
          </div>
        </div>
        {/* Productos */}
        <div style={{ position: "absolute", left: 40, right: 40, top: 900 }}>
          <Rotulo t="Agregá productos" />
          <div
            style={{
              height: 96,
              borderRadius: 26,
              background: ui.blanco,
              border: `3px solid ${ui.borde}`,
              display: "flex",
              alignItems: "center",
              padding: "0 34px",
              fontSize: 34,
              color: ui.claro,
            }}
          >
            Buscar producto o categoría…
          </div>
        </div>
        {prod.map((p, i) => {
          const { x, y } = celda(i);
          const n = i === 0 ? remera : i === 2 ? medias : 0;
          const sin = p.stock === 0;
          return (
            <div
              key={p.n}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 408,
                height: 226,
                borderRadius: 30,
                background: ui.blanco,
                border: `4px solid ${n > 0 ? ui.verde : sin && alerta > 0 ? ui.rojo : ui.borde}`,
                padding: "24px 26px",
                transform: `translateX(${i === 1 ? sacude : 0}px)`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 20,
                    background: "#F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width={44} height={44} viewBox="0 0 48 48">
                    <path
                      d="M16,6 L8,12 L4,22 L11,25 L13,20 V42 H35 V20 L37,25 L44,22 L40,12 L32,6 C30,10 18,10 16,6 Z"
                      fill="none"
                      stroke="#64748B"
                      strokeWidth={3}
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {n > 0 ? (
                  <div
                    style={{
                      minWidth: 70,
                      height: 70,
                      borderRadius: 35,
                      background: ui.verde,
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 34,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {n}
                  </div>
                ) : (
                  <div
                    style={{
                      height: 52,
                      padding: "0 18px",
                      borderRadius: 26,
                      fontSize: 26,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      background: sin ? ui.rojoSuave : ui.verdeSuave,
                      color: sin ? ui.rojo : ui.verde,
                    }}
                  >
                    {sin ? "Sin stock" : `${p.stock} u.`}
                  </div>
                )}
              </div>
              <div style={{ marginTop: 22, fontSize: 34, fontWeight: 800 }}>
                {p.n}
              </div>
              <div style={{ fontSize: 30, fontWeight: 600, color: ui.gris }}>
                {pesos(p.precio)}
              </div>
            </div>
          );
        })}
      </div>
      <Encabezado titulo="Nueva venta" />
      {/* Carrito fijo abajo */}
      <div
        style={{
          position: "absolute",
          left: 30,
          right: 30,
          bottom: 190,
          height: 150,
          borderRadius: 36,
          background: ui.tinta,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 22px 0 40px",
          zIndex: 4,
          filter: total > 0 ? "none" : "saturate(0.3) brightness(1.6)",
        }}
      >
        <div>
          <div style={{ fontSize: 28, fontWeight: 600, color: ui.claro }}>
            {remera + medias} {remera + medias === 1 ? "producto" : "productos"}
          </div>
          <div style={{ fontSize: 50, fontWeight: 800 }}>{pesos(total)}</div>
        </div>
        <div
          style={{
            padding: "30px 40px",
            borderRadius: 28,
            background: ui.verde,
            fontSize: 34,
            fontWeight: 800,
            transform: `scale(${f >= 198 && f < 206 ? 0.95 : 1})`,
          }}
        >
          Guardar venta
        </div>
      </div>
      <Pestanas activa={0} />
      <Aviso
        o={alerta}
        color={ui.rojo}
        fondo={ui.rojoSuave}
        titulo="No hay stock de Buzo M"
        texto="No se puede vender lo que no tenés."
      />
      {/* Venta guardada */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 980,
          borderRadius: "50px 50px 0 0",
          background: ui.blanco,
          boxShadow: "0 -20px 60px rgba(15,23,42,0.25)",
          transform: `translateY(${(1 - exito) * 1000}px)`,
          zIndex: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 70,
        }}
      >
        <div
          style={{
            width: 170,
            height: 170,
            borderRadius: "50%",
            background: ui.verde,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${iv(f, [210, 222], [0, 1], Easing.out(Easing.back(2)))})`,
          }}
        >
          <svg width={100} height={100} viewBox="0 0 100 100">
            <path
              d="M22,52 L42,72 L80,30"
              stroke="#fff"
              strokeWidth={13}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
        <div style={{ marginTop: 34, fontSize: 54, fontWeight: 800 }}>
          Venta guardada
        </div>
        <div style={{ marginTop: 8, fontSize: 32, color: ui.gris }}>
          Lucía G. · Transferencia
        </div>
        <div
          style={{
            marginTop: 30,
            fontSize: 30,
            fontWeight: 700,
            color: ui.gris,
          }}
        >
          Factura N°
        </div>
        <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: 1 }}>
          0001-00000124
        </div>
        <div style={{ marginTop: 26, fontSize: 80, fontWeight: 800 }}>
          {pesos(30900)}
        </div>
      </div>
      <Toque t={8} x={460} y={tocar(330 + 100)} />
      <Toque t={36} x={470} y={tocar(330 + 258)} />
      <Toque t={80} x={celda(1).x + 204} y={tocar(celda(1).y + 120)} />
      <Toque t={135} x={celda(0).x + 204} y={tocar(celda(0).y + 120)} />
      <Toque t={153} x={celda(0).x + 204} y={tocar(celda(0).y + 120)} />
      <Toque t={170} x={celda(2).x + 204} y={tocar(celda(2).y + 120)} />
      <Toque t={198} x={720} y={H - 190 - 75} />
    </Pantalla>
  );
};

// ---- 2. Stock (0–40): se actualizó solo ----
const Stock: React.FC = () => {
  const f = useCurrentFrame();
  const baja = f >= 12;
  const filas: [string, number, number][] = [
    ["Remera básica", 14, 12],
    ["Medias x3", 22, 21],
    ["Campera", 3, 3],
    ["Buzo M", 0, 0],
    ["Gorra", 9, 9],
  ];
  return (
    <Pantalla>
      <div style={{ position: "absolute", left: 40, right: 40, top: 330 }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 30 }}>
          {["Todas", "Remeras", "Abrigo", "Accesorios"].map((c, i) => (
            <div
              key={c}
              style={{
                padding: "18px 28px",
                borderRadius: 50,
                fontSize: 30,
                fontWeight: 700,
                background: i === 0 ? ui.tinta : ui.blanco,
                color: i === 0 ? "#fff" : ui.gris,
                border: `3px solid ${i === 0 ? ui.tinta : ui.borde}`,
              }}
            >
              {c}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 30, color: ui.gris, marginBottom: 20 }}>
          5 productos · {baja ? 45 : 48} unidades
        </div>
        {filas.map(([n, a, b]) => {
          const cambia = a !== b;
          const v = baja ? b : a;
          return (
            <Tarjeta
              key={n}
              borde={cambia && baja ? ui.verde : undefined}
              estilo={{
                marginBottom: 18,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 36, fontWeight: 800 }}>{n}</div>
                {cambia && baja ? (
                  <div
                    style={{ fontSize: 26, fontWeight: 700, color: ui.verde }}
                  >
                    Vendiste {a - b} recién
                  </div>
                ) : null}
              </div>
              <div
                style={{
                  padding: "14px 26px",
                  borderRadius: 40,
                  fontSize: 34,
                  fontWeight: 800,
                  background:
                    v === 0
                      ? ui.rojoSuave
                      : v <= 3
                        ? ui.ambarSuave
                        : ui.verdeSuave,
                  color: v === 0 ? ui.rojo : v <= 3 ? ui.ambar : ui.verde,
                  transform: cambia
                    ? `scale(${iv(f, [12, 18, 26], [1, 1.25, 1])})`
                    : undefined,
                }}
              >
                {v} u.
              </div>
            </Tarjeta>
          );
        })}
      </div>
      <Encabezado titulo="Stock" sub="Se actualiza con cada venta" />
      <Pestanas activa={1} />
    </Pantalla>
  );
};

// ---- 3. Reponer (0–35): qué comprar y cuánto sale ----
const Reponer: React.FC = () => {
  const f = useCurrentFrame();
  const total = 160000 * iv(f, [4, 24], [0, 1], Easing.out(Easing.cubic));
  return (
    <Pantalla>
      <div style={{ position: "absolute", left: 40, right: 40, top: 330 }}>
        <Rotulo t="Comprar para tener stock por" />
        <div style={{ display: "flex", gap: 16, marginBottom: 30 }}>
          {["30 días", "60 días", "90 días"].map((d, i) => (
            <div
              key={d}
              style={{
                padding: "20px 34px",
                borderRadius: 50,
                fontSize: 32,
                fontWeight: 700,
                background: i === 0 ? ui.tinta : ui.blanco,
                color: i === 0 ? "#fff" : ui.gris,
                border: `3px solid ${i === 0 ? ui.tinta : ui.borde}`,
              }}
            >
              {d}
            </div>
          ))}
        </div>
        <Tarjeta
          fondo={ui.tinta}
          borde={ui.tinta}
          estilo={{ color: "#fff", marginBottom: 26 }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 2,
              color: "#86EFAC",
            }}
          >
            COMPRA SUGERIDA
          </div>
          <div style={{ fontSize: 30, color: ui.claro, marginTop: 10 }}>
            10 unidades en 3 productos
          </div>
          <div style={{ fontSize: 86, fontWeight: 800, letterSpacing: -2 }}>
            {pesos(total)}
          </div>
          <div style={{ fontSize: 26, color: ui.claro }}>
            Según lo que vendiste en los últimos 90 días
          </div>
        </Tarjeta>
        {[
          [
            "Buzo M",
            "vendiste 6 · quedan 0",
            "Comprar 4",
            ui.rojo,
            ui.rojoSuave,
          ],
          [
            "Campera",
            "vendiste 5 · quedan 3",
            "Comprar 2",
            ui.ambar,
            ui.ambarSuave,
          ],
          [
            "Remera básica",
            "vendiste 20 · quedan 12",
            "Comprar 4",
            ui.ambar,
            ui.ambarSuave,
          ],
        ].map(([n, d, c, col, fondo], i) => (
          <Tarjeta
            key={n}
            estilo={{
              marginBottom: 18,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: iv(f, [6 + i * 5, 12 + i * 5], [0, 1]),
            }}
          >
            <div>
              <div style={{ fontSize: 36, fontWeight: 800 }}>{n}</div>
              <div style={{ fontSize: 28, color: ui.gris }}>{d}</div>
            </div>
            <div
              style={{
                padding: "14px 26px",
                borderRadius: 40,
                fontSize: 30,
                fontWeight: 800,
                background: fondo,
                color: col,
              }}
            >
              {c}
            </div>
          </Tarjeta>
        ))}
      </div>
      <Encabezado titulo="Reponer" sub="Qué comprar y cuánto sale" />
      <Pestanas activa={2} />
    </Pantalla>
  );
};

// ---- 4. Gastos (0–35): cargar un gasto fijo ----
const Gastos: React.FC = () => {
  const f = useCurrentFrame();
  const monto = "60.000".slice(0, Math.max(0, Math.floor((f - 4) / 2)));
  const ok = iv(f, [24, 30], [0, 1]);
  return (
    <Pantalla>
      <div style={{ position: "absolute", left: 40, right: 40, top: 330 }}>
        <Rotulo t="Tipo" />
        <div style={{ display: "flex", gap: 16, marginBottom: 34 }}>
          {["Fijo", "Variable"].map((t, i) => (
            <div
              key={t}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "26px 0",
                borderRadius: 26,
                fontSize: 34,
                fontWeight: 800,
                background: i === 0 ? ui.tinta : ui.blanco,
                color: i === 0 ? "#fff" : ui.gris,
                border: `3px solid ${i === 0 ? ui.tinta : ui.borde}`,
              }}
            >
              {t}
            </div>
          ))}
        </div>
        <Rotulo t="Categoría" />
        <Tarjeta estilo={{ fontSize: 38, fontWeight: 600, marginBottom: 34 }}>
          Alquiler del local
        </Tarjeta>
        <Rotulo t="Monto" />
        <Tarjeta
          borde={ui.verde}
          estilo={{ fontSize: 60, fontWeight: 800, marginBottom: 34 }}
        >
          ${monto || "0"}
        </Tarjeta>
        <div
          style={{
            padding: "34px 0",
            borderRadius: 32,
            background: ui.verde,
            color: "#fff",
            textAlign: "center",
            fontSize: 38,
            fontWeight: 800,
          }}
        >
          Guardar gasto
        </div>
      </div>
      <Encabezado titulo="Gastos" sub="Fijos y variables del mes" />
      <Pestanas activa={3} />
      <Aviso
        o={ok}
        color={ui.verde}
        fondo={ui.verdeSuave}
        titulo="Gasto guardado"
        texto="Alquiler del local · $60.000"
      />
      <Toque t={22} x={460} y={980} />
    </Pantalla>
  );
};

// La parte "así lo hago yo": vender (0–250) y un repaso de las otras
// pestañas (stock, reponer, gastos) mientras la voz dice "todo se registra
// solo".
export const AppSolucion: React.FC = () => {
  const f = useCurrentFrame();
  const tramo = (a: number, b: number, el: React.ReactNode) =>
    f >= a && f < b ? (
      <div style={{ position: "absolute", inset: 0 }}>
        <Desfase desde={a}>{el}</Desfase>
      </div>
    ) : null;
  return (
    <>
      {tramo(0, 250, <Vender />)}
      {tramo(250, 290, <Stock />)}
      {tramo(290, 325, <Reponer />)}
      {tramo(325, 400, <Gastos />)}
    </>
  );
};

// Cada pantalla cuenta sus cuadros desde 0.
const Desfase: React.FC<{
  readonly desde: number;
  readonly children: React.ReactNode;
}> = ({ desde, children }) => (
  <Sequence from={desde} layout="none">
    {children}
  </Sequence>
);

// ---- Cierre del mes (0–180) ----
const FACTURADO = 412300;
const CMV = 198500;
const MARGEN = FACTURADO - CMV;
const FIJOS = 85000;
const GANANCIA = MARGEN - FIJOS;

const Fila: React.FC<{
  readonly a: string;
  readonly b: string;
  readonly color?: string;
  readonly fuerte?: boolean;
  readonly sub?: string;
}> = ({ a, b, color, fuerte, sub }) => (
  <div style={{ padding: "24px 0", borderBottom: `2px solid ${ui.borde}` }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 36,
        fontWeight: fuerte ? 800 : 500,
      }}
    >
      <span>{a}</span>
      <span style={{ color: color ?? ui.tinta }}>{b}</span>
    </div>
    {sub ? (
      <div style={{ fontSize: 28, color: ui.gris, marginTop: 4 }}>{sub}</div>
    ) : null}
  </div>
);

export const AppMes: React.FC = () => {
  const f = useCurrentFrame();
  const cuenta = iv(f, [8, 60], [0, 1], Easing.out(Easing.cubic));
  const scroll = -iv(f, [64, 94], [0, 700]) - iv(f, [120, 148], [0, 420]);
  return (
    <Pantalla>
      <div
        style={{ position: "absolute", left: 40, right: 40, top: 330 + scroll }}
      >
        <div style={{ display: "flex", gap: 16, marginBottom: 30 }}>
          {["Noviembre", "Octubre", "Septiembre"].map((m, i) => (
            <div
              key={m}
              style={{
                padding: "18px 30px",
                borderRadius: 50,
                fontSize: 30,
                fontWeight: 700,
                background: i === 0 ? ui.tinta : ui.blanco,
                color: i === 0 ? "#fff" : ui.gris,
                border: `3px solid ${i === 0 ? ui.tinta : ui.borde}`,
              }}
            >
              {m}
            </div>
          ))}
        </div>
        <Tarjeta
          fondo={ui.tinta}
          borde={ui.tinta}
          estilo={{ color: "#fff", marginBottom: 26 }}
        >
          <div style={{ fontSize: 30, color: ui.claro }}>Ganaste este mes</div>
          <div
            style={{
              fontSize: 110,
              fontWeight: 800,
              letterSpacing: -3,
              color: "#4ADE80",
            }}
          >
            {pesos(GANANCIA * cuenta)}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 30,
              color: ui.claro,
              marginTop: 10,
            }}
          >
            <span>Vendiste</span>
            <span style={{ color: "#fff", fontWeight: 700 }}>
              {pesos(FACTURADO * cuenta)}
            </span>
          </div>
          <div
            style={{
              marginTop: 18,
              height: 16,
              borderRadius: 8,
              background: "#1E293B",
            }}
          >
            <div
              style={{
                width: `${cuenta * 100}%`,
                height: "100%",
                borderRadius: 8,
                background: "#4ADE80",
              }}
            />
          </div>
        </Tarjeta>
        <Tarjeta estilo={{ marginBottom: 26 }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: ui.gris }}>
            Cómo se calcula
          </div>
          <Fila
            a="Vendido"
            b={pesos(FACTURADO)}
            fuerte
            sub="Efectivo, transferencia y tarjeta"
          />
          <Fila a="Costo de lo vendido" b={`-${pesos(CMV)}`} color={ui.rojo} />
          <Fila a="Margen (52%)" b={pesos(MARGEN)} fuerte />
          <Fila
            a="Gastos fijos"
            b={`-${pesos(FIJOS)}`}
            color={ui.rojo}
            sub="Alquiler, internet, sistema"
          />
          <Fila a="Ganancia" b={pesos(GANANCIA)} color={ui.verde} fuerte />
        </Tarjeta>
        <Tarjeta>
          <div style={{ fontSize: 30, fontWeight: 800, color: ui.gris }}>
            Movimientos
          </div>
          {[
            [
              "Lucía G. · Fact. 124",
              "+$30.900",
              "Remera x2, Medias x3 · Transferencia",
              true,
            ],
            ["Alquiler del local", "-$60.000", "Gasto fijo", false],
            ["Martín R. · Fact. 123", "+$58.000", "Campera · Efectivo", false],
            ["Sofía P. · Fact. 122", "+$24.000", "Remera x2 · Tarjeta", false],
          ].map(([a, b, sub, nueva]) => (
            <div
              key={a as string}
              style={{
                margin: "0 -16px",
                padding: "0 16px",
                borderRadius: 18,
                background: nueva
                  ? `rgba(22,163,74,${iv(f, [150, 158, 180], [0, 0.18, 0.1])})`
                  : "transparent",
              }}
            >
              <Fila
                a={a as string}
                b={b as string}
                sub={sub as string}
                color={(b as string).startsWith("-") ? ui.rojo : ui.verde}
              />
            </div>
          ))}
        </Tarjeta>
      </div>
      <Encabezado titulo="Tu mes" sub="Noviembre 2026" />
      <Pestanas activa={4} />
    </Pantalla>
  );
};

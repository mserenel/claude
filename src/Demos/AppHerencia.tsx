import {
  cancelRender,
  continueRender,
  delayRender,
  Easing,
  Img,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { iv } from "../Cafe/CafeTikTok";

// Réplica de la app de gestión de Herencia Patria (pantallas Ventas, Stock y
// Cierre), con el mismo diseño que las capturas reales pero con DATOS DE
// PRUEBA: clientes, montos y movimientos son inventados. Se dibuja al tamaño
// de las capturas (924 px de ancho) y se achica para entrar en el celular.

const W = 924;
export const ESCALA = 624 / W;
const H = Math.round(1144 / ESCALA);

const ui = {
  fondo: "#101C33",
  barra: "#173968",
  campo: "#232F46",
  borde: "#3A4760",
  rotulo: "#8EA2BE",
  texto: "#E6ECF5",
  apagado: "#7D8BA3",
  linea: "#2A3A55",
  boton: "#1B3D73",
  bordeBoton: "#2E5C9E",
  celeste: "#5FA8D3",
  crema: "#F3E7C3",
  verde: "#4ADE80",
  rojo: "#F87171",
  tarjeta: "#1B2840",
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

// ---- Piezas de la interfaz ----

const Titulo: React.FC<{ readonly t: string; readonly y: number }> = ({
  t,
  y,
}) => (
  <div style={{ position: "absolute", left: 40, right: 40, top: y }}>
    <div
      style={{
        fontSize: 28,
        fontWeight: 600,
        letterSpacing: 4,
        color: ui.rotulo,
      }}
    >
      {t}
    </div>
    <div style={{ marginTop: 22, height: 2, background: ui.linea }} />
  </div>
);

const Rotulo: React.FC<{
  readonly t: string;
  readonly y: number;
  readonly x?: number;
}> = ({ t, y, x = 40 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      fontSize: 30,
      fontWeight: 600,
      letterSpacing: 3,
      color: ui.rotulo,
    }}
  >
    {t}
  </div>
);

const Campo: React.FC<{
  readonly y: number;
  readonly valor?: string;
  readonly vacio: string;
  readonly x?: number;
  readonly w?: number;
  readonly centrado?: boolean;
  readonly alerta?: number;
  readonly foco?: number;
}> = ({
  y,
  valor,
  vacio,
  x = 40,
  w = W - 80,
  centrado,
  alerta = 0,
  foco = 0,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: 110,
      borderRadius: 22,
      background: ui.campo,
      border: `3px solid ${alerta > 0 ? ui.rojo : foco > 0 ? ui.celeste : ui.borde}`,
      display: "flex",
      alignItems: "center",
      justifyContent: centrado ? "center" : "flex-start",
      padding: "0 36px",
      fontSize: 38,
      color: valor ? ui.texto : ui.apagado,
      whiteSpace: "nowrap",
      overflow: "hidden",
    }}
  >
    {valor ?? vacio}
  </div>
);

const Boton: React.FC<{
  readonly y: number;
  readonly t: string;
  readonly tipo: "azul" | "celeste" | "crema";
  readonly presion?: number;
}> = ({ y, t, tipo, presion = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: 40,
      right: 40,
      top: y,
      height: tipo === "azul" ? 112 : 122,
      borderRadius: 60,
      background:
        tipo === "azul" ? ui.boton : tipo === "celeste" ? ui.celeste : ui.crema,
      border: tipo === "azul" ? `3px solid ${ui.bordeBoton}` : "none",
      color: tipo === "crema" ? "#173968" : "#FFFFFF",
      fontSize: tipo === "azul" ? 38 : 40,
      fontWeight: 700,
      letterSpacing: tipo === "azul" ? 1 : 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: tipo === "azul" ? "none" : "0 10px 30px rgba(95,168,211,0.25)",
      transform: `scale(${1 - presion * 0.04})`,
    }}
  >
    {t}
  </div>
);

// Íconos de la barra de abajo.
const Icono: React.FC<{ readonly i: number; readonly color: string }> = ({
  i,
  color,
}) => {
  const p = {
    stroke: color,
    strokeWidth: 3.2,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg width={56} height={56} viewBox="0 0 48 48">
      {i === 0 ? (
        <>
          <rect x={11} y={9} width={26} height={32} rx={4} {...p} />
          <rect x={18} y={5} width={12} height={8} rx={2} {...p} />
          <path d="M17,22 H31 M17,29 H27" {...p} />
        </>
      ) : i === 1 ? (
        <>
          <path d="M24,5 L40,14 V33 L24,42 L8,33 V14 Z" {...p} />
          <path d="M8,14 L24,23 L40,14 M24,23 V42" {...p} />
        </>
      ) : i === 2 ? (
        <>
          <path d="M5,8 H11 L16,32 H36 L41,15 H13" {...p} />
          <circle cx={18} cy={39} r={2.5} {...p} />
          <circle cx={34} cy={39} r={2.5} {...p} />
        </>
      ) : i === 3 ? (
        <path
          d="M24,4 V44 M33,13 C30,9 18,9 16,15 C14,22 33,23 32,31 C31,38 18,38 14,33"
          {...p}
        />
      ) : (
        <path d="M12,40 V26 M24,40 V12 M36,40 V22" {...p} strokeWidth={4} />
      )}
    </svg>
  );
};

const Pestanas: React.FC<{ readonly activa: number }> = ({ activa }) => {
  const nombres = ["Ventas", "Stock", "Reponer", "Gastos", "Cierre"];
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 152,
        background: "#16233A",
        borderTop: `2px solid ${ui.linea}`,
        display: "flex",
      }}
    >
      {nombres.map((n, i) => {
        const c = i === activa ? "#7FB8E6" : ui.apagado;
        return (
          <div
            key={n}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 22,
              position: "relative",
            }}
          >
            {i === activa ? (
              <div
                style={{
                  position: "absolute",
                  top: -2,
                  width: 90,
                  height: 8,
                  borderRadius: 4,
                  background: "#5FA8D3",
                }}
              />
            ) : null}
            <Icono i={i} color={c} />
            <div
              style={{
                fontSize: 28,
                fontWeight: i === activa ? 700 : 500,
                color: c,
                marginTop: 6,
              }}
            >
              {n}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Cabecera: React.FC = () => (
  <>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: 126,
        background: "#FFFFFF",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 80px 0 82px",
        fontSize: 40,
        fontWeight: 700,
        color: "#000",
      }}
    >
      <span>9:41</span>
      <span
        style={{ width: 66, height: 30, borderRadius: 9, background: "#000" }}
      />
    </div>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 126,
        height: 156,
        background: ui.barra,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
        zIndex: 2,
      }}
    >
      <Img
        src={staticFile("logo-herencia-patria.png")}
        style={{ width: 124, height: 124 }}
      />
    </div>
  </>
);

// Toque del dedo en la pantalla.
const Toque: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly t: number;
}> = ({ x, y, t }) => {
  const f = useCurrentFrame();
  const l = f - t;
  if (l < -6 || l > 16) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 60,
          top: y - 60,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.5)",
          border: "5px solid rgba(255,255,255,0.7)",
          transform: `scale(${iv(l, [-6, 0, 6], [1.3, 0.85, 1])})`,
          opacity: iv(l, [-6, -2, 8, 16], [0, 1, 1, 0]),
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 60,
          top: y - 60,
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: "6px solid rgba(127,184,230,0.9)",
          transform: `scale(${iv(l, [0, 14], [1, 2.4])})`,
          opacity: iv(l, [0, 14], [0.9, 0]),
          zIndex: 10,
        }}
      />
    </>
  );
};

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
      color: ui.texto,
    }}
  >
    {children}
  </div>
);

// ---- Cargar una venta (cuadros locales 0–360) ----

const MODELO_SIN = "Torpedo rojizo · Laureles";
const MODELO = "Imperial negro · Guarda pampa";
const PRECIO = 45000;

export const AppVentas: React.FC = () => {
  const f = useCurrentFrame();
  const cliente = "Lucía G.".slice(0, Math.max(0, Math.floor((f - 25) / 3)));
  const pago = f >= 68 ? "Transferencia" : undefined;
  const categoria = f >= 118 ? "Mate" : undefined;
  const modelo = f >= 198 ? MODELO : f >= 138 ? MODELO_SIN : undefined;
  const alerta = f >= 140 && f < 196 ? 1 : 0;
  const listo = f >= 198;
  const agregado = f >= 232;
  const guardado = iv(f, [272, 280, 312, 320], [0, 1, 1, 0]);
  const enStock = f >= 322;
  // Desplazamiento de la pantalla mientras se completa el formulario.
  const scroll = -iv(f, [92, 112], [0, 760]) - iv(f, [236, 254], [0, 300]);
  const tocar = (y: number) => y + scroll;
  const stockAntes = 3;
  const stockAhora = f >= 338 ? 2 : stockAntes;

  return (
    <Pantalla>
      {!enStock ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 282 + scroll,
            height: 2600,
          }}
        >
          <Titulo t="DATOS DE LA VENTA" y={60} />
          <Rotulo t="CLIENTE" y={150} />
          <Campo
            y={205}
            valor={cliente || undefined}
            vacio="Nombre del cliente (opcional)"
            foco={f >= 22 && f < 60 ? 1 : 0}
          />
          <Rotulo t="FORMA DE PAGO" y={355} />
          <Campo y={410} valor={pago} vacio="Elegir…" />
          <Rotulo t="FECHA DE LA VENTA" y={560} />
          <Campo y={615} valor="17 nov 2026" vacio="" centrado />
          <Titulo t="AGREGAR PRODUCTO" y={790} />
          <Rotulo t="CATEGORÍA" y={880} />
          <Campo y={935} valor={categoria} vacio="Elegir categoría…" />
          <Rotulo t="MODELO" y={1085} />
          <Campo
            y={1140}
            valor={modelo}
            vacio="Elegir modelo…"
            alerta={alerta}
          />
          {/* Aviso de sin stock / stock disponible */}
          <div
            style={{
              position: "absolute",
              left: 44,
              top: 1262,
              fontSize: 30,
              fontWeight: 700,
              color: alerta ? ui.rojo : ui.verde,
              opacity: alerta || listo ? 1 : 0,
            }}
          >
            {alerta
              ? "Sin stock: no se puede vender este modelo."
              : listo
                ? "Hay 3 u. en stock"
                : ""}
          </div>
          <Rotulo t="PRECIO UNITARIO" y={1335} />
          <Rotulo t="CANTIDAD" x={478} y={1335} />
          <Campo
            y={1390}
            x={40}
            w={406}
            valor={listo ? "45.000" : undefined}
            vacio="0"
          />
          <Campo
            y={1390}
            x={478}
            w={406}
            valor={listo ? "1" : undefined}
            vacio="0"
          />
          <Boton
            y={1550}
            t="+ Agregar producto a la venta"
            tipo="azul"
            presion={f >= 228 && f < 236 ? 1 : 0}
          />
          <Titulo t="PRODUCTOS EN ESTA VENTA" y={1730} />
          {agregado ? (
            <div
              style={{
                position: "absolute",
                left: 40,
                right: 40,
                top: 1820,
                height: 170,
                borderRadius: 26,
                background: ui.tarjeta,
                border: `3px solid ${ui.celeste}`,
                padding: "26px 34px",
                opacity: iv(f, [232, 240], [0, 1]),
              }}
            >
              <div style={{ fontSize: 34, fontWeight: 600 }}>
                MATE/IMPERIAL/SIMPLE/NEGRO/GUARDA PAMPA
              </div>
              <div style={{ marginTop: 14, fontSize: 32, color: ui.apagado }}>
                1 × {pesos(PRECIO)}{" "}
                <span
                  style={{ float: "right", color: ui.texto, fontWeight: 700 }}
                >
                  {pesos(PRECIO)}
                </span>
              </div>
            </div>
          ) : (
            <div
              style={{
                position: "absolute",
                left: 40,
                right: 40,
                top: 1820,
                height: 170,
                borderRadius: 26,
                border: `3px dashed ${ui.borde}`,
                background: "#1A2539",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                color: ui.apagado,
              }}
            >
              Todavía no agregaste ningún producto.
            </div>
          )}
          <div
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              top: 2030,
              height: 150,
              borderRadius: 30,
              background: ui.campo,
              border: `3px solid ${ui.borde}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 46px",
            }}
          >
            <span
              style={{
                fontSize: 30,
                fontWeight: 600,
                letterSpacing: 3,
                color: ui.rotulo,
              }}
            >
              TOTAL VENTA
            </span>
            <span style={{ fontSize: 64, fontWeight: 800, color: ui.crema }}>
              {pesos(agregado ? PRECIO : 0)}
            </span>
          </div>
        </div>
      ) : (
        // Stock: el modelo vendido bajó una unidad solo.
        <div style={{ position: "absolute", left: 0, right: 0, top: 282 }}>
          <Titulo t="RESULTADO" y={70} />
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 160,
              fontSize: 32,
              color: ui.apagado,
            }}
          >
            51 producto(s) — {96 + stockAhora - stockAntes + 1} unidad(es) en
            total
          </div>
          {[
            ["MATE/IMPERIAL/SIMPLE/MADERA/GUARDA PAMPA/ALGARROBO", 34],
            ["MATE/IMPERIAL/SIMPLE/NEGRO/GUARDA PAMPA", stockAhora],
            ["MATE/TORPEDO/CUERO/NEGRO/LAURELES/CINCELADA", 4],
            ["MATE/IMPERIAL/CUERO/NEGRO/ESPEJO/REPUJADO", 3],
            ["MATE/TORPEDO/CUERO/ROJIZO/LAURELES", 0],
          ].map(([t, n], i) => {
            const vendido = i === 1;
            return (
              <div
                key={t as string}
                style={{
                  position: "absolute",
                  left: 40,
                  right: 40,
                  top: 230 + i * 190,
                  height: 170,
                  borderRadius: 26,
                  background: ui.tarjeta,
                  border: `3px solid ${vendido && f >= 338 ? ui.celeste : "#2C3A54"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 36px",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    fontSize: 31,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    wordBreak: "break-all",
                  }}
                >
                  {t as string}
                </div>
                <div
                  style={{
                    minWidth: 120,
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    padding: "12px 24px",
                    borderRadius: 40,
                    border: `3px solid ${(n as number) === 0 ? "#7F2D2D" : "#2F7A50"}`,
                    background: (n as number) === 0 ? "#3A1C22" : "#173A2C",
                    color: (n as number) === 0 ? ui.rojo : ui.verde,
                    fontSize: 36,
                    fontWeight: 600,
                    textAlign: "center",
                    transform: vendido
                      ? `scale(${iv(f, [338, 344, 352], [1, 1.25, 1])})`
                      : undefined,
                  }}
                >
                  {n as number} u.
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Cabecera />
      {!enStock ? (
        <Boton
          y={H - 152 - 160}
          t="GUARDAR VENTA"
          tipo="celeste"
          presion={f >= 268 && f < 276 ? 1 : 0}
        />
      ) : null}
      <Pestanas activa={enStock ? 1 : 0} />
      {/* Venta guardada */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 560,
          padding: "50px 40px",
          borderRadius: 36,
          background: "#16233A",
          border: `4px solid ${ui.verde}`,
          textAlign: "center",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          opacity: guardado,
          transform: `scale(${0.9 + 0.1 * guardado})`,
          zIndex: 5,
        }}
      >
        <svg width={130} height={130} viewBox="0 0 100 100">
          <circle cx={50} cy={50} r={46} fill={ui.verde} />
          <path
            d="M28,52 L44,67 L73,36"
            stroke="#0B2A18"
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <div style={{ marginTop: 20, fontSize: 52, fontWeight: 800 }}>
          Venta guardada
        </div>
        <div style={{ marginTop: 12, fontSize: 36, color: ui.rotulo }}>
          Lucía G. · Fact. 43
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 60,
            fontWeight: 800,
            color: ui.crema,
          }}
        >
          {pesos(PRECIO)}
        </div>
      </div>
      {/* Toques */}
      <Toque t={22} x={460} y={tocar(282 + 260)} />
      <Toque t={66} x={460} y={tocar(282 + 465)} />
      <Toque t={116} x={460} y={tocar(282 + 990)} />
      <Toque t={136} x={460} y={tocar(282 + 1195)} />
      <Toque t={196} x={460} y={tocar(282 + 1195)} />
      <Toque t={228} x={460} y={tocar(282 + 1606)} />
      <Toque t={268} x={460} y={H - 152 - 100} />
      <Toque t={322} x={277} y={H - 76} />
    </Pantalla>
  );
};

// ---- Cierre del mes (cuadros locales 0–180) ----

const FACTURADO = 412300;
const CMV = 198500;
const MARGEN = FACTURADO - CMV;
const FIJOS = 85000;
const GANANCIA = MARGEN - FIJOS;

const Fila: React.FC<{
  readonly a: string;
  readonly b: string;
  readonly color?: string;
  readonly colorB?: string;
  readonly fuerte?: boolean;
  readonly sub?: string;
}> = ({ a, b, color = ui.texto, colorB, fuerte, sub }) => (
  <div style={{ padding: "28px 0", borderBottom: `2px solid ${ui.linea}` }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 38,
        fontWeight: fuerte ? 700 : 500,
        color,
      }}
    >
      <span>{a}</span>
      <span style={{ color: colorB ?? color }}>{b}</span>
    </div>
    {sub ? (
      <div style={{ marginTop: 6, fontSize: 30, color: ui.apagado }}>{sub}</div>
    ) : null}
  </div>
);

export const AppCierre: React.FC = () => {
  const f = useCurrentFrame();
  const cuenta = iv(f, [8, 60], [0, 1], Easing.out(Easing.cubic));
  const scroll = -iv(f, [62, 92], [0, 760]) - iv(f, [118, 146], [0, 380]);
  return (
    <Pantalla>
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: 282 + 40 + scroll,
        }}
      >
        {/* Resultado del mes */}
        <div
          style={{
            borderRadius: 36,
            background: "#173968",
            border: `4px solid ${ui.verde}`,
            padding: "44px 46px",
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 4,
              color: ui.crema,
            }}
          >
            $ RESULTADO DEL MES
          </div>
          <div style={{ marginTop: 30, fontSize: 36, color: ui.rotulo }}>
            Ganancia del mes
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              color: ui.verde,
              letterSpacing: -2,
            }}
          >
            {pesos(GANANCIA * cuenta)}
          </div>
          <div
            style={{
              marginTop: 26,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 32,
              color: "#A9C6E6",
            }}
          >
            <span>Vendido en el mes</span>
            <span>{pesos(FACTURADO * cuenta)}</span>
          </div>
          <div
            style={{
              marginTop: 22,
              height: 16,
              borderRadius: 8,
              background: "#2B4A78",
            }}
          >
            <div
              style={{
                width: `${cuenta * 100}%`,
                height: "100%",
                borderRadius: 8,
                background: ui.verde,
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 22, marginTop: 34 }}>
          {["Nov 2026", "Oct 2026", "Sep 2026"].map((m, i) => (
            <div
              key={m}
              style={{
                padding: "20px 46px",
                borderRadius: 50,
                fontSize: 36,
                fontWeight: i === 0 ? 700 : 500,
                background: i === 0 ? "#1B3D73" : "transparent",
                border: `3px solid ${i === 0 ? ui.celeste : ui.borde}`,
              }}
            >
              {m}
            </div>
          ))}
        </div>
        {/* Cómo se calcula */}
        <div
          style={{
            marginTop: 40,
            borderRadius: 36,
            background: ui.tarjeta,
            border: `2px solid #2C3A54`,
            padding: "40px 46px 20px",
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 4,
              color: ui.rotulo,
            }}
          >
            CÓMO SE CALCULA
          </div>
          <Fila
            a="Total facturado"
            b={pesos(FACTURADO)}
            color={ui.crema}
            fuerte
            sub="Transferencia y Mercado Pago"
          />
          <Fila a="Costo de lo vendido (CMV)" b={`-${pesos(CMV)}`} />
          <Fila
            a="Margen bruto (52%)"
            b={pesos(MARGEN)}
            color="#A9C6E6"
            fuerte
          />
          <Fila a="Gastos fijos" b={`-${pesos(FIJOS)}`} />
          <Fila
            a="Ganancia del mes"
            b={pesos(GANANCIA)}
            color={ui.verde}
            fuerte
          />
        </div>
        {/* Movimientos */}
        <div
          style={{
            marginTop: 40,
            borderRadius: 36,
            background: ui.tarjeta,
            border: `2px solid #2C3A54`,
            padding: "40px 46px 20px",
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 4,
              color: ui.rotulo,
            }}
          >
            MOVIMIENTOS DEL MES
          </div>
          {[
            [
              "17/11 · Lucía G. · Fact. 43",
              "+$45.000",
              "Imperial negro guarda pampa · margen $21.000",
              true,
            ],
            [
              "15/11 · Martín R. · Fact. 42",
              "+$88.800",
              "Imperial base completa · margen $40.800",
              false,
            ],
            [
              "12/11 · Sofía P. · Fact. 41",
              "+$39.000",
              "Bombillón · margen $16.000",
              false,
            ],
            ["01/11 · Tienda online", "-$28.000", "Gasto fijo", false],
          ].map(([a, b, sub, nuevo]) => (
            <div
              key={a as string}
              style={{
                margin: "0 -20px",
                padding: "0 20px",
                borderRadius: 20,
                background: nuevo
                  ? `rgba(74,222,128,${iv(f, [150, 158, 180], [0, 0.22, 0.12])})`
                  : "transparent",
              }}
            >
              <Fila
                a={a as string}
                b={b as string}
                sub={sub as string}
                colorB={(b as string).startsWith("-") ? ui.texto : ui.verde}
              />
            </div>
          ))}
        </div>
      </div>
      <Cabecera />
      <Pestanas activa={4} />
    </Pantalla>
  );
};

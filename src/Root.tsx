import { Composition, Still } from "remotion";
import { Ad, AD_FRAMES } from "./HerenciaPatria/Ad";
import { Crudo, CRUDO_FRAMES, CRUDO_FRAMES_20 } from "./HerenciaPatria/Crudo";
import { Camionero, CAMIONERO_FRAMES } from "./HerenciaPatria/Camionero";
import { Balcon, BALCON_FRAMES } from "./HerenciaPatria/Balcon";
import {
  TorpedoVenta,
  TORPEDO_VENTA_FRAMES,
} from "./HerenciaPatria/TorpedoVenta";
import { MateNegro, MATE_NEGRO_FRAMES } from "./HerenciaPatria/MateNegro";
import { AnuncioEstatico, estaticos } from "./HerenciaPatria/Estaticos";
import { RetargetingOpcion } from "./HerenciaPatria/RetargetingOpciones";
import { Retargeting, RETARGETING_FRAMES } from "./HerenciaPatria/Retargeting";
import {
  BienvenidaHorizontal,
  BienvenidaPopup,
  BienvenidaVertical,
} from "./HerenciaPatria/Bienvenida";
import { DonPatricio, episodioFrames } from "./HerenciaPatria/DonPatricio";
import { agua, bombilla } from "./HerenciaPatria/patricioEpisodios";
import { Portada } from "./HerenciaPatria/Portada";
import { PortadaFeed } from "./HerenciaPatria/PortadaFeed";
import { Historia } from "./HerenciaPatria/Historia";
import { HistoriaDedicada } from "./HerenciaPatria/HistoriaDedicada";
import { HistoriaEmpresas } from "./HerenciaPatria/HistoriaEmpresas";
import { HistoriaEmpresasLogo } from "./HerenciaPatria/HistoriaEmpresasLogo";

// Cada <Composition> aparece en la barra lateral del Studio.

const cta = "Diseñá el tuyo en nuestra tienda online";

// Mismo tamaño y altura de título en todas las portadas de la serie. Arranca
// más abajo que el ícono de Reels, que en la grilla va arriba a la derecha.
const tituloPortada = { top: 430, titleScale: 0.92 };
// Descuento de bienvenida: a confirmar por la marca (porcentaje y código del
// cupón creado en la tienda).
const bienvenida = {
  descuento: "15% OFF",
  detalle: "en tu primera compra",
  codigo: "HERENCIA15",
};

// Una historia por día, con la foto (cuadro real de un video) y la frase.
const campanaCupon = [
  {
    dia: 20,
    src: "mate-crudo-mano.jpg",
    frase: ["quedan 5 días", "para estrenar el tuyo."],
    fraseArriba: false,
  },
  {
    dia: 21,
    src: "camionero-borde.jpg",
    frase: ["quedan 4 días", "para elegir el tuyo."],
    fraseArriba: false,
  },
  {
    dia: 22,
    src: "camionero-mano.jpg",
    frase: ["quedan 3 días.", "cada mate es único."],
    fraseArriba: false,
  },
  {
    dia: 23,
    src: "balcon-ciudad.jpg",
    frase: ["quedan 2 días", "para regalar tradición."],
    fraseArriba: true,
  },
  {
    dia: 24,
    src: "mate-crudo-borde.jpg",
    frase: ["mañana termina", "tu 15% de bienvenida."],
    fraseArriba: false,
  },
  {
    dia: 25,
    src: "balcon-cerca.jpg",
    frase: ["último día", "para usar tu cupón."],
    fraseArriba: true,
  },
  // Variante del 20 con la foto del balcón, sin contar los días.
  {
    dia: "20-balcon",
    src: "balcon-ciudad.jpg",
    frase: ["quedan pocos días", "para usar tu cupón."],
    fraseArriba: true,
  },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* npx remotion render HP-Reel-A out/herencia-patria-A.mp4 */}
      <Composition
        id="HP-Reel-A"
        component={Ad}
        durationInFrames={AD_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ hook: "A" as const, cta }}
      />
      <Composition
        id="HP-Reel-B"
        component={Ad}
        durationInFrames={AD_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ hook: "B" as const, cta }}
      />
      {/* npx remotion render HP-Crudo-A out/herencia-patria-crudo-A.mp4 */}
      {(["A", "B"] as const).map((hook) => (
        <Composition
          key={hook}
          id={`HP-Crudo-${hook}`}
          component={Crudo}
          durationInFrames={CRUDO_FRAMES}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            hook,
            cta: "Tradición que se lleva en las manos.",
          }}
        />
      ))}
      {/* npx remotion render HP-Torpedo-Retargeting entregas/torpedo-retargeting.mp4 */}
      <Composition
        id="HP-Torpedo-Retargeting"
        component={Retargeting}
        durationInFrames={RETARGETING_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* npx remotion render HP-Torpedo-Venta entregas/torpedo-venta.mp4 */}
      <Composition
        id="HP-Torpedo-Venta"
        component={TorpedoVenta}
        durationInFrames={TORPEDO_VENTA_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* npx remotion render HP-Torpedo-Venta-4x5 entregas/torpedo-venta-4x5.mp4 */}
      <Composition
        id="HP-Torpedo-Venta-4x5"
        component={TorpedoVenta}
        durationInFrames={TORPEDO_VENTA_FRAMES}
        fps={30}
        width={1080}
        height={1350}
      />
      {/* npx remotion render HP-Crudo-A-20s out/herencia-patria-crudo-A-20s.mp4 */}
      <Composition
        id="HP-Crudo-A-20s"
        component={Crudo}
        durationInFrames={CRUDO_FRAMES_20}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          hook: "A20" as const,
          cta: "Tradición que se lleva en las manos.",
        }}
      />
      {/* npx remotion still HP-Portada-Raiz entregas/portada-reel-raiz.jpg */}
      <Still
        id="HP-Portada-Raiz"
        component={Portada}
        width={1080}
        height={1920}
        defaultProps={{
          src: "mate-crudo-mano.jpg",
          lines: ["Hay piezas", "que llevan", "nuestra esencia."],
        }}
      />
      <Still
        id="HP-Portada-Tronco"
        component={Portada}
        width={1080}
        height={1920}
        defaultProps={{
          src: "portada-tronco.jpg",
          lines: ["Hay piezas", "que llevan", "nuestra esencia."],
          titleSize: 88,
          top: 250,
        }}
      />
      {/* npx remotion render HP-Camionero entregas/herencia-patria-camionero.mp4 */}
      <Composition
        id="HP-Camionero"
        component={Camionero}
        durationInFrames={CAMIONERO_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ cta: "Calidad que se aprecia." }}
      />
      {/* npx remotion render HP-MateNegro entregas/herencia-patria-mate-negro.mp4 */}
      <Composition
        id="HP-MateNegro"
        component={MateNegro}
        durationInFrames={MATE_NEGRO_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ cta: "Tradición que se lleva en las manos." }}
      />
      {/* npx remotion render HP-Balcon entregas/herencia-patria-balcon.mp4 */}
      <Composition
        id="HP-Balcon"
        component={Balcon}
        durationInFrames={BALCON_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ tagline: "Tradición que se lleva en las manos." }}
      />
      {/* npx remotion render HP-DonPatricio-Bombilla entregas/don-patricio-bombilla.mp4 */}
      <Composition
        id="HP-DonPatricio-Bombilla"
        component={DonPatricio}
        durationInFrames={episodioFrames(bombilla)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ ep: bombilla }}
      />
      {/* npx remotion render HP-DonPatricio-Agua entregas/don-patricio-agua.mp4 */}
      <Composition
        id="HP-DonPatricio-Agua"
        component={DonPatricio}
        durationInFrames={episodioFrames(agua)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ ep: agua }}
      />
      {/* npx remotion still HP-Estatico-Materiales-4x5 entregas/estatico-materiales-4x5.jpg */}
      {Object.entries(estaticos).flatMap(([nombre, props]) =>
        (
          [
            ["4x5", 1350],
            ["9x16", 1920],
          ] as const
        ).map(([formato, alto]) => (
          <Still
            key={`${nombre}-${formato}`}
            id={`HP-Estatico-${nombre}-${formato}`}
            component={AnuncioEstatico}
            width={1080}
            height={alto}
            defaultProps={props}
          />
        )),
      )}
      {(["minimal", "cupon"] as const).flatMap((estilo) =>
        ["mano", "mesa", "tronco", "crudo"].flatMap((foto) =>
          (
            [
              ["4x5", 1350],
              ["9x16", 1920],
            ] as const
          ).map(([formato, alto]) => (
            <Still
              key={`${estilo}-${foto}-${formato}`}
              id={`HP-RT-${estilo}-${foto}-${formato}`}
              component={RetargetingOpcion}
              width={1080}
              height={alto}
              defaultProps={{ estilo, foto }}
            />
          )),
        ),
      )}
      {/* npx remotion still HP-Bienvenida-Popup entregas/popup-tiendanube.png */}
      <Still
        id="HP-Bienvenida-Popup"
        component={BienvenidaPopup}
        width={1035}
        height={570}
        defaultProps={bienvenida}
      />
      {/* npx remotion still HP-Bienvenida-Vertical entregas/bienvenida-celular.png */}
      <Still
        id="HP-Bienvenida-Vertical"
        component={BienvenidaVertical}
        width={1080}
        height={1350}
        defaultProps={bienvenida}
      />
      {/* npx remotion still HP-Bienvenida-Horizontal entregas/bienvenida-compu.png */}
      <Still
        id="HP-Bienvenida-Horizontal"
        component={BienvenidaHorizontal}
        width={1536}
        height={1024}
        defaultProps={bienvenida}
      />
      {/* npx remotion still HP-Portada-Feed entregas/portada-reel-feed.jpg */}
      <Still
        id="HP-Portada-Feed"
        component={PortadaFeed}
        width={1080}
        height={1920}
        defaultProps={{
          src: "portada-raiz-feed.png",
          kicker: "Mate",
          name: "TORPEDO",
          sub: "Cuero Crudo",
          family: "caslon" as const,
          ...tituloPortada,
        }}
      />
      {/* npx remotion still HP-Portada-Camionero entregas/portada-camionero.png */}
      <Still
        id="HP-Portada-Camionero"
        component={PortadaFeed}
        width={1080}
        height={1920}
        defaultProps={{
          src: "portada-camionero.png",
          kicker: "Mate",
          name: "CAMIONERO",
          sub: "Cuero Crudo",
          family: "caslon" as const,
          logoSide: "left" as const,
        }}
      />
      {/* npx remotion still HP-Portada-Camionero-Volcado entregas/portada-camionero-volcado.png */}
      <Still
        id="HP-Portada-Camionero-Volcado"
        component={PortadaFeed}
        width={1080}
        height={1920}
        defaultProps={{
          src: "portada-camionero-volcado.png",
          kicker: "Mate",
          name: "CAMIONERO",
          sub: "Volcado · Cuero Crudo",
          family: "caslon" as const,
          logoSide: "right" as const,
          ...tituloPortada,
          zoom: 1.3,
          focusX: 40,
        }}
      />
      {/* Campaña del cupón de bienvenida (20 al 25 de octubre): una historia
          por día con la cuenta regresiva. Fotos reales sin retocar: cuadros
          de los videos de la marca, sólo escalados a 1080x1920.
          npx remotion still HP-Campana-20 entregas/campana-cupon-octubre/historia-20.jpg */}
      {campanaCupon.map(({ dia, src, frase, fraseArriba }) => (
        <Still
          key={dia}
          id={`HP-Campana-${dia}`}
          component={Historia}
          width={1080}
          height={1920}
          defaultProps={{
            src,
            subir: 0,
            frase,
            oferta: bienvenida.descuento,
            detalle: bienvenida.detalle,
            codigo: bienvenida.codigo,
            extra: "+ 20% off en transferencia",
            vence: "Hasta el 25 de octubre",
            cuponArriba: true,
            fraseArriba,
          }}
        />
      ))}
      {/* Mate personalizado para Lucas Ronier. Foto real; sólo se retocó la
          mano: tools/sacar_pelos.py y después tools/retocar_mano.py sobre
          mate-lucas-ronier-original.jpg, los dos con la virola afuera
          (caja 0,0,1110,1425).
          npx remotion still HP-Historia-Lucas-Ronier entregas/historia-lucas-ronier.jpg */}
      <Still
        id="HP-Historia-Lucas-Ronier"
        component={HistoriaDedicada}
        width={1080}
        height={1920}
        defaultProps={{
          src: "mate-lucas-ronier.jpg",
          estilo: "azul" as const,
          frase: ["mate personalizado", "para Lucas Ronier 🇧🇷"],
          grabado: "LR11 · Mãe · Pai · Irmãos",
        }}
      />
      {/* Pedidos empresariales de fin de año.
          npx remotion still HP-Historia-Empresas entregas/historia-empresas-fin-de-ano.jpg */}
      <Still
        id="HP-Historia-Empresas"
        component={HistoriaEmpresas}
        width={1080}
        height={1920}
        defaultProps={{
          mates: [
            [
              "producto/mate-algarrobo-blanco.jpg",
              "producto/mate-negro-dorado-flor-de-lis.jpg",
              "producto/mate-madera-pintado-blanco.jpg",
            ],
            [
              "producto/mate-bordo-cuero-cincelado.jpg",
              "producto/mate-algarrobo-imperial.jpg",
              "producto/mate-negro-guarda-pampa.jpg",
            ],
          ],
          titulo: ["Regalos", "empresariales"],
          bajada: "Acompañá a tu cliente en cada momento del día",
          beneficio: "Grabado gratis",
          confianza: "Ya nos eligieron",
          logos: [
            ["clientes/farmacity.png", 46],
            ["clientes/the-food-market.png", 76],
            ["clientes/simplicity.png", 30],
            ["clientes/get-the-look.png", 58],
          ],
          accion: "Cotizá tu pedido",
        }}
      />
      {/* Pedidos empresariales, para quien compra en la empresa: la prueba
          del grabado y los datos para cotizar.
          npx remotion still HP-Historia-Empresas-Logo entregas/historia-empresas-fin-de-ano-b.jpg */}
      <Still
        id="HP-Historia-Empresas-Logo"
        component={HistoriaEmpresasLogo}
        width={1080}
        height={1920}
        defaultProps={{
          titulo: ["Regalos", "empresariales"],
          bajada: [
            "Acompañá en cada momento del día",
            "a ese cliente que confió en vos este año",
          ],
          grabado: {
            foto: "grabado-logo.png",
          },
          datos: [
            ["Desde", "$19.000 c/u"],
            ["Pedido mínimo", "25 unidades"],
            ["Grabado", "Sin cargo"],
          ] as [string, string][],
          // Los de calabaza (simple, repujado y base bolita), algo más
          // grandes, y los de algarrobo (camionero, imperial e imperial con
          // base), sobre un estante crema. Antes se iguala el color de la madera de
          // los de algarrobo (tools/igualar_madera.py) y se empareja la luz del
          // cuerpo de los seis (tools/sin_brillo.py: filas 140-700, 140-700,
          // 150-495, 22-690, 178-690 y 198-595) y se baja el brillo del metal
          // sin tocar el cincelado (tools/virola_mate.py, el resto de las filas). Los de calabaza van un poco más
          // abajo (el último número): la foto los muestra desde arriba y la
          // pata de adelante queda más abajo que el piso real.
          //   python tools/estudio_mates.py public/estudio-mates.png 1080 300 220 100 \
          //     public/recortes/calabaza-simple.png:150:12 \
          //     public/recortes/calabaza-repujado.png:150:10 \
          //     public/recortes/calabaza-base-bolita.png:150:10 \
          //     public/recortes/algarrobo-camionero.png:132:0 \
          //     public/recortes/algarrobo-imperial.png:132:0 \
          //     public/recortes/algarrobo-imperial-con-base.png:140:0
          estudio: "estudio-mates.png",
          confianza: "Ya nos eligieron",
          logos: [
            ["clientes/farmacity-crema.png", 46],
            ["clientes/the-food-market-crema.png", 76],
            ["clientes/simplicity-crema.png", 30],
            ["clientes/get-the-look-crema.png", 58],
          ] as [string, number][],
          accion: "Cotizá tu pedido",
        }}
      />
      {/* Variante con el sello y la dedicatoria escrita.
          npx remotion still HP-Historia-Lucas-Ronier-Sello entregas/historia-lucas-ronier-sello.jpg */}
      <Still
        id="HP-Historia-Lucas-Ronier-Sello"
        component={HistoriaDedicada}
        width={1080}
        height={1920}
        defaultProps={{
          src: "mate-lucas-ronier.jpg",
          estilo: "sello" as const,
          frase: ["mate personalizado", "para Lucas Ronier 🇧🇷"],
          grabado: "LR11 · Mãe · Pai · Irmãos",
        }}
      />
    </>
  );
};

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
import {
  BienvenidaHorizontal,
  BienvenidaVertical,
} from "./HerenciaPatria/Bienvenida";
import { DonPatricio, episodioFrames } from "./HerenciaPatria/DonPatricio";
import { agua, bombilla } from "./HerenciaPatria/patricioEpisodios";
import { Portada } from "./HerenciaPatria/Portada";
import { PortadaFeed } from "./HerenciaPatria/PortadaFeed";

// Cada <Composition> aparece en la barra lateral del Studio.

const cta = "Diseñá el tuyo en nuestra tienda online";

// Mismo tamaño y altura de título en todas las portadas de la serie. Arranca
// más abajo que el ícono de Reels, que en la grilla va arriba a la derecha.
const tituloPortada = { top: 430, titleScale: 0.92 };
// Descuento de bienvenida: a confirmar por la marca (porcentaje y código del
// cupón creado en la tienda).
const bienvenida = {
  descuento: "10% OFF",
  detalle: "en tu primera compra",
  codigo: "BIENVENIDO10",
};

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
          src: "portada-raiz.jpg",
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
    </>
  );
};

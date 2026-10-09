import { Composition, Still } from "remotion";
import { Ad, AD_FRAMES } from "./HerenciaPatria/Ad";
import { Crudo, CRUDO_FRAMES, CRUDO_FRAMES_20 } from "./HerenciaPatria/Crudo";
import { Portada } from "./HerenciaPatria/Portada";
import { PortadaFeed } from "./HerenciaPatria/PortadaFeed";

// Cada <Composition> aparece en la barra lateral del Studio.

const cta = "Diseñá el tuyo en nuestra tienda online";

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
      {/* npx remotion still HP-Portada-Feed entregas/portada-reel-feed.jpg */}
      <Still
        id="HP-Portada-Feed"
        component={PortadaFeed}
        width={1080}
        height={1920}
        defaultProps={{
          src: "portada-raiz-feed.jpg",
          kicker: "Mate",
          name: "TORPEDO",
          sub: "Cuero Crudo",
          tag: "Exclusivo",
          family: "caslon" as const,
        }}
      />
    </>
  );
};

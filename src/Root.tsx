import { Composition } from "remotion";
import { Ad, AD_FRAMES } from "./HerenciaPatria/Ad";
import { Crudo, CRUDO_FRAMES } from "./HerenciaPatria/Crudo";

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
      {/* npx remotion render HP-Crudo out/herencia-patria-crudo.mp4 */}
      <Composition
        id="HP-Crudo"
        component={Crudo}
        durationInFrames={CRUDO_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          cta: "Tradición que se lleva en las manos.",
        }}
      />
    </>
  );
};

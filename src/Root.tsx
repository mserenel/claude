import { Composition } from "remotion";
import { Ad, AD_FRAMES } from "./HerenciaPatria/Ad";
import { Crudo, CRUDO_FRAMES, CRUDO_FRAMES_20 } from "./HerenciaPatria/Crudo";

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
    </>
  );
};

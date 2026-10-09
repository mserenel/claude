import { Composition } from "remotion";
import { Ad, AD_FRAMES, AdProps } from "./HerenciaPatria/Ad";

// Cada <Composition> aparece en la barra lateral del Studio.

const defaults: Omit<AdProps, "hook"> = {
  brand: "Herencia Patria",
  cta: "Descubrilo en la tienda online",
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
        defaultProps={{ ...defaults, hook: "A" as const }}
      />
      <Composition
        id="HP-Reel-B"
        component={Ad}
        durationInFrames={AD_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ ...defaults, hook: "B" as const }}
      />
    </>
  );
};

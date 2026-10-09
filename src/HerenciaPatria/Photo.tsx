import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Foto real con un movimiento de cámara lento (acercamiento o alejamiento).
// Solo cambia el encuadre: la imagen del producto no se toca.
export const Photo: React.FC<{
  readonly src: string;
  readonly zoom: [number, number];
  readonly focus: [number, number];
}> = ({ src, zoom, focus }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], zoom, {
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
          transformOrigin: `${focus[0]}% ${focus[1]}%`,
        }}
      />
    </AbsoluteFill>
  );
};

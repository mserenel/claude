import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Corrección de color moderada y cálida, para que la toma de estudio combine
// con la luz de ventana de la foto. No toca forma ni detalle del producto.
const grade = "contrast(1.08) brightness(0.97) saturate(1.04) sepia(0.1)";

// Video con un acercamiento lento de cámara (dolly) a lo largo del plano.
// Viñeta cálida, como la de un lente, para que la pared gris pase a fondo.
export const Clip: React.FC<{
  readonly src: string;
  readonly from?: number;
  readonly zoom: [number, number];
  readonly focus: [number, number];
}> = ({ src, from = 0, zoom, focus }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], zoom);

  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        trimBefore={Math.round(from * fps)}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: grade,
          transform: `scale(${scale})`,
          transformOrigin: `${focus[0]}% ${focus[1]}%`,
        }}
      />
      <AbsoluteFill
        style={{
          background: [
            "radial-gradient(ellipse 72% 55% at 50% 50%, rgba(22,14,8,0) 45%, rgba(22,14,8,0.5) 78%, rgba(22,14,8,0.85) 100%)",
            "linear-gradient(to bottom, rgba(22,14,8,0.6) 0%, rgba(22,14,8,0) 28%)",
          ].join(","),
        }}
      />
    </AbsoluteFill>
  );
};

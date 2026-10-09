import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Foto real con un movimiento de cámara lento (acercamiento, alejamiento o
// paneo). Solo cambia el encuadre: la imagen del producto no se toca.
export const Photo: React.FC<{
  readonly src: string;
  readonly zoom: [number, number];
  // Punto de encuadre, en % del cuadro; con dos puntos, la cámara se desplaza.
  readonly focus: [number, number] | [[number, number], [number, number]];
}> = ({ src, zoom, focus }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], {
    easing: Easing.inOut(Easing.sin),
  });
  const [from, to] =
    typeof focus[0] === "number"
      ? [focus as [number, number], focus as [number, number]]
      : (focus as [[number, number], [number, number]]);
  const scale = zoom[0] + (zoom[1] - zoom[0]) * t;
  const fx = from[0] + (to[0] - from[0]) * t;
  const fy = from[1] + (to[1] - from[1]) * t;

  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
          transformOrigin: `${fx}% ${fy}%`,
        }}
      />
    </AbsoluteFill>
  );
};

import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type ShotProps = {
  // Segundo del video original donde empieza el plano.
  readonly from: number;
  // 0.5 = cámara lenta real (el original está filmado a 60 fps).
  readonly rate: number;
  // Reencuadre: zoom inicial y final (1 = plano completo).
  readonly zoom: [number, number];
  // Punto donde se centra el reencuadre, en % del cuadro.
  readonly focus: [number, number];
};

// Look "low key": bajamos la exposición general y oscurecemos los bordes del
// cuadro (viñeta, como la de un lente) para que la pared clara pase a un
// fondo profundo y el mate quede iluminado al centro. No toca el producto.
const grade = "contrast(1.1) brightness(0.96) saturate(1.03)";

export const Shot: React.FC<ShotProps> = ({ from, rate, zoom, focus }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], zoom);

  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("mate-hq.mp4")}
        trimBefore={Math.round(from * fps)}
        playbackRate={rate}
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
            "radial-gradient(ellipse 70% 52% at 50% 52%, rgba(8,14,26,0) 45%, rgba(8,14,26,0.55) 75%, rgba(8,14,26,0.9) 100%)",
            "linear-gradient(to bottom, rgba(8,14,26,0.7) 0%, rgba(8,14,26,0) 30%)",
          ].join(","),
        }}
      />
    </AbsoluteFill>
  );
};

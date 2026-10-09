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

// Corrección de color moderada: solo contraste y exposición, sin virar el tono.
const grade = "contrast(1.06) brightness(1.03) saturate(1.02)";

export const Shot: React.FC<ShotProps> = ({ from, rate, zoom, focus }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], zoom);

  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("mate.mp4")}
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
    </AbsoluteFill>
  );
};

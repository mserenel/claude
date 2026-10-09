import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts, safe } from "./brand";

export const Caption: React.FC<{
  readonly text: string;
  readonly position?: "top" | "bottom";
  // El último texto antes del cierre también apaga su degradé; entre textos
  // el degradé queda, porque el siguiente lo reemplaza.
  readonly last?: boolean;
}> = ({ text, position = "bottom", last }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const enter = interpolate(frame, [4, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // Sale con un fundido corto, para no cortar de golpe al terminar.
  const exit = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: last ? exit : 1 }}>
        <Scrim position={position} />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: safe.left,
          right: safe.right,
          ...(position === "bottom"
            ? { bottom: safe.bottom + 40 }
            : { top: safe.top + 40 }),
          opacity: enter * exit,
          transform: `translateY(${(1 - enter) * 16}px)`,
          fontFamily: fonts.serif,
          fontWeight: 600,
          fontSize: 92,
          lineHeight: 1.02,
          color: colors.crema,
          textShadow: "0 2px 18px rgba(0,0,0,0.35)",
          textWrap: "balance",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// Degradé oscuro cálido detrás del texto para que se lea sobre cualquier
// toma. Va arriba cuando el detalle del plano está abajo.
export const Scrim: React.FC<{ readonly position?: "top" | "bottom" }> = ({
  position = "bottom",
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      [position]: 0,
      height: position === "bottom" ? 1000 : 800,
      background: `linear-gradient(to ${position}, rgba(18,12,8,0) 0%, rgba(18,12,8,0.5) 55%, rgba(18,12,8,0.75) 100%)`,
    }}
  />
);

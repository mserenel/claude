import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { colors, fonts, safe } from "./brand";

export const Caption: React.FC<{
  readonly text: string;
  readonly position?: "top" | "bottom";
}> = ({ text, position = "bottom" }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [4, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      <Scrim position={position} />
      <div
        style={{
          position: "absolute",
          left: safe.left,
          right: safe.right,
          ...(position === "bottom"
            ? { bottom: safe.bottom + 40 }
            : { top: safe.top + 40 }),
          opacity: enter,
          transform: `translateY(${(1 - enter) * 16}px)`,
          fontFamily: fonts.serif,
          fontWeight: 600,
          fontSize: 92,
          lineHeight: 1.02,
          color: colors.crema,
          textShadow: "0 2px 18px rgba(0,0,0,0.35)",
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

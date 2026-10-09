import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { colors, fonts, safe } from "./brand";
import { Scrim } from "./Caption";

const fadeIn = (frame: number, start: number) =>
  interpolate(frame, [start, start + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

export const EndCard: React.FC<{
  readonly brand: string;
  readonly cta: string;
}> = ({ brand, cta }) => {
  const frame = useCurrentFrame();
  const a = fadeIn(frame, 18);
  const b = fadeIn(frame, 30);

  return (
    <AbsoluteFill>
      <Scrim />
      <div
        style={{
          position: "absolute",
          left: safe.left,
          right: safe.right,
          bottom: safe.bottom + 40,
          color: colors.crema,
        }}
      >
        {/* Texto, no logo: el logo original se reemplaza acá cuando esté. */}
        <div
          style={{
            opacity: a,
            fontFamily: fonts.serif,
            fontWeight: 600,
            fontSize: 96,
            lineHeight: 1,
            textShadow: "0 2px 18px rgba(0,0,0,0.35)",
          }}
        >
          {brand}
        </div>
        <div
          style={{
            opacity: a,
            width: 120,
            height: 3,
            margin: "28px 0",
            backgroundColor: colors.mostaza,
          }}
        />
        <div
          style={{
            opacity: b,
            transform: `translateY(${(1 - b) * 12}px)`,
            fontFamily: fonts.sans,
            fontWeight: 500,
            fontSize: 48,
            letterSpacing: 1,
          }}
        >
          {cta} →
        </div>
      </div>
    </AbsoluteFill>
  );
};

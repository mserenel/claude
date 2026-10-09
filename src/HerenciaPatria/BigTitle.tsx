import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { colors, fonts, safe } from "./brand";

// Título de gancho: grande, en el tercio superior, palabra por palabra.
export const BigTitle: React.FC<{
  readonly lines: string[];
  readonly delay?: number;
}> = ({ lines, delay = 3 }) => {
  const frame = useCurrentFrame();
  let index = 0;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 1150,
          background:
            "linear-gradient(to top, rgba(18,12,8,0) 0%, rgba(18,12,8,0.45) 50%, rgba(18,12,8,0.7) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: safe.left,
          // Arriba no están los botones de Instagram: se usa casi todo el ancho.
          right: safe.left,
          top: safe.top - 20,
          fontFamily: fonts.serif,
          fontWeight: 600,
          fontSize: 124,
          lineHeight: 0.98,
          color: colors.crema,
          textShadow: "0 3px 24px rgba(0,0,0,0.45)",
        }}
      >
        {lines.map((line) => (
          <div key={line}>
            {line.split(" ").map((word) => {
              const start = delay + index++ * 5;
              const t = interpolate(frame, [start, start + 9], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              });
              return (
                <span
                  key={word}
                  style={{
                    display: "inline-block",
                    marginRight: "0.24em",
                    opacity: t,
                    transform: `translateY(${(1 - t) * 28}px)`,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        ))}
        <div
          style={{
            width: 140,
            height: 4,
            marginTop: 34,
            backgroundColor: colors.mostaza,
            transformOrigin: "left",
            transform: `scaleX(${interpolate(
              frame,
              [delay + index * 5, delay + index * 5 + 14],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              },
            )})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

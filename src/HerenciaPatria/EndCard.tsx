import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { colors, fonts } from "./brand";

const fadeIn = (frame: number, start: number, length = 14) =>
  interpolate(frame, [start, start + length], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

// Cierre: se oscurece la escena y aparece el logo original (sin modificar)
// con el llamado a la acción.
export const EndCard: React.FC<{ readonly cta: string }> = ({ cta }) => {
  const frame = useCurrentFrame();
  const dim = fadeIn(frame, 0, 18);
  const logo = fadeIn(frame, 10);
  const text = fadeIn(frame, 24);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ backgroundColor: colors.azul, opacity: 0.72 * dim }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 120,
        }}
      >
        <Img
          src={staticFile("logo-herencia-patria.png")}
          style={{
            width: 440,
            height: 440,
            opacity: logo,
            transform: `scale(${0.96 + 0.04 * logo})`,
          }}
        />
        <div
          style={{
            opacity: logo,
            width: 120,
            height: 3,
            margin: "56px 0 40px",
            backgroundColor: colors.mostaza,
          }}
        />
        <div
          style={{
            opacity: text,
            transform: `translateY(${(1 - text) * 12}px)`,
            fontFamily: fonts.serif,
            fontWeight: 600,
            fontSize: 76,
            lineHeight: 1.05,
            color: colors.crema,
            textAlign: "center",
            maxWidth: 820,
            textWrap: "balance",
          }}
        >
          {cta}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

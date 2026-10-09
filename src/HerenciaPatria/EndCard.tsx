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
// con el llamado a la acción y, si hay, los beneficios de compra.
export const EndCard: React.FC<{
  readonly cta: string;
  readonly benefits?: string[];
}> = ({ cta, benefits = [] }) => {
  const frame = useCurrentFrame();
  const fast = benefits.length > 0;
  const dim = fadeIn(frame, 0, fast ? 12 : 18);
  const logo = fadeIn(frame, fast ? 4 : 10);
  const text = fadeIn(frame, fast ? 14 : 24);
  const logoSize = fast ? 360 : 440;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ backgroundColor: colors.azul, opacity: 0.72 * dim }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: fast ? 60 : 120,
        }}
      >
        <Img
          src={staticFile("logo-herencia-patria.png")}
          style={{
            width: logoSize,
            height: logoSize,
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
            backgroundColor: colors.crema,
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
        {benefits.length > 0 ? (
          <div
            style={{
              marginTop: 64,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {benefits.map((b, i) => {
              const t = fadeIn(frame, 26 + i * 7, 12);
              return (
                <div
                  key={b}
                  style={{
                    opacity: t,
                    transform: `translateY(${(1 - t) * 10}px)`,
                    fontFamily: fonts.serif,
                    fontWeight: 600,
                    fontSize: 60,
                    fontVariantNumeric: "lining-nums",
                    whiteSpace: "nowrap",
                    letterSpacing: 0.3,
                    color: colors.crema,
                    padding: "18px 0",
                    width: 900,
                    textAlign: "center",
                    borderTop:
                      i === 0 ? undefined : "1px solid rgba(243,235,221,0.35)",
                  }}
                >
                  {b}
                </div>
              );
            })}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

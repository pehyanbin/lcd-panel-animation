// src/sections/IntroSection.tsx
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

export const IntroSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12 } });
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(frame, [70, 90], [1, 0], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
      }}
    >
      <div
        style={{
          transform: `scale(${titleScale})`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            color: "#ffffff",
            margin: 0,
            textShadow: "0 0 40px rgba(100, 150, 255, 0.5)",
          }}
        >
          LCD Panel Technologies
        </h1>
        <div
          style={{
            opacity: subtitleOpacity,
            fontSize: 32,
            color: "#8899bb",
            marginTop: 20,
            fontFamily: "Arial, sans-serif",
          }}
        >
          TN • VA • IPS — How They Work
        </div>
        <div
          style={{
            opacity: subtitleOpacity,
            display: "flex",
            gap: 40,
            marginTop: 60,
            justifyContent: "center",
          }}
        >
          {["Backlight", "Polarizer", "Liquid Crystals", "Color Filter"].map(
            (label, i) => {
              const delay = 30 + i * 8;
              const itemOpacity = interpolate(
                frame,
                [delay, delay + 15],
                [0, 1],
                { extrapolateRight: "clamp" }
              );
              const itemY = interpolate(
                frame,
                [delay, delay + 15],
                [20, 0],
                { extrapolateRight: "clamp" }
              );
              return (
                <div
                  key={label}
                  style={{
                    opacity: itemOpacity,
                    transform: `translateY(${itemY}px)`,
                    padding: "12px 24px",
                    borderRadius: 8,
                    backgroundColor: "rgba(100, 150, 255, 0.15)",
                    border: "1px solid rgba(100, 150, 255, 0.3)",
                    color: "#aabbdd",
                    fontSize: 18,
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {label}
                </div>
              );
            }
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
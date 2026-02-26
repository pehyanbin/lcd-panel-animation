// src/components/ExplanationBox.tsx
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface ExplanationBoxProps {
  texts: { text: string; startFrame: number }[];
  x: number;
  y: number;
  width?: number;
  color?: string;
}

export const ExplanationBox: React.FC<ExplanationBoxProps> = ({
  texts,
  x,
  y,
  width = 400,
  color = "#aabbdd",
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
      }}
    >
      {texts.map(({ text, startFrame }, i) => {
        const opacity = interpolate(
          frame,
          [startFrame, startFrame + 20],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const translateY = interpolate(
          frame,
          [startFrame, startFrame + 20],
          [15, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <p
            key={i}
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
              color,
              fontSize: 17,
              fontFamily: "Arial, sans-serif",
              lineHeight: 1.6,
              margin: 0,
              marginBottom: 12,
              paddingLeft: 16,
              borderLeft: `3px solid ${color}44`,
            }}
          >
            {text}
          </p>
        );
      })}
    </div>
  );
};
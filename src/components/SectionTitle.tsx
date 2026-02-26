// src/components/SectionTitle.tsx
import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface SectionTitleProps {
  title: string;
  subtitle: string;
  color: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleX = spring({
    frame,
    fps,
    config: { damping: 15 },
    from: -100,
    to: 0,
  });

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", top: 40, left: 60 }}>
      <h2
        style={{
          fontSize: 52,
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
          color,
          margin: 0,
          opacity: titleOpacity,
          transform: `translateX(${titleX}px)`,
          textShadow: `0 0 30px ${color}66`,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: 20,
          fontFamily: "Arial, sans-serif",
          color: "#8899bb",
          margin: 0,
          marginTop: 8,
          opacity: subtitleOpacity,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};
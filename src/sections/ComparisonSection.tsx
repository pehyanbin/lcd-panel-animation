// src/sections/ComparisonSection.tsx
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

interface ComparisonItemProps {
  type: string;
  color: string;
  viewingAngle: string;
  responseTime: string;
  contrast: string;
  colorAccuracy: string;
  delay: number;
}

const ComparisonItem: React.FC<ComparisonItemProps> = ({
  type,
  color,
  viewingAngle,
  responseTime,
  contrast,
  colorAccuracy,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12 },
  });

  return (
    <div
      style={{
        transform: `scale(${Math.max(0, scale)})`,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 16,
        padding: 30,
        border: `2px solid ${color}44`,
        width: 350,
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h3
        style={{ fontSize: 36, color, margin: 0, marginBottom: 20 }}
      >
        {type}
      </h3>
      {[
        { label: "Viewing Angle", value: viewingAngle },
        { label: "Response Time", value: responseTime },
        { label: "Contrast", value: contrast },
        { label: "Color Accuracy", value: colorAccuracy },
      ].map((row) => (
        <div
          key={row.label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 0",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span style={{ color: "#8899bb", fontSize: 16 }}>{row.label}</span>
          <span style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}>
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const ComparisonSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h2
        style={{
          fontSize: 48,
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
          opacity: titleOpacity,
          marginBottom: 50,
          textShadow: "0 0 30px rgba(100,150,255,0.4)",
        }}
      >
        Comparison Summary
      </h2>
      <div style={{ display: "flex", gap: 40 }}>
        <ComparisonItem
          type="TN"
          color="#ff6b6b"
          viewingAngle="Narrow"
          responseTime="★★★★★"
          contrast="★★★☆☆"
          colorAccuracy="★★☆☆☆"
          delay={10}
        />
        <ComparisonItem
          type="VA"
          color="#4ecdc4"
          viewingAngle="Medium"
          responseTime="★★★☆☆"
          contrast="★★★★★"
          colorAccuracy="★★★★☆"
          delay={18}
        />
        <ComparisonItem
          type="IPS"
          color="#45b7d1"
          viewingAngle="Wide"
          responseTime="★★★★☆"
          contrast="★★★☆☆"
          colorAccuracy="★★★★★"
          delay={26}
        />
      </div>
    </AbsoluteFill>
  );
};
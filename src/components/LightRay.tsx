// src/components/LightRay.tsx
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface LightRayProps {
  x: number;
  startY: number;
  endY: number;
  color?: string;
  progress: number;
  waveAmplitude?: number;
  polarizationAngle?: number;
  blocked?: boolean;
}

export const LightRay: React.FC<LightRayProps> = ({
  x,
  startY,
  endY,
  color = "#ffdd44",
  progress,
  waveAmplitude = 15,
  polarizationAngle = 0,
  blocked = false,
}) => {
  const frame = useCurrentFrame();
  const rayLength = Math.abs(endY - startY);
  const currentLength = rayLength * progress;
  const goingDown = endY > startY;

  const points: string[] = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const yPos = goingDown ? startY + t * currentLength : startY - t * currentLength;
    const wave =
      Math.sin(t * 12 + frame * 0.15) *
      waveAmplitude *
      Math.cos((polarizationAngle * Math.PI) / 180);
    points.push(`${x + wave},${yPos}`);
  }

  const opacity = blocked
    ? interpolate(progress, [0.6, 1], [1, 0.1], {
        extrapolateRight: "clamp",
      })
    : 0.8;

  return (
    <polyline
      points={points.join(" ")}
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      opacity={opacity}
      strokeLinecap="round"
    />
  );
};
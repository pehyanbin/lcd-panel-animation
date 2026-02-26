// src/components/ViewingAngleDiagram.tsx
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface ViewingAngleDiagramProps {
  x: number;
  y: number;
  angleRange: number; // in degrees, total viewing angle
  color: string;
  label: string;
  progress: number;
}

export const ViewingAngleDiagram: React.FC<ViewingAngleDiagramProps> = ({
  x,
  y,
  angleRange,
  color,
  label,
  progress,
}) => {
  const halfAngle = (angleRange / 2) * progress;
  const radius = 80;

  const startAngle = 270 - halfAngle;
  const endAngle = 270 + halfAngle;

  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const x1 = x + radius * Math.cos(startRad);
  const y1 = y + radius * Math.sin(startRad);
  const x2 = x + radius * Math.cos(endRad);
  const y2 = y + radius * Math.sin(endRad);

  const largeArc = halfAngle > 90 ? 1 : 0;

  return (
    <g opacity={progress}>
      {/* Monitor base */}
      <rect
        x={x - 40}
        y={y - 50}
        width={80}
        height={55}
        rx={4}
        fill="none"
        stroke={color}
        strokeWidth={2}
        opacity={0.6}
      />
      {/* Viewing cone */}
      <path
        d={`M ${x} ${y} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={color}
        opacity={0.15}
        stroke={color}
        strokeWidth={1}
      />
      {/* Angle label */}
      <text
        x={x}
        y={y + radius + 25}
        textAnchor="middle"
        fill={color}
        fontSize={14}
        fontFamily="Arial, sans-serif"
      >
        {label}: {angleRange}°
      </text>
    </g>
  );
};
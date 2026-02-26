// src/components/PolarizationArrow.tsx
import React from "react";

interface PolarizationArrowProps {
  x: number;
  y: number;
  angle: number;
  label?: string;
  color?: string;
  size?: number;
}

export const PolarizationArrow: React.FC<PolarizationArrowProps> = ({
  x,
  y,
  angle,
  label,
  color = "#ffdd44",
  size = 30,
}) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Circle */}
      <circle
        r={size}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        opacity={0.4}
      />
      {/* Arrow line */}
      <line
        x1={-size * 0.8 * Math.cos((angle * Math.PI) / 180)}
        y1={-size * 0.8 * Math.sin((angle * Math.PI) / 180)}
        x2={size * 0.8 * Math.cos((angle * Math.PI) / 180)}
        y2={size * 0.8 * Math.sin((angle * Math.PI) / 180)}
        stroke={color}
        strokeWidth={2}
        markerEnd="url(#arrowhead)"
      />
      {/* Label */}
      {label && (
        <text
          x={0}
          y={size + 18}
          textAnchor="middle"
          fill={color}
          fontSize={12}
          fontFamily="Arial, sans-serif"
        >
          {label}
        </text>
      )}
    </g>
  );
};
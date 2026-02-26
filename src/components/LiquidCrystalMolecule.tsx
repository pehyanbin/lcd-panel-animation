// src/components/LiquidCrystalMolecule.tsx
import React from "react";

interface LiquidCrystalMoleculeProps {
  x: number;
  y: number;
  rotation: number;
  tilt: number;
  color?: string;
  size?: number;
}

export const LiquidCrystalMolecule: React.FC<LiquidCrystalMoleculeProps> = ({
  x,
  y,
  rotation,
  tilt = 0,
  color = "#66aaff",
  size = 1,
}) => {
  const length = 36 * size;
  const width = 8 * size;

  return (
    <div
      style={{
        position: "absolute",
        left: x - length / 2,
        top: y - width / 2,
        width: length,
        height: width,
        transform: `rotate(${rotation}deg) perspective(200px) rotateX(${tilt}deg)`,
        transformOrigin: "center center",
      }}
    >
      {/* Molecule body - elongated ellipse */}
      <svg width={length} height={width} viewBox={`0 0 ${length} ${width}`}>
        <defs>
          <linearGradient id={`mol-${x}-${y}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={0.9} />
            <stop offset="50%" stopColor="#ffffff" stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0.9} />
          </linearGradient>
        </defs>
        <ellipse
          cx={length / 2}
          cy={width / 2}
          rx={length / 2 - 1}
          ry={width / 2 - 1}
          fill={`url(#mol-${x}-${y})`}
          stroke={color}
          strokeWidth={0.5}
        />
      </svg>
    </div>
  );
};
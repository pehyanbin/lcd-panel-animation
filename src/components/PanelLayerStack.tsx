// src/components/PanelLayerStack.tsx
import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface PanelLayerStackProps {
  layers: {
    label: string;
    color: string;
    opacity: number;
    pattern?: React.ReactNode;
  }[];
  explodeProgress: number;
}

export const PanelLayerStack: React.FC<PanelLayerStackProps> = ({
  layers,
  explodeProgress,
}) => {
  const layerWidth = 320;
  const layerHeight = 50;
  const totalLayers = layers.length;

  return (
    <div
      style={{
        position: "relative",
        width: layerWidth + 200,
        height: 500,
        transformStyle: "preserve-3d",
        transform: "perspective(1000px) rotateX(25deg) rotateY(-15deg)",
      }}
    >
      {layers.map((layer, i) => {
        const baseY = 200;
        const spacing = interpolate(explodeProgress, [0, 1], [8, 65]);
        const y = baseY + (i - totalLayers / 2) * spacing;

        return (
          <div key={layer.label} style={{ position: "absolute" }}>
            {/* Layer body */}
            <div
              style={{
                position: "absolute",
                left: 40,
                top: y,
                width: layerWidth,
                height: layerHeight,
                backgroundColor: layer.color,
                opacity: layer.opacity,
                borderRadius: 6,
                border: `1px solid rgba(255,255,255,0.2)`,
                boxShadow: `0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                transformStyle: "preserve-3d",
                transform: `translateZ(${(totalLayers - i) * 3}px)`,
              }}
            >
              {layer.pattern}
            </div>
            {/* Label */}
            <div
              style={{
                position: "absolute",
                left: layerWidth + 60,
                top: y + layerHeight / 2 - 10,
                color: "#ccddee",
                fontSize: 14,
                fontFamily: "Arial, sans-serif",
                whiteSpace: "nowrap",
                opacity: interpolate(explodeProgress, [0.3, 0.6], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 1,
                    backgroundColor: "#556677",
                  }}
                />
                {layer.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
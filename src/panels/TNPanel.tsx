// src/panels/TNPanel.tsx
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { SectionTitle } from "../components/SectionTitle";
import { ExplanationBox } from "../components/ExplanationBox";
import { LiquidCrystalMolecule } from "../components/LiquidCrystalMolecule";
import { LightRay } from "../components/LightRay";
import { PolarizationArrow } from "../components/PolarizationArrow";
import { ViewingAngleDiagram } from "../components/ViewingAngleDiagram";

export const TNPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase control
  const phase1 = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: "clamp",
  }); // Exploded view
  const phase2 = interpolate(frame, [60, 120], [0, 1], {
    extrapolateRight: "clamp",
  }); // No voltage - twisted
  const phase3 = interpolate(frame, [140, 200], [0, 1], {
    extrapolateRight: "clamp",
  }); // Voltage applied - aligned
  const exitOpacity = interpolate(frame, [220, 240], [1, 0], {
    extrapolateLeft: "clamp",
  });

  // Voltage toggle
  const voltageApplied = frame > 140;
  const twistAmount = voltageApplied
    ? interpolate(frame, [140, 180], [90, 0], { extrapolateRight: "clamp" })
    : 90;

  const panelCenterX = 750;
  const panelTopY = 180;
  const panelBottomY = 750;
  const layerSpacing = (panelBottomY - panelTopY) / 6;

  // Layer positions
  const backlightY = panelTopY;
  const polarizer1Y = panelTopY + layerSpacing;
  const lcTopY = panelTopY + layerSpacing * 2;
  const lcBottomY = panelTopY + layerSpacing * 4;
  const polarizer2Y = panelTopY + layerSpacing * 5;
  const colorFilterY = panelBottomY;

  const layerWidth = 280;
  const layerHeight = 40;

  // Molecule grid
  const molCols = 5;
  const molRows = 5;

  const lightProgress = interpolate(frame, [70, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const voltageIndicatorOpacity = interpolate(frame, [130, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      <SectionTitle
        title="TN Panel"
        subtitle="Twisted Nematic — Fast response, narrow viewing angles"
        color="#ff6b6b"
      />

      {/* Main 3D Panel Visualization */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 130,
          width: 900,
          height: 700,
        }}
      >
        <svg width={900} height={700} viewBox="0 0 900 700">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#ffdd44" />
            </marker>
            <linearGradient id="backlightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#ffffcc" stopOpacity={0.7} />
            </linearGradient>
          </defs>

          {/* Perspective transform group */}
          <g transform="translate(100, 20)">
            {/* Backlight */}
            <g opacity={interpolate(phase1, [0, 0.3], [0, 1], { extrapolateRight: "clamp" })}>
              <rect
                x={panelCenterX - layerWidth / 2}
                y={backlightY}
                width={layerWidth}
                height={layerHeight}
                rx={6}
                fill="url(#backlightGrad)"
                stroke="#ddddaa"
                strokeWidth={1}
              />
              <text
                x={panelCenterX + layerWidth / 2 + 15}
                y={backlightY + layerHeight / 2 + 5}
                fill="#ccccaa"
                fontSize={13}
                fontFamily="Arial"
              >
                Backlight (White LED)
              </text>
              {/* Light source icon */}
              <circle
                cx={panelCenterX}
                cy={backlightY + layerHeight / 2}
                r={8}
                fill="#ffee00"
                opacity={0.6 + Math.sin(frame * 0.1) * 0.2}
              />
            </g>

            {/* First Polarizer (Horizontal) */}
            <g opacity={interpolate(phase1, [0.1, 0.4], [0, 1], { extrapolateRight: "clamp" })}>
              <rect
                x={panelCenterX - layerWidth / 2}
                y={polarizer1Y}
                width={layerWidth}
                height={layerHeight}
                rx={6}
                fill="rgba(100, 100, 200, 0.4)"
                stroke="rgba(100, 100, 200, 0.6)"
                strokeWidth={1}
              />
              {/* Horizontal lines pattern */}
              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={i}
                  x1={panelCenterX - layerWidth / 2 + 10}
                  y1={polarizer1Y + 5 + i * (layerHeight / 9)}
                  x2={panelCenterX + layerWidth / 2 - 10}
                  y2={polarizer1Y + 5 + i * (layerHeight / 9)}
                  stroke="rgba(150, 150, 255, 0.5)"
                  strokeWidth={1}
                />
              ))}
              <text
                x={panelCenterX + layerWidth / 2 + 15}
                y={polarizer1Y + layerHeight / 2 + 5}
                fill="#8888cc"
                fontSize={13}
                fontFamily="Arial"
              >
                Polarizer (Horizontal ↔)
              </text>
              <PolarizationArrow
                x={panelCenterX - layerWidth / 2 - 45}
                y={polarizer1Y + layerHeight / 2}
                angle={0}
                color="#8888ff"
                size={18}
              />
            </g>

            {/* Liquid Crystal Layer */}
            <g opacity={interpolate(phase1, [0.2, 0.5], [0, 1], { extrapolateRight: "clamp" })}>
              <rect
                x={panelCenterX - layerWidth / 2}
                y={lcTopY}
                width={layerWidth}
                height={lcBottomY - lcTopY + layerHeight}
                rx={8}
                fill="rgba(50, 80, 120, 0.15)"
                stroke="rgba(100, 150, 200, 0.3)"
                strokeWidth={1}
                strokeDasharray="5,5"
              />
              <text
                x={panelCenterX + layerWidth / 2 + 15}
                y={(lcTopY + lcBottomY) / 2 + 20}
                fill="#66aaff"
                fontSize={13}
                fontFamily="Arial"
              >
                Liquid Crystal Layer
              </text>
              <text
                x={panelCenterX + layerWidth / 2 + 15}
                y={(lcTopY + lcBottomY) / 2 + 38}
                fill="#5588cc"
                fontSize={11}
                fontFamily="Arial"
              >
                {voltageApplied ? "(Voltage ON — Aligned)" : "(No Voltage — 90° Twist)"}
              </text>
            </g>

            {/* Molecules */}
            {Array.from({ length: molRows }).map((_, row) =>
              Array.from({ length: molCols }).map((_, col) => {
                const mx =
                  panelCenterX -
                  layerWidth / 2 +
                  30 +
                  col * ((layerWidth - 60) / (molCols - 1));
                const my =
                  lcTopY +
                  30 +
                  row * ((lcBottomY - lcTopY + layerHeight - 60) / (molRows - 1));

                // TN twist: top molecules horizontal, bottom vertical
                const rowFraction = row / (molRows - 1);
                const baseAngle = rowFraction * twistAmount;

                const tiltAngle = voltageApplied
                  ? interpolate(frame, [140, 180], [0, 70], {
                      extrapolateRight: "clamp",
                    })
                  : 0;

                return (
                  <g key={`${row}-${col}`}>
                    <ellipse
                      cx={mx}
                      cy={my}
                      rx={18}
                      ry={5 + Math.cos((baseAngle * Math.PI) / 180) * 3}
                      fill={`rgba(100, 170, 255, ${0.6 + rowFraction * 0.3})`}
                      stroke="rgba(130, 190, 255, 0.8)"
                      strokeWidth={0.8}
                      transform={`rotate(${baseAngle}, ${mx}, ${my})`}
                    />
                    {/* Direction indicator */}
                    <line
                      x1={mx - 14 * Math.cos((baseAngle * Math.PI) / 180)}
                      y1={my - 14 * Math.sin((baseAngle * Math.PI) / 180)}
                      x2={mx + 14 * Math.cos((baseAngle * Math.PI) / 180)}
                      y2={my + 14 * Math.sin((baseAngle * Math.PI) / 180)}
                      stroke="rgba(200, 230, 255, 0.6)"
                      strokeWidth={1}
                    />
                  </g>
                );
              })
            )}

            {/* Second Polarizer (Vertical) */}
            <g opacity={interpolate(phase1, [0.3, 0.6], [0, 1], { extrapolateRight: "clamp" })}>
              <rect
                x={panelCenterX - layerWidth / 2}
                y={polarizer2Y}
                width={layerWidth}
                height={layerHeight}
                rx={6}
                fill="rgba(100, 200, 100, 0.3)"
                stroke="rgba(100, 200, 100, 0.5)"
                strokeWidth={1}
              />
              {/* Vertical lines pattern */}
              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={i}
                  x1={panelCenterX - layerWidth / 2 + 10 + i * ((layerWidth - 20) / 11)}
                  y1={polarizer2Y + 4}
                  x2={panelCenterX - layerWidth / 2 + 10 + i * ((layerWidth - 20) / 11)}
                  y2={polarizer2Y + layerHeight - 4}
                  stroke="rgba(100, 200, 100, 0.5)"
                  strokeWidth={1}
                />
              ))}
              <text
                x={panelCenterX + layerWidth / 2 + 15}
                y={polarizer2Y + layerHeight / 2 + 5}
                fill="#88cc88"
                fontSize={13}
                fontFamily="Arial"
              >
                Polarizer (Vertical ↕)
              </text>
              <PolarizationArrow
                x={panelCenterX - layerWidth / 2 - 45}
                y={polarizer2Y + layerHeight / 2}
                angle={90}
                color="#88ff88"
                size={18}
              />
            </g>

            {/* Color Filter */}
            <g opacity={interpolate(phase1, [0.4, 0.7], [0, 1], { extrapolateRight: "clamp" })}>
              <rect
                x={panelCenterX - layerWidth / 2}
                y={colorFilterY}
                width={layerWidth}
                height={layerHeight}
                rx={6}
                fill="rgba(0,0,0,0.2)"
                stroke="rgba(200,200,200,0.3)"
                strokeWidth={1}
              />
              {/* RGB sub-pixels */}
              {Array.from({ length: 9 }).map((_, i) => {
                const colors = ["#ff4444", "#44ff44", "#4444ff"];
                const subW = (layerWidth - 20) / 9;
                return (
                  <rect
                    key={i}
                    x={panelCenterX - layerWidth / 2 + 10 + i * subW}
                    y={colorFilterY + 5}
                    width={subW - 2}
                    height={layerHeight - 10}
                    rx={2}
                    fill={colors[i % 3]}
                    opacity={0.5}
                  />
                );
              })}
              <text
                x={panelCenterX + layerWidth / 2 + 15}
                y={colorFilterY + layerHeight / 2 + 5}
                fill="#ccaaaa"
                fontSize={13}
                fontFamily="Arial"
              >
                Color Filter (RGB)
              </text>
            </g>

            {/* Light Rays */}
            {phase2 > 0 && (
              <g>
                {/* Light through the panel */}
                {[panelCenterX - 60, panelCenterX, panelCenterX + 60].map(
                  (rx, i) => {
                    const lightBlocked = voltageApplied;
                    const rayColor = lightBlocked ? "#ff4444" : "#ffdd44";
                    const endYPos = lightBlocked
                      ? polarizer2Y
                      : colorFilterY + layerHeight + 20;

                    return (
                      <g key={i}>
                        {/* Incoming light */}
                        <LightRay
                          x={rx}
                          startY={backlightY - 10}
                          endY={endYPos}
                          color={rayColor}
                          progress={lightProgress}
                          waveAmplitude={8}
                          polarizationAngle={0}
                          blocked={lightBlocked}
                        />
                      </g>
                    );
                  }
                )}
              </g>
            )}

            {/* Voltage indicator */}
            <g opacity={voltageIndicatorOpacity}>
              <rect
                x={panelCenterX - layerWidth / 2 - 80}
                y={lcTopY + 30}
                width={50}
                height={lcBottomY - lcTopY - 20}
                rx={6}
                fill="none"
                stroke="#ff6b6b"
                strokeWidth={2}
              />
              <text
                x={panelCenterX - layerWidth / 2 - 55}
                y={lcTopY + 20}
                textAnchor="middle"
                fill="#ff6b6b"
                fontSize={12}
                fontFamily="Arial"
              >
                V+
              </text>
              <text
                x={panelCenterX - layerWidth / 2 - 55}
                y={lcBottomY + layerHeight + 5}
                textAnchor="middle"
                fill="#ff6b6b"
                fontSize={12}
                fontFamily="Arial"
              >
                V-
              </text>
              {/* Electric field arrows */}
              {Array.from({ length: 4 }).map((_, i) => {
                const ay = lcTopY + 50 + i * 40;
                return (
                  <line
                    key={i}
                    x1={panelCenterX - layerWidth / 2 - 65}
                    y1={ay}
                    x2={panelCenterX - layerWidth / 2 - 65}
                    y2={ay + 20}
                    stroke="#ff6b6b"
                    strokeWidth={2}
                    markerEnd="url(#arrowhead)"
                    opacity={0.6}
                  />
                );
              })}
            </g>

            {/* State labels */}
            <g>
              {!voltageApplied && phase2 > 0.5 && (
                <g opacity={phase2}>
                  <rect
                    x={panelCenterX - 100}
                    y={colorFilterY + layerHeight + 20}
                    width={200}
                    height={35}
                    rx={8}
                    fill="rgba(50, 200, 50, 0.2)"
                    stroke="rgba(50, 200, 50, 0.5)"
                    strokeWidth={1}
                  />
                  <text
                    x={panelCenterX}
                    y={colorFilterY + layerHeight + 43}
                    textAnchor="middle"
                    fill="#66ff66"
                    fontSize={16}
                    fontFamily="Arial"
                    fontWeight="bold"
                  >
                    ✓ Light Passes Through
                  </text>
                </g>
              )}
              {voltageApplied && phase3 > 0.5 && (
                <g opacity={phase3}>
                  <rect
                    x={panelCenterX - 100}
                    y={polarizer2Y + layerHeight + 15}
                    width={200}
                    height={35}
                    rx={8}
                    fill="rgba(255, 50, 50, 0.2)"
                    stroke="rgba(255, 50, 50, 0.5)"
                    strokeWidth={1}
                  />
                  <text
                    x={panelCenterX}
                    y={polarizer2Y + layerHeight + 38}
                    textAnchor="middle"
                    fill="#ff6666"
                    fontSize={16}
                    fontFamily="Arial"
                    fontWeight="bold"
                  >
                    ✗ Light Blocked
                  </text>
                </g>
              )}
            </g>
          </g>
        </svg>
      </div>

      {/* Explanation text */}
      <ExplanationBox
        x={1100}
        y={180}
        width={420}
        color="#ddbbbb"
        texts={[
          {
            text: "In TN panels, liquid crystal molecules are arranged in a 90° twist between two polarizers.",
            startFrame: 20,
          },
          {
            text: "Without voltage, the twisted crystals rotate the light's polarization by 90°, allowing it to pass through the second polarizer.",
            startFrame: 60,
          },
          {
            text: "When voltage is applied, molecules align vertically — the twist is lost, and light is blocked by the crossed polarizer.",
            startFrame: 140,
          },
          {
            text: "⚡ TN panels offer the fastest response times (~1ms), but suffer from poor viewing angles and color shifting.",
            startFrame: 180,
          },
        ]}
      />

      {/* Viewing angle diagram */}
      <div style={{ position: "absolute", right: 100, bottom: 80 }}>
        <svg width={250} height={180}>
          <ViewingAngleDiagram
            x={125}
            y={130}
            angleRange={170}
            color="#ff6b6b"
            label="TN"
            progress={interpolate(frame, [190, 220], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
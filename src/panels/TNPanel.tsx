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
import { LightRay } from "../components/LightRay";
import { PolarizationArrow } from "../components/PolarizationArrow";
import { ViewingAngleDiagram } from "../components/ViewingAngleDiagram";

export const TNPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phase1 = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: "clamp",
  });
  const phase2 = interpolate(frame, [60, 120], [0, 1], {
    extrapolateRight: "clamp",
  });
  const phase3 = interpolate(frame, [140, 200], [0, 1], {
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(frame, [220, 240], [1, 0], {
    extrapolateLeft: "clamp",
  });

  const voltageApplied = frame > 140;
  const twistAmount = voltageApplied
    ? interpolate(frame, [140, 180], [90, 0], { extrapolateRight: "clamp" })
    : 90;

  // --- Layout: animation centered in left half ---
  const panelCenterX = 300;
  const panelTopY = 60;
  const panelBottomY = 580;
  const layerSpacing = (panelBottomY - panelTopY) / 6;

  const backlightY = panelTopY;
  const polarizer1Y = panelTopY + layerSpacing;
  const lcTopY = panelTopY + layerSpacing * 2;
  const lcBottomY = panelTopY + layerSpacing * 4;
  const polarizer2Y = panelTopY + layerSpacing * 5;
  const colorFilterY = panelBottomY;

  const layerWidth = 220;
  const layerHeight = 34;

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

      {/* LEFT SIDE: Animation */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 120,
          width: 700,
          height: 680,
        }}
      >
        <svg width={700} height={680} viewBox="0 0 700 680">
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

          <g transform="translate(30, 10)">
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
                x={panelCenterX + layerWidth / 2 + 12}
                y={backlightY + layerHeight / 2 + 4}
                fill="#ccccaa"
                fontSize={11}
                fontFamily="Arial"
              >
                Backlight (White LED)
              </text>
              <circle
                cx={panelCenterX}
                cy={backlightY + layerHeight / 2}
                r={7}
                fill="#ffee00"
                opacity={0.6 + Math.sin(frame * 0.1) * 0.2}
              />
            </g>

            {/* First Polarizer */}
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
              {Array.from({ length: 7 }).map((_, i) => (
                <line
                  key={i}
                  x1={panelCenterX - layerWidth / 2 + 8}
                  y1={polarizer1Y + 5 + i * (layerHeight / 8)}
                  x2={panelCenterX + layerWidth / 2 - 8}
                  y2={polarizer1Y + 5 + i * (layerHeight / 8)}
                  stroke="rgba(150, 150, 255, 0.5)"
                  strokeWidth={1}
                />
              ))}
              <text
                x={panelCenterX + layerWidth / 2 + 12}
                y={polarizer1Y + layerHeight / 2 + 4}
                fill="#8888cc"
                fontSize={11}
                fontFamily="Arial"
              >
                Polarizer (Horizontal ↔)
              </text>
              <PolarizationArrow
                x={panelCenterX - layerWidth / 2 - 35}
                y={polarizer1Y + layerHeight / 2}
                angle={0}
                color="#8888ff"
                size={15}
              />
            </g>

            {/* LC Layer */}
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
                x={panelCenterX + layerWidth / 2 + 12}
                y={(lcTopY + lcBottomY) / 2 + 15}
                fill="#66aaff"
                fontSize={11}
                fontFamily="Arial"
              >
                Liquid Crystal Layer
              </text>
              <text
                x={panelCenterX + layerWidth / 2 + 12}
                y={(lcTopY + lcBottomY) / 2 + 30}
                fill="#5588cc"
                fontSize={10}
                fontFamily="Arial"
              >
                {voltageApplied ? "(Voltage ON)" : "(No Voltage — 90° Twist)"}
              </text>
            </g>

            {/* Molecules */}
            {Array.from({ length: molRows }).map((_, row) =>
              Array.from({ length: molCols }).map((_, col) => {
                const mx =
                  panelCenterX -
                  layerWidth / 2 +
                  25 +
                  col * ((layerWidth - 50) / (molCols - 1));
                const my =
                  lcTopY +
                  25 +
                  row * ((lcBottomY - lcTopY + layerHeight - 50) / (molRows - 1));

                const rowFraction = row / (molRows - 1);
                const baseAngle = rowFraction * twistAmount;

                return (
                  <g key={`${row}-${col}`}>
                    <ellipse
                      cx={mx}
                      cy={my}
                      rx={15}
                      ry={4 + Math.cos((baseAngle * Math.PI) / 180) * 2}
                      fill={`rgba(100, 170, 255, ${0.6 + rowFraction * 0.3})`}
                      stroke="rgba(130, 190, 255, 0.8)"
                      strokeWidth={0.8}
                      transform={`rotate(${baseAngle}, ${mx}, ${my})`}
                    />
                    <line
                      x1={mx - 11 * Math.cos((baseAngle * Math.PI) / 180)}
                      y1={my - 11 * Math.sin((baseAngle * Math.PI) / 180)}
                      x2={mx + 11 * Math.cos((baseAngle * Math.PI) / 180)}
                      y2={my + 11 * Math.sin((baseAngle * Math.PI) / 180)}
                      stroke="rgba(200, 230, 255, 0.6)"
                      strokeWidth={1}
                    />
                  </g>
                );
              })
            )}

            {/* Second Polarizer */}
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
              {Array.from({ length: 10 }).map((_, i) => (
                <line
                  key={i}
                  x1={panelCenterX - layerWidth / 2 + 8 + i * ((layerWidth - 16) / 9)}
                  y1={polarizer2Y + 4}
                  x2={panelCenterX - layerWidth / 2 + 8 + i * ((layerWidth - 16) / 9)}
                  y2={polarizer2Y + layerHeight - 4}
                  stroke="rgba(100, 200, 100, 0.5)"
                  strokeWidth={1}
                />
              ))}
              <text
                x={panelCenterX + layerWidth / 2 + 12}
                y={polarizer2Y + layerHeight / 2 + 4}
                fill="#88cc88"
                fontSize={11}
                fontFamily="Arial"
              >
                Polarizer (Vertical ↕)
              </text>
              <PolarizationArrow
                x={panelCenterX - layerWidth / 2 - 35}
                y={polarizer2Y + layerHeight / 2}
                angle={90}
                color="#88ff88"
                size={15}
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
              {Array.from({ length: 9 }).map((_, i) => {
                const colors = ["#ff4444", "#44ff44", "#4444ff"];
                const subW = (layerWidth - 16) / 9;
                return (
                  <rect
                    key={i}
                    x={panelCenterX - layerWidth / 2 + 8 + i * subW}
                    y={colorFilterY + 4}
                    width={subW - 2}
                    height={layerHeight - 8}
                    rx={2}
                    fill={colors[i % 3]}
                    opacity={0.5}
                  />
                );
              })}
              <text
                x={panelCenterX + layerWidth / 2 + 12}
                y={colorFilterY + layerHeight / 2 + 4}
                fill="#ccaaaa"
                fontSize={11}
                fontFamily="Arial"
              >
                Color Filter (RGB)
              </text>
            </g>

            {/* Light Rays */}
            {phase2 > 0 && (
              <g>
                {[panelCenterX - 50, panelCenterX, panelCenterX + 50].map(
                  (rx, i) => {
                    const lightBlocked = voltageApplied;
                    const rayColor = lightBlocked ? "#ff4444" : "#ffdd44";
                    const endYPos = lightBlocked
                      ? polarizer2Y
                      : colorFilterY + layerHeight + 15;

                    return (
                      <LightRay
                        key={i}
                        x={rx}
                        startY={backlightY - 10}
                        endY={endYPos}
                        color={rayColor}
                        progress={lightProgress}
                        waveAmplitude={6}
                        polarizationAngle={0}
                        blocked={lightBlocked}
                      />
                    );
                  }
                )}
              </g>
            )}

            {/* Voltage indicator */}
            <g opacity={voltageIndicatorOpacity}>
              <rect
                x={panelCenterX - layerWidth / 2 - 65}
                y={lcTopY + 20}
                width={40}
                height={lcBottomY - lcTopY - 10}
                rx={6}
                fill="none"
                stroke="#ff6b6b"
                strokeWidth={2}
              />
              <text
                x={panelCenterX - layerWidth / 2 - 45}
                y={lcTopY + 12}
                textAnchor="middle"
                fill="#ff6b6b"
                fontSize={11}
                fontFamily="Arial"
              >
                V+
              </text>
              <text
                x={panelCenterX - layerWidth / 2 - 45}
                y={lcBottomY + layerHeight + 2}
                textAnchor="middle"
                fill="#ff6b6b"
                fontSize={11}
                fontFamily="Arial"
              >
                V−
              </text>
              {Array.from({ length: 4 }).map((_, i) => {
                const ay = lcTopY + 40 + i * 35;
                return (
                  <line
                    key={i}
                    x1={panelCenterX - layerWidth / 2 - 55}
                    y1={ay}
                    x2={panelCenterX - layerWidth / 2 - 55}
                    y2={ay + 15}
                    stroke="#ff6b6b"
                    strokeWidth={2}
                    markerEnd="url(#arrowhead)"
                    opacity={0.6}
                  />
                );
              })}
            </g>

            {/* State labels */}
            {!voltageApplied && phase2 > 0.5 && (
              <g opacity={phase2}>
                <rect
                  x={panelCenterX - 90}
                  y={colorFilterY + layerHeight + 12}
                  width={180}
                  height={30}
                  rx={8}
                  fill="rgba(50, 200, 50, 0.2)"
                  stroke="rgba(50, 200, 50, 0.5)"
                  strokeWidth={1}
                />
                <text
                  x={panelCenterX}
                  y={colorFilterY + layerHeight + 32}
                  textAnchor="middle"
                  fill="#66ff66"
                  fontSize={14}
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
                  x={panelCenterX - 80}
                  y={polarizer2Y + layerHeight + 12}
                  width={160}
                  height={30}
                  rx={8}
                  fill="rgba(255, 50, 50, 0.2)"
                  stroke="rgba(255, 50, 50, 0.5)"
                  strokeWidth={1}
                />
                <text
                  x={panelCenterX}
                  y={polarizer2Y + layerHeight + 32}
                  textAnchor="middle"
                  fill="#ff6666"
                  fontSize={14}
                  fontFamily="Arial"
                  fontWeight="bold"
                >
                  ✗ Light Blocked
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* RIGHT SIDE: Explanation */}
      <ExplanationBox
        x={820}
        y={160}
        width={440}
        color="#ddbbbb"
        texts={[
          {
            text: "In TN panels, liquid crystal molecules are arranged in a 90° twist between two crossed polarizers.",
            startFrame: 20,
          },
          {
            text: "Without voltage, the twisted crystals rotate light polarization by 90°, allowing it to pass through the second polarizer. The pixel appears bright.",
            startFrame: 60,
          },
          {
            text: "When voltage is applied, molecules align vertically — the twist is lost, and light is blocked by the crossed polarizer. The pixel goes dark.",
            startFrame: 140,
          },
          {
            text: "⚡ TN panels offer the fastest response times (~1ms), making them ideal for competitive gaming, but suffer from poor viewing angles and color shifting.",
            startFrame: 180,
          },
        ]}
      />

      {/* Viewing angle diagram — bottom right */}
      <div style={{ position: "absolute", right: 80, bottom: 60 }}>
        <svg width={220} height={160}>
          <ViewingAngleDiagram
            x={110}
            y={110}
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
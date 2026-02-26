// src/panels/VAPanel.tsx
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

export const VAPanel: React.FC = () => {
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
  const tiltAngle = voltageApplied
    ? interpolate(frame, [140, 185], [0, 75], { extrapolateRight: "clamp" })
    : 0;

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
        title="VA Panel"
        subtitle="Vertical Alignment — Best contrast, deep blacks"
        color="#4ecdc4"
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
              id="arrowhead-va"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#4ecdc4" />
            </marker>
            <linearGradient id="backlightGrad-va" x1="0%" y1="0%" x2="0%" y2="100%">
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
                fill="url(#backlightGrad-va)"
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
                Backlight
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
            </g>

            {/* LC Layer container */}
            <g opacity={interpolate(phase1, [0.2, 0.5], [0, 1], { extrapolateRight: "clamp" })}>
              <rect
                x={panelCenterX - layerWidth / 2}
                y={lcTopY}
                width={layerWidth}
                height={lcBottomY - lcTopY + layerHeight}
                rx={8}
                fill="rgba(50, 120, 100, 0.1)"
                stroke="rgba(78, 205, 196, 0.3)"
                strokeWidth={1}
                strokeDasharray="5,5"
              />
              <text
                x={panelCenterX + layerWidth / 2 + 12}
                y={(lcTopY + lcBottomY) / 2 + 15}
                fill="#4ecdc4"
                fontSize={11}
                fontFamily="Arial"
              >
                Liquid Crystal Layer
              </text>
              <text
                x={panelCenterX + layerWidth / 2 + 12}
                y={(lcTopY + lcBottomY) / 2 + 30}
                fill="#3da89f"
                fontSize={10}
                fontFamily="Arial"
              >
                {voltageApplied
                  ? "(Voltage ON — Tilted)"
                  : "(No Voltage — Vertical)"}
              </text>
            </g>

            {/* VA Molecules */}
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

                const baseAngle = 90 - tiltAngle;
                const perspectiveRx = 4 + Math.sin((tiltAngle * Math.PI) / 180) * 11;
                const perspectiveRy = 4;

                return (
                  <g key={`${row}-${col}`}>
                    <ellipse
                      cx={mx}
                      cy={my}
                      rx={perspectiveRx}
                      ry={perspectiveRy}
                      fill={`rgba(78, 205, 196, ${0.5 + tiltAngle / 150})`}
                      stroke="rgba(78, 205, 196, 0.8)"
                      strokeWidth={0.8}
                      transform={`rotate(${baseAngle}, ${mx}, ${my})`}
                    />
                    <line
                      x1={mx - (perspectiveRx - 2) * Math.cos((baseAngle * Math.PI) / 180)}
                      y1={my - (perspectiveRx - 2) * Math.sin((baseAngle * Math.PI) / 180)}
                      x2={mx + (perspectiveRx - 2) * Math.cos((baseAngle * Math.PI) / 180)}
                      y2={my + (perspectiveRx - 2) * Math.sin((baseAngle * Math.PI) / 180)}
                      stroke="rgba(130, 235, 225, 0.6)"
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
                    const lightBlocked = !voltageApplied;
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
                stroke="#4ecdc4"
                strokeWidth={2}
              />
              <text
                x={panelCenterX - layerWidth / 2 - 45}
                y={lcTopY + 12}
                textAnchor="middle"
                fill="#4ecdc4"
                fontSize={11}
                fontFamily="Arial"
              >
                V+
              </text>
              <text
                x={panelCenterX - layerWidth / 2 - 45}
                y={lcBottomY + layerHeight + 2}
                textAnchor="middle"
                fill="#4ecdc4"
                fontSize={11}
                fontFamily="Arial"
              >
                V−
              </text>
            </g>

            {/* State labels */}
            {!voltageApplied && phase2 > 0.5 && (
              <g opacity={phase2}>
                <rect
                  x={panelCenterX - 100}
                  y={polarizer2Y + layerHeight + 12}
                  width={200}
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
                  ✗ Light Blocked (True Black)
                </text>
              </g>
            )}
            {voltageApplied && phase3 > 0.5 && (
              <g opacity={phase3}>
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
          </g>
        </svg>
      </div>

      {/* RIGHT SIDE: Explanation */}
      <ExplanationBox
        x={820}
        y={160}
        width={440}
        color="#b5e8e3"
        texts={[
          {
            text: "VA panels have liquid crystals aligned vertically (perpendicular to the glass) when no voltage is applied.",
            startFrame: 20,
          },
          {
            text: "In this state, light passes through the first polarizer but is completely blocked by the perpendicular second polarizer — producing deep, true blacks.",
            startFrame: 60,
          },
          {
            text: "When voltage is applied, molecules tilt, rotating the light polarization and allowing it to pass through. More voltage = more light = brighter pixel.",
            startFrame: 140,
          },
          {
            text: "🌙 VA panels have the best contrast ratios (3000:1+) and deepest blacks, ideal for movies and dark-room use, but have slower response times.",
            startFrame: 185,
          },
        ]}
      />

      {/* Viewing angle diagram */}
      <div style={{ position: "absolute", right: 80, bottom: 60 }}>
        <svg width={220} height={160}>
          <ViewingAngleDiagram
            x={110}
            y={110}
            angleRange={178}
            color="#4ecdc4"
            label="VA"
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
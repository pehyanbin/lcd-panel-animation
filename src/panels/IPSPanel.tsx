// src/panels/IPSPanel.tsx
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

export const IPSPanel: React.FC = () => {
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
  const inPlaneRotation = voltageApplied
    ? interpolate(frame, [140, 185], [0, 45], { extrapolateRight: "clamp" })
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
        title="IPS Panel"
        subtitle="In-Plane Switching — Best color accuracy and viewing angles"
        color="#45b7d1"
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
              id="arrowhead-ips"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#45b7d1" />
            </marker>
            <linearGradient id="backlightGrad-ips" x1="0%" y1="0%" x2="0%" y2="100%">
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
                fill="url(#backlightGrad-ips)"
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
                fill="rgba(50, 100, 140, 0.1)"
                stroke="rgba(69, 183, 209, 0.3)"
                strokeWidth={1}
                strokeDasharray="5,5"
              />
              <text
                x={panelCenterX + layerWidth / 2 + 12}
                y={(lcTopY + lcBottomY) / 2 + 15}
                fill="#45b7d1"
                fontSize={11}
                fontFamily="Arial"
              >
                Liquid Crystal Layer
              </text>
              <text
                x={panelCenterX + layerWidth / 2 + 12}
                y={(lcTopY + lcBottomY) / 2 + 30}
                fill="#3a9ab0"
                fontSize={10}
                fontFamily="Arial"
              >
                {voltageApplied
                  ? "(Voltage ON — Rotated)"
                  : "(No Voltage — Horizontal)"}
              </text>

              {/* IPS Electrodes on same substrate */}
              <g opacity={0.6}>
                <rect
                  x={panelCenterX - layerWidth / 2 + 5}
                  y={lcBottomY + layerHeight - 7}
                  width={layerWidth / 2 - 15}
                  height={5}
                  rx={2}
                  fill={voltageApplied ? "#ff8844" : "#666"}
                  opacity={0.7}
                />
                <rect
                  x={panelCenterX + 10}
                  y={lcBottomY + layerHeight - 7}
                  width={layerWidth / 2 - 15}
                  height={5}
                  rx={2}
                  fill={voltageApplied ? "#4488ff" : "#666"}
                  opacity={0.7}
                />
                <text
                  x={panelCenterX}
                  y={lcBottomY + layerHeight + 12}
                  textAnchor="middle"
                  fill="#45b7d1"
                  fontSize={9}
                  fontFamily="Arial"
                >
                  Electrodes (Same Substrate)
                </text>
              </g>

              {/* Horizontal E-field arrows */}
              {voltageApplied && (
                <g opacity={voltageIndicatorOpacity}>
                  {Array.from({ length: 3 }).map((_, i) => {
                    const arrowY = lcTopY + 45 + i * 50;
                    return (
                      <g key={i}>
                        <line
                          x1={panelCenterX - 70}
                          y1={arrowY}
                          x2={panelCenterX + 50}
                          y2={arrowY}
                          stroke="#45b7d1"
                          strokeWidth={1.5}
                          strokeDasharray="4,3"
                          opacity={0.5}
                        />
                        <polygon
                          points={`${panelCenterX + 50},${arrowY - 3} ${panelCenterX + 58},${arrowY} ${panelCenterX + 50},${arrowY + 3}`}
                          fill="#45b7d1"
                          opacity={0.5}
                        />
                        <text
                          x={panelCenterX + 63}
                          y={arrowY + 4}
                          fill="#45b7d1"
                          fontSize={8}
                          fontFamily="Arial"
                          opacity={0.6}
                        >
                          E
                        </text>
                      </g>
                    );
                  })}
                  <text
                    x={panelCenterX - layerWidth / 2 - 50}
                    y={(lcTopY + lcBottomY) / 2 + 15}
                    fill="#45b7d1"
                    fontSize={10}
                    fontFamily="Arial"
                    textAnchor="middle"
                  >
                    Horizontal
                  </text>
                  <text
                    x={panelCenterX - layerWidth / 2 - 50}
                    y={(lcTopY + lcBottomY) / 2 + 28}
                    fill="#45b7d1"
                    fontSize={10}
                    fontFamily="Arial"
                    textAnchor="middle"
                  >
                    E-Field
                  </text>
                </g>
              )}
            </g>

            {/* IPS Molecules */}
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

                const angle = inPlaneRotation;

                return (
                  <g key={`${row}-${col}`}>
                    <ellipse
                      cx={mx}
                      cy={my}
                      rx={15}
                      ry={4}
                      fill="rgba(69, 183, 209, 0.6)"
                      stroke="rgba(100, 200, 230, 0.8)"
                      strokeWidth={0.8}
                      transform={`rotate(${angle}, ${mx}, ${my})`}
                    />
                    <line
                      x1={mx - 11 * Math.cos((angle * Math.PI) / 180)}
                      y1={my - 11 * Math.sin((angle * Math.PI) / 180)}
                      x2={mx + 11 * Math.cos((angle * Math.PI) / 180)}
                      y2={my + 11 * Math.sin((angle * Math.PI) / 180)}
                      stroke="rgba(150, 220, 240, 0.6)"
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

            {/* State labels */}
            {!voltageApplied && phase2 > 0.5 && (
              <g opacity={phase2}>
                <rect
                  x={panelCenterX - 90}
                  y={polarizer2Y + layerHeight + 12}
                  width={180}
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
                  ✗ Light Blocked (Black)
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

            {/* IPS Key callout */}
            {phase1 > 0.8 && (
              <g
                opacity={interpolate(phase1, [0.8, 1], [0, 1], {
                  extrapolateRight: "clamp",
                })}
              >
                <rect
                  x={panelCenterX - layerWidth / 2 - 5}
                  y={lcBottomY + layerHeight + 20}
                  width={layerWidth + 10}
                  height={24}
                  rx={6}
                  fill="rgba(69, 183, 209, 0.15)"
                  stroke="rgba(69, 183, 209, 0.4)"
                  strokeWidth={1}
                />
                <text
                  x={panelCenterX}
                  y={lcBottomY + layerHeight + 37}
                  textAnchor="middle"
                  fill="#45b7d1"
                  fontSize={10}
                  fontFamily="Arial"
                >
                  ↔ Molecules rotate in-plane (parallel)
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
        color="#a8dce8"
        texts={[
          {
            text: "IPS panels have molecules aligned parallel to the glass substrate. The key innovation: electrodes are on the SAME side of the glass.",
            startFrame: 20,
          },
          {
            text: "Without voltage, molecules stay aligned with the first polarizer — no rotation occurs, and the crossed second polarizer blocks all light (black state).",
            startFrame: 60,
          },
          {
            text: "When voltage is applied horizontally, molecules rotate in-plane (staying parallel to the glass), twisting light polarization to pass through the second polarizer.",
            startFrame: 140,
          },
          {
            text: "🎨 Because molecules always stay in-plane, IPS panels maintain consistent colors at wide viewing angles (178°) with the best color accuracy of all LCD types.",
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
            color="#45b7d1"
            label="IPS"
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
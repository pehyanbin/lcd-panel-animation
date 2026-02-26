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

  // IPS: molecules rotate in-plane (parallel to glass surface)
  const inPlaneRotation = voltageApplied
    ? interpolate(frame, [140, 185], [0, 45], { extrapolateRight: "clamp" })
    : 0;

  const panelCenterX = 750;
  const panelTopY = 180;
  const panelBottomY = 750;
  const layerSpacing = (panelBottomY - panelTopY) / 6;

  const backlightY = panelTopY;
  const polarizer1Y = panelTopY + layerSpacing;
  const lcTopY = panelTopY + layerSpacing * 2;
  const lcBottomY = panelTopY + layerSpacing * 4;
  const polarizer2Y = panelTopY + layerSpacing * 5;
  const colorFilterY = panelBottomY;

  const layerWidth = 280;
  const layerHeight = 40;

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
              id="arrowhead-ips"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#45b7d1" />
            </marker>
            <linearGradient
              id="backlightGrad-ips"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#ffffcc" stopOpacity={0.7} />
            </linearGradient>
          </defs>

          <g transform="translate(100, 20)">
            {/* Backlight */}
            <g
              opacity={interpolate(phase1, [0, 0.3], [0, 1], {
                extrapolateRight: "clamp",
              })}
            >
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
                x={panelCenterX + layerWidth / 2 + 15}
                y={backlightY + layerHeight / 2 + 5}
                fill="#ccccaa"
                fontSize={13}
                fontFamily="Arial"
              >
                Backlight
              </text>
              <circle
                cx={panelCenterX}
                cy={backlightY + layerHeight / 2}
                r={8}
                fill="#ffee00"
                opacity={0.6 + Math.sin(frame * 0.1) * 0.2}
              />
            </g>

            {/* First Polarizer */}
            <g
              opacity={interpolate(phase1, [0.1, 0.4], [0, 1], {
                extrapolateRight: "clamp",
              })}
            >
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
            </g>

            {/* LC Layer container */}
            <g
              opacity={interpolate(phase1, [0.2, 0.5], [0, 1], {
                extrapolateRight: "clamp",
              })}
            >
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
                x={panelCenterX + layerWidth / 2 + 15}
                y={(lcTopY + lcBottomY) / 2 + 20}
                fill="#45b7d1"
                fontSize={13}
                fontFamily="Arial"
              >
                Liquid Crystal Layer
              </text>
              <text
                x={panelCenterX + layerWidth / 2 + 15}
                y={(lcTopY + lcBottomY) / 2 + 38}
                fill="#3a9ab0"
                fontSize={11}
                fontFamily="Arial"
              >
                {voltageApplied
                  ? "(Voltage ON — Rotated In-Plane)"
                  : "(No Voltage — Aligned Horizontally)"}
              </text>

              {/* IPS Electrode indicators - horizontal electrodes on SAME substrate */}
              <g opacity={0.6}>
                {/* Left electrode */}
                <rect
                  x={panelCenterX - layerWidth / 2 + 5}
                  y={lcBottomY + layerHeight - 8}
                  width={layerWidth / 2 - 15}
                  height={6}
                  rx={2}
                  fill={voltageApplied ? "#ff8844" : "#666"}
                  opacity={0.7}
                />
                {/* Right electrode */}
                <rect
                  x={panelCenterX + 10}
                  y={lcBottomY + layerHeight - 8}
                  width={layerWidth / 2 - 15}
                  height={6}
                  rx={2}
                  fill={voltageApplied ? "#4488ff" : "#666"}
                  opacity={0.7}
                />
                <text
                  x={panelCenterX}
                  y={lcBottomY + layerHeight + 15}
                  textAnchor="middle"
                  fill="#45b7d1"
                  fontSize={10}
                  fontFamily="Arial"
                >
                  Electrodes (Same Substrate)
                </text>
              </g>

              {/* Horizontal electric field arrows when voltage applied */}
              {voltageApplied && (
                <g opacity={voltageIndicatorOpacity}>
                  {Array.from({ length: 3 }).map((_, i) => {
                    const arrowY = lcTopY + 50 + i * 55;
                    return (
                      <g key={i}>
                        <line
                          x1={panelCenterX - 80}
                          y1={arrowY}
                          x2={panelCenterX + 60}
                          y2={arrowY}
                          stroke="#45b7d1"
                          strokeWidth={1.5}
                          strokeDasharray="4,3"
                          opacity={0.5}
                        />
                        <polygon
                          points={`${panelCenterX + 60},${arrowY - 4} ${panelCenterX + 70},${arrowY} ${panelCenterX + 60},${arrowY + 4}`}
                          fill="#45b7d1"
                          opacity={0.5}
                        />
                        <text
                          x={panelCenterX + 75}
                          y={arrowY + 4}
                          fill="#45b7d1"
                          fontSize={9}
                          fontFamily="Arial"
                          opacity={0.6}
                        >
                          E
                        </text>
                      </g>
                    );
                  })}
                  <text
                    x={panelCenterX - layerWidth / 2 - 60}
                    y={(lcTopY + lcBottomY) / 2 + 20}
                    fill="#45b7d1"
                    fontSize={11}
                    fontFamily="Arial"
                    textAnchor="middle"
                  >
                    Horizontal
                  </text>
                  <text
                    x={panelCenterX - layerWidth / 2 - 60}
                    y={(lcTopY + lcBottomY) / 2 + 35}
                    fill="#45b7d1"
                    fontSize={11}
                    fontFamily="Arial"
                    textAnchor="middle"
                  >
                    E-Field
                  </text>
                </g>
              )}
            </g>

            {/* IPS Molecules - all flat/in-plane, rotate horizontally */}
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
                  row *
                    ((lcBottomY - lcTopY + layerHeight - 60) / (molRows - 1));

                // IPS: all molecules are flat (in-plane), rotate from 0° to 45°
                const angle = inPlaneRotation;

                return (
                  <g key={`${row}-${col}`}>
                    <ellipse
                      cx={mx}
                      cy={my}
                      rx={18}
                      ry={5}
                      fill={`rgba(69, 183, 209, 0.6)`}
                      stroke="rgba(100, 200, 230, 0.8)"
                      strokeWidth={0.8}
                      transform={`rotate(${angle}, ${mx}, ${my})`}
                    />
                    <line
                      x1={mx - 14 * Math.cos((angle * Math.PI) / 180)}
                      y1={my - 14 * Math.sin((angle * Math.PI) / 180)}
                      x2={mx + 14 * Math.cos((angle * Math.PI) / 180)}
                      y2={my + 14 * Math.sin((angle * Math.PI) / 180)}
                      stroke="rgba(150, 220, 240, 0.6)"
                      strokeWidth={1}
                    />
                  </g>
                );
              })
            )}

            {/* Second Polarizer (Vertical) */}
            <g
              opacity={interpolate(phase1, [0.3, 0.6], [0, 1], {
                extrapolateRight: "clamp",
              })}
            >
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
              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={i}
                  x1={
                    panelCenterX -
                    layerWidth / 2 +
                    10 +
                    i * ((layerWidth - 20) / 11)
                  }
                  y1={polarizer2Y + 4}
                  x2={
                    panelCenterX -
                    layerWidth / 2 +
                    10 +
                    i * ((layerWidth - 20) / 11)
                  }
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
            </g>

            {/* Color Filter */}
            <g
              opacity={interpolate(phase1, [0.4, 0.7], [0, 1], {
                extrapolateRight: "clamp",
              })}
            >
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
                {[panelCenterX - 60, panelCenterX, panelCenterX + 60].map(
                  (rx, i) => {
                    // IPS: blocks when aligned with polarizer (no rotation), passes when rotated
                    const lightBlocked = !voltageApplied;
                    const rayColor = lightBlocked ? "#ff4444" : "#ffdd44";
                    const endYPos = lightBlocked
                      ? polarizer2Y
                      : colorFilterY + layerHeight + 20;

                    return (
                      <LightRay
                        key={i}
                        x={rx}
                        startY={backlightY - 10}
                        endY={endYPos}
                        color={rayColor}
                        progress={lightProgress}
                        waveAmplitude={8}
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
                  ✗ Light Blocked (Black)
                </text>
              </g>
            )}
            {voltageApplied && phase3 > 0.5 && (
              <g opacity={phase3}>
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

            {/* IPS Key Difference callout */}
            {phase1 > 0.8 && (
              <g
                opacity={interpolate(phase1, [0.8, 1], [0, 1], {
                  extrapolateRight: "clamp",
                })}
              >
                <rect
                  x={panelCenterX - layerWidth / 2 - 10}
                  y={lcBottomY + layerHeight + 25}
                  width={layerWidth + 20}
                  height={30}
                  rx={6}
                  fill="rgba(69, 183, 209, 0.15)"
                  stroke="rgba(69, 183, 209, 0.4)"
                  strokeWidth={1}
                />
                <text
                  x={panelCenterX}
                  y={lcBottomY + layerHeight + 45}
                  textAnchor="middle"
                  fill="#45b7d1"
                  fontSize={12}
                  fontFamily="Arial"
                >
                  ↔ Molecules rotate in-plane (parallel to surface)
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>

      <ExplanationBox
        x={1100}
        y={180}
        width={420}
        color="#a8dce8"
        texts={[
          {
            text: "IPS panels have molecules aligned parallel to the glass substrate. The key innovation: electrodes are on the SAME side.",
            startFrame: 20,
          },
          {
            text: "Without voltage, molecules stay aligned with the first polarizer — no rotation occurs, and the crossed second polarizer blocks all light.",
            startFrame: 60,
          },
          {
            text: "When voltage is applied horizontally across the electrodes, molecules rotate in-plane (staying parallel to the glass), twisting the light polarization to pass through.",
            startFrame: 140,
          },
          {
            text: "🎨 Because molecules always stay in-plane, IPS panels maintain consistent colors at wide viewing angles (178°) with excellent color accuracy.",
            startFrame: 185,
          },
        ]}
      />

      <div style={{ position: "absolute", right: 100, bottom: 80 }}>
        <svg width={250} height={180}>
          <ViewingAngleDiagram
            x={125}
            y={130}
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
// src/LCDPanelAnimation.tsx
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Sequence,
} from "remotion";
import { TNPanel } from "./panels/TNPanel";
import { VAPanel } from "./panels/VAPanel";
import { IPSPanel } from "./panels/IPSPanel";
import { IntroSection } from "./sections/IntroSection";
import { ComparisonSection } from "./sections/ComparisonSection";

export const LCDPanelAnimation: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a1a" }}>
      <Sequence from={0} durationInFrames={90}>
        <IntroSection />
      </Sequence>
      <Sequence from={90} durationInFrames={240}>
        <TNPanel />
      </Sequence>
      <Sequence from={330} durationInFrames={240}>
        <VAPanel />
      </Sequence>
      <Sequence from={570} durationInFrames={240}>
        <IPSPanel />
      </Sequence>
      <Sequence from={810} durationInFrames={90}>
        <ComparisonSection />
      </Sequence>
    </AbsoluteFill>
  );
};
// src/Root.tsx
import { Composition } from "remotion";
import { LCDPanelAnimation } from "./LCDPanelAnimation";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LCDPanelAnimation"
        component={LCDPanelAnimation}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
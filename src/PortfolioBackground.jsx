import React, { lazy, Suspense } from "react";
import "./PortfolioBackground.css";

const LightPillar = lazy(() => import("./LightPillar"));

export default function PortfolioBackground() {
  return (
    <div className="portfolio-background" aria-hidden="true">
      <Suspense fallback={<div className="light-pillar-fallback" />}>
        <LightPillar
          topColor="#e1dbff"
          bottomColor="#fff9d3"
          intensity={1}
          rotationSpeed={0.5}
          glowAmount={0.005}
          pillarWidth={8.5}
          pillarHeight={0.3}
          noiseIntensity={0.3}
          pillarRotation={43}
          interactive={false}
          mixBlendMode="normal"
          lightMode
          lightContrast={2.3}
          quality="high"
        />
      </Suspense>
    </div>
  );
}

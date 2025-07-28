"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";
import DeformableGrid from "@/components/DeformableGrid";
import LightRay from "@/components/LightRay";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ActivePlanet {
  mass: number;
}

interface SceneProps {
  activePlanet: ActivePlanet | null;
  showRays: boolean;
}

export default function Scene({ activePlanet, showRays }: SceneProps) {
  const isMobile = useIsMobile(); 

  const qualitySettings = {
    gridSegments: isMobile ? 40 : 100, // Fewer segments on mobile
    starCount: isMobile ? 2000 : 10000, // Fewer stars on mobile
    sphereSegments: isMobile ? 16 : 32, // Lower detail for the planet
  };

  const { yPos, effectiveMass, scale } = useSpring({
    yPos: activePlanet ? -activePlanet.mass + (0.5 + activePlanet.mass * 0.05) : 15,
    scale: activePlanet ? 0.5 + activePlanet.mass * 0.05 : 0,
    effectiveMass: activePlanet ? activePlanet.mass : 0,
    config: { mass: 2, tension: 180, friction: 25 },
  });

  return (
    <Canvas camera={{ position: [0, 10, 15], fov: 60 }}>
      <color attach="background" args={["#000011"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 15, 10]} intensity={1.5} />
      <Stars radius={300} depth={80} count={qualitySettings.starCount} factor={7} saturation={0} />

      <DeformableGrid
        planetData={{ mass: effectiveMass }}
        segments={qualitySettings.gridSegments}
      />

      {showRays && (
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <LightRay xPosition={-3} />
          <LightRay xPosition={-2.25} />
          <LightRay xPosition={-1.5} />
          <LightRay xPosition={1.5} />
          <LightRay xPosition={2.25} />
          <LightRay xPosition={3} />
        </group>
      )}

      {/* ✅ FIX: Change the condition here to use 'activePlanet' state */}
      {activePlanet && (
        <a.mesh position-y={yPos} scale={scale}>
          <sphereGeometry args={[1, qualitySettings.sphereSegments, qualitySettings.sphereSegments]} />
          <meshStandardMaterial
            color="#ff8800"
            emissive="#ff8800"
            emissiveIntensity={0.7}
          />
        </a.mesh>
      )}

      <OrbitControls enableDamping dampingFactor={0.05} />
    </Canvas>
  );
}
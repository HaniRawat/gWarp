// components/Scene.tsx
"use client";

import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";
import DeformableGrid from "@/components/DeformableGrid";
import LightRay from "@/components/LightRay"; // Import the new component

interface ActivePlanet {
  mass: number;
}

interface SceneProps {
  activePlanet: ActivePlanet | null;
  showRays: boolean; // Add the new prop
}

export default function Scene({ activePlanet, showRays }: SceneProps) {
  const [{ yPos, effectiveMass, scale }, api] = useSpring(() => ({
    yPos: 15,
    effectiveMass: 0,
    scale: 0,
    config: { mass: 2, tension: 200, friction: 25 },
  }));

  useEffect(() => {
    if (activePlanet) {
      const targetMass = activePlanet.mass;
      const targetScale = 0.5 + targetMass * 0.05;
      const finalYPos = -targetMass + targetScale;
      api.start({
        yPos: finalYPos,
        scale: targetScale,
        effectiveMass: targetMass,
        config: { tension: 180, friction: 12 },
      });
    } else {
      api.start({
        effectiveMass: 0,
        yPos: 15,
        scale: 0,
        config: { tension: 250 },
      });
    }
  }, [activePlanet, api]);

  return (
    <Canvas camera={{ position: [0, 10, 15], fov: 60 }}>
      <color attach="background" args={["#000011"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 15, 10]} intensity={1.5} />
      <Stars radius={300} depth={80} count={10000} factor={7} saturation={0} />

      <DeformableGrid planetData={{ mass: effectiveMass }} />

      {/* Conditionally render the light rays in a rotated group */}
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

      {activePlanet && (
        <a.mesh position-y={yPos} scale={scale}>
          <sphereGeometry args={[1, 32, 32]} />
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
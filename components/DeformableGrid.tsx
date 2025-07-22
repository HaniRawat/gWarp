// components/DeformableGrid.tsx
'use client'

import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SpringValue } from '@react-spring/three';

interface ActivePlanet {
  mass: SpringValue<number>;
}

interface DeformableGridProps {
  planetData: ActivePlanet;
}

const DeformableGrid: React.FC<DeformableGridProps> = ({ planetData }) => {
  const { geometry, originalPositions } = useMemo(() => {
    const geom = new THREE.PlaneGeometry(20, 20, 100, 100);
    const origPos = geom.attributes.position.clone();
    return { geometry: geom, originalPositions: origPos };
  }, []);

  useFrame(({ scene }) => {
    const massValue = planetData.mass.get();
    const bendingFactor = 2.0;
    const effectiveBendingMass = massValue * bendingFactor;

    // Deform the grid
    const positions = geometry.attributes.position as THREE.BufferAttribute;
    const original = originalPositions.array as Float32Array;
    const current = positions.array as Float32Array;
    if (massValue > 0.01) {
      for (let i = 0; i < current.length; i += 3) {
        const x = original[i];
        const y = original[i + 1];
        const distance = Math.sqrt(x * x + y * y);
        const deformation = -effectiveBendingMass * Math.exp(-0.4 * distance * distance);
        current[i + 2] = original[i + 2] + deformation;
      }
    } else {
      if (current[2] !== original[2]) {
        current.set(original);
      }
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();

    // ✅ FIX 1: Add a specific type to the 'object' parameter.
    scene.traverse((object: THREE.Object3D) => {
      if (object.type === 'Line') {
        const line = object as THREE.Line;
        const linePositions = line.geometry.attributes.position as THREE.BufferAttribute;
        
        // ✅ FIX 2: Read from 'userData' instead of using 'any'.
        const lineOriginalX = line.geometry.userData.originalX;

        // Ensure we don't try to bend a line that doesn't have our custom data
        if (lineOriginalX === undefined) return;

        for (let i = 0; i < linePositions.count; i++) {
          const x = lineOriginalX;
          const y = linePositions.getY(i);
          const distance = Math.sqrt(x * x + y * y);
          
          // ✅ FIX 3: Use the 'distance' variable to make the bending effect correct.
          const displacement = effectiveBendingMass * 0.5 * Math.exp(-0.2 * distance * distance);
          
          const direction = Math.sign(x);
          linePositions.setX(i, x + (direction * displacement));
          linePositions.setZ(i, 0);
        }
        linePositions.needsUpdate = true;
      }
    });
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color="#3333ff" wireframe={true} />
    </mesh>
  );
};

export default DeformableGrid;
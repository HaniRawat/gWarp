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
  // ✅ Create the geometry and a copy of its original positions ONCE.
  const { geometry, originalPositions } = useMemo(() => {
    const geom = new THREE.PlaneGeometry(20, 20, 100, 100);
    const origPos = geom.attributes.position.clone();
    return { geometry: geom, originalPositions: origPos };
  }, []);

  useFrame(() => {
    const positions = geometry.attributes.position as THREE.BufferAttribute;
    const original = originalPositions.array as Float32Array;
    const current = positions.array as Float32Array;
    
    const massValue = planetData.mass.get();

    if (massValue > 0.01) {
      for (let i = 0; i < current.length; i += 3) {
        const x = original[i];
        const y = original[i + 1];
        const distance = Math.sqrt(x * x + y * y);
        const deformation = -massValue * Math.exp(-0.2 * distance * distance);
        current[i + 2] = original[i + 2] + deformation;
      }
    } else {
      // Efficiently reset the grid if it's not already flat
      if (current[2] !== original[2]) { 
        current.set(original);
      }
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals(); // Good practice for correct lighting
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      {/* ✅ Attach the single, memoized geometry instance to the mesh */}
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color="#3333ff" wireframe={true} />
    </mesh>
  );
};

export default DeformableGrid;
// components/DeformableGrid.tsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SpringValue } from '@react-spring/three'; // 1. Import SpringValue

// Define the type for the planet data, accepting a SpringValue
interface ActivePlanet {
  mass: SpringValue<number>;
}

// Define the props for this component
interface DeformableGridProps {
  planetData: ActivePlanet; // Changed to not be nullable for simplicity
}

const DeformableGrid: React.FC<DeformableGridProps> = ({ planetData }) => {
  const geomRef = useRef<THREE.PlaneGeometry>(null!);

  const originalPositions = useMemo(() => {
    const plane = new THREE.PlaneGeometry(20, 20, 100, 100);
    return plane.attributes.position.clone();
  }, []);

  useFrame(() => {
    if (geomRef.current) {
      const positions = geomRef.current.attributes.position as THREE.BufferAttribute;
      const original = originalPositions.array as Float32Array;
      const current = positions.array as Float32Array;
      
      // 2. Get the current numerical value from the spring using .get()
      const massValue = planetData.mass.get();

      // Only deform if the mass is significant
      if (massValue > 0.01) {
        for (let i = 0; i < current.length; i += 3) {
          const x = original[i];
          const y = original[i + 1];
          const distance = Math.sqrt(x*x + y*y);

          const deformation = -massValue * Math.exp(-0.2 * distance * distance);
          
          current[i + 2] = original[i + 2] + deformation;
        }
      } else {
        // If mass is zero, reset the grid
        if (!current.every((val, i) => val === original[i])) {
            current.set(original);
        }
      }

      positions.needsUpdate = true;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry ref={geomRef} args={[20, 20, 100, 100]} />
      <meshStandardMaterial color="#3333ff" wireframe={true} />
    </mesh>
  );
};

export default DeformableGrid;
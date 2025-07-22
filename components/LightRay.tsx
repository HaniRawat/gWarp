// components/LightRay.tsx
'use client'

import React, { useMemo } from 'react'
import { a } from '@react-spring/three'
import * as THREE from 'three'

interface LightRayProps {
  xPosition: number;
}

const LightRay: React.FC<LightRayProps> = ({ xPosition }) => {
  // Create the points for the line along the local Y-axis
  const points = useMemo(() => {
    const linePoints = []
    for (let i = -20; i <= 20; i += 0.2) {
      linePoints.push(new THREE.Vector3(xPosition, i, 0))
    }
    return linePoints
  }, [xPosition])

  // Create the geometry and attach the original X position to it
  const lineGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    // Store the original X position for the bending calculation later
    (geom as any).originalX = xPosition;
    return geom;
  }, [points, xPosition]);

  return (
    <a.line>
      <primitive object={lineGeometry} attach="geometry" />
      <lineBasicMaterial attach="material" color="#ffff00" linewidth={2} />
    </a.line>
  )
}

export default LightRay
'use client'

import React, { useMemo } from 'react'
import { a } from '@react-spring/three'
import * as THREE from 'three'

interface LightRayProps {
  xPosition: number;
}

const LightRay: React.FC<LightRayProps> = ({ xPosition }) => {
  const points = useMemo(() => {
    const linePoints = []
    for (let i = -20; i <= 20; i += 0.2) {
      linePoints.push(new THREE.Vector3(xPosition, i, 0))
    }
    return linePoints
  }, [xPosition])

  const lineGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    
    geom.userData.originalX = xPosition;
    
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
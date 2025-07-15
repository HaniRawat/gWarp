'use client'
import React from 'react'
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

const page = () => {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <color attach="background" args={['#000011']} />
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <Stars radius={300} depth={80} count={10000} factor={7} saturation={0} />
          <OrbitControls enableDamping dampingFactor={0.05} />
          {/* <Scene3D objects={objects} lightRayEnabled={lightRayEnabled} /> */}
        </Canvas>
      </div>
      </div>
  )
}

export default page
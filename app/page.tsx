// app/page.tsx
'use client'
import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import AddPlanetUI from '@/components/AddPlanetUI';
import DeformableGrid from '@/components/DeformableGrid';

interface ActivePlanet {
  mass: number;
}

const Page = () => {
  const [activePlanet, setActivePlanet] = useState<ActivePlanet | null>(null);
  const [mass, setMass] = useState<string>('4');

  // REVISED: We now animate 'scale' instead of 'radius'
  const [{ yPos, effectiveMass, scale }, api] = useSpring(() => ({
    yPos: 15,          
    effectiveMass: 0,
    scale: 0, // The ball will start with a scale of 0
    config: { mass: 2, tension: 200, friction: 25 },
  }));

  const handleAddPlanet = () => {
    const targetMass = Number(mass);
    // This value is now our target scale
    const targetScale = 0.5 + targetMass * 0.05; 
    const finalYPos = -targetMass + targetScale; // Adjust yPos based on scale

    setActivePlanet({ mass: targetMass });

    api.start({
      to: [
        // Animate scale from 0 to its target size
        { yPos: finalYPos, scale: targetScale, config: { tension: 250 } },
        { effectiveMass: targetMass, config: { tension: 180, friction: 12 } },
      ],
    });
  };
  
  const handleRemovePlanet = () => {
    api.start({
      to: [
        { effectiveMass: 0, config: { tension: 250 } },
        // Animate scale back to 0 to make it disappear
        { yPos: 15, scale: 0 },
      ],
      onRest: () => {
        setActivePlanet(null);
      },
    });
  };

  return (
    <div className='w-full h-screen bg-black'>
      <div className="absolute top-5 left-5 z-10">
        <AddPlanetUI 
          mass={mass}
          setMass={setMass}
          onAddPlanet={handleAddPlanet}
          onRemovePlanet={handleRemovePlanet}
          activePlanet={activePlanet}
        />
      </div>

      <Canvas camera={{ position: [0, 10, 15], fov: 60 }}>
        <color attach="background" args={['#000011']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 15, 10]} intensity={1.5} />
        <Stars radius={300} depth={80} count={10000} factor={7} saturation={0} />
        
        <DeformableGrid planetData={{ mass: effectiveMass }} />

        {activePlanet && (
          // REVISED: Apply the animated 'scale' prop to the mesh
          <a.mesh position-y={yPos} scale={scale}> 
            {/* The geometry now has a fixed radius of 1. Its size is controlled by the mesh's scale. */}
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#ff8800" emissive="#ff8800" emissiveIntensity={0.7} />
          </a.mesh>
        )}

        <OrbitControls enableDamping dampingFactor={0.05} />
      </Canvas>
    </div>
  )
}

export default Page;
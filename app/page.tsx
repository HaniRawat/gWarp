// app/page.tsx
'use client'
import React, { useState } from 'react'
import AddPlanetUI from '@/components/AddPlanetUI'
import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false
})

interface ActivePlanet {
  mass: number
}

const Page = () => {
  const [activePlanet, setActivePlanet] = useState<ActivePlanet | null>(null)
  const [mass, setMass] = useState<string>('4')
  // Add state to track visibility of the light rays
  const [showRays, setShowRays] = useState(false);

  const handleAddPlanet = () => {
    setActivePlanet({ mass: Number(mass) })
  }

  const handleRemovePlanet = () => {
    setActivePlanet(null)
    // Also hide the rays when the planet is removed
    setShowRays(false);
  }

  // A simple function to toggle the state
  const handleToggleRays = () => {
    setShowRays(prev => !prev);
  }

  return (
    <div className='w-full h-screen bg-black'>
      <div className="absolute top-5 left-5 z-10">
        <AddPlanetUI
          mass={mass}
          setMass={setMass}
          onAddPlanet={handleAddPlanet}
          onRemovePlanet={handleRemovePlanet}
          activePlanet={activePlanet}
          // Pass the state and handler to the UI component
          showRays={showRays}
          onToggleRays={handleToggleRays}
        />
      </div>

      {/* Pass the state down to the Scene component */}
      <Scene activePlanet={activePlanet} showRays={showRays} />
    </div>
  )
}

export default Page
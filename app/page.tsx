'use client'
import React, { useState, useEffect } from 'react'
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
  const [showRays, setShowRays] = useState(false);

  useEffect(() => {
    if (activePlanet) {
      setActivePlanet({ mass: Number(mass) });
    }
  }, [mass]); 

  const handleAddPlanet = () => {
    setActivePlanet({ mass: Number(mass) })
  }

  const handleRemovePlanet = () => {
    setActivePlanet(null)
    setShowRays(false);
  }

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
          showRays={showRays}
          onToggleRays={handleToggleRays}
        />
      </div>

      <Scene activePlanet={activePlanet} showRays={showRays} />
    </div>
  )
}

export default Page
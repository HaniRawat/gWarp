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

  const handleAddPlanet = () => {
    setActivePlanet({ mass: Number(mass) })
  }
  
  const handleRemovePlanet = () => {
    setActivePlanet(null)
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
        />
      </div>

      <Scene activePlanet={activePlanet} />
    </div>
  )
}

export default Page
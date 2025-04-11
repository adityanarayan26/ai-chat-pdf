'use client'
import { HeroGeometric } from '@/components/ui/shape-landing-hero'
import React, { useEffect } from 'react'
import Header from './_components/Header'
import { renderCanvas } from "@/components/ui/canvas";

const page = () => {
  useEffect(() => {
    renderCanvas();
  }, []);
  return (
    <div className='h-screen w-full  flex items-center justify-center '>
      <Header />
      <HeroGeometric />
      <canvas
        className="bg-skin-base pointer-events-none absolute inset-0 mx-auto"
        id="canvas"
      ></canvas>
    </div>
  )
}

export default page

'use client'
import React from 'react'
import { Particles } from '@/components/ui/particles';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { CustomCursorButton } from '@/components/ui/wood-cursor';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import { ParticleButton } from '@/components/ui/particle-button';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  
  const words = [
    {
      text: "Chat ",
    },
    {
      text: "with ",
    },
    {
      text: "PDFs ",
    },
    {
      text: "powered ",
    },
    {
      text: "by ",
    },
    {
      text: "AI.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className='h-screen w-full bg-black flex items-center justify-center '>
      
<div className='flex flex-col justify-center items-center'>


        <TypewriterEffectSmooth words={words} />
       

        <div className='z-[999]' onClick={() => {
          setTimeout(() => {
            router.push('/chat');
          }, 500);
        }}>
          <ParticleButton successDuration={1000} variant="default" className="mx-auto">
            Start Chat!
          </ParticleButton>
        </div>
     
</div>
      <Particles
        className="absolute inset-0"
        quantity={200}
        ease={10}
        color='#ffffff'
        refresh
      />
      <CustomCursorButton className='hidden'/>
       <ShootingStars
        starColor="#ffffff"
        trailColor="#2EB9DF"
        minSpeed={5}
        maxSpeed={8}
        minDelay={1000}
        maxDelay={3000}
      />
       <ShootingStars
        starColor="#ffffff"
        trailColor="#2EB9DF"
        minSpeed={5}
        maxSpeed={8}
        minDelay={1000}
        maxDelay={3000}
      />
       <ShootingStars
        starColor="#ffffff"
        trailColor="#2EB9DF"
        minSpeed={5}
        maxSpeed={8}
        minDelay={1000}
        maxDelay={3000}
      />
       <ShootingStars
        starColor="#ffffff"
        trailColor="#2EB9DF"
        minSpeed={5}
        maxSpeed={8}
        minDelay={1000}
        maxDelay={3000}
      />
       <ShootingStars
        starColor="#ffffff"
        trailColor="#2EB9DF"
        minSpeed={5}
        maxSpeed={8}
        minDelay={1000}
        maxDelay={3000}
      />
       <ShootingStars
        starColor="#ffffff"
        trailColor="#2EB9DF"
        minSpeed={5}
        maxSpeed={8}
        minDelay={1000}
        maxDelay={3000}
      />
       <ShootingStars
        starColor="#ffffff"
        trailColor="#2EB9DF"
        minSpeed={5}
        maxSpeed={8}
        minDelay={1000}
        maxDelay={3000}
      />

      
    </div>
  )
}

export default Page

"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const images = [
  '/layouts/1.jpg',
  '/layouts/2.jpg',
  '/layouts/3.jpg',
  '/layouts/4.jpg',
  '/layouts/5.jpg',
  '/layouts/6.jpg',
  '/layouts/7.jpeg',
  '/layouts/8.jpg',
]

export function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="absolute inset-0 z-0">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Ultra-realistic cinematic architectural shot of a premium workspace ${index + 1}`}
          fill
          className={cn(
            'object-cover transition-opacity duration-1000 ease-in-out',
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          )}
          priority={index === 0}
          quality={90}
        />
      ))}
    </div>
  )
}

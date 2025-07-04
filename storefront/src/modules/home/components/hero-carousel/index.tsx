"use client"

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { useEffect, useState } from "react"
import Image from "next/image"

export function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <Carousel className="w-full" setApi={setApi} opts={{ loop: true }}>
      <CarouselContent className="!ml-0">
        <CarouselItem className="!pl-0 w-full">
          <div className="w-full h-[45vh] md:h-[60vh] lg:h-[75vh] xl:h-[85vh] 2xl:h-[45vh] relative">
            <Image 
              src="/banner1.png" 
              alt="banner 1" 
              fill
              sizes="100vw" 
              className="object-cover" 
            />
          </div>
        </CarouselItem>
        <CarouselItem className="!pl-0 w-full">
          <div className="w-full h-[45vh] md:h-[60vh] lg:h-[75vh] xl:h-[85vh] 2xl:h-[45vh] relative">
            <Image 
              src="/banner2.png" 
              alt="banner 2" 
              fill
              sizes="100vw" 
              className="object-cover" 
            />
          </div>
        </CarouselItem>
        <CarouselItem className="!pl-0 w-full">
          <div className="w-full h-[45vh] md:h-[60vh] lg:h-[75vh] xl:h-[85vh] 2xl:h-[45vh] relative">
            <Image 
              src="/banner3.png" 
              alt="banner 3" 
              fill
              sizes="100vw" 
              className="object-cover" 
            />
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  )
}
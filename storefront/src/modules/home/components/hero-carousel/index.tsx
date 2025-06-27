"use client"

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { useEffect, useState } from "react"

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
          <div>
            <img src='/banner1.png' alt='banner 1' />
          </div>
        </CarouselItem>
        <CarouselItem className="!pl-0 w-full">
          <div>
            <img src='/banner2.png' alt='banner 2' />
          </div>
        </CarouselItem>
        <CarouselItem className="!pl-0 w-full">
          <div>
            <img src='/banner3.png' alt='banner 3' />
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  )
}
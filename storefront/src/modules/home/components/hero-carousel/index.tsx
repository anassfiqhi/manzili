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
          <div className="w-full h-full">
            <Image src="/banner1.png" alt="banner 1" layout="responsive" width={1920} height={600} sizes="100vw" className="w-full h-auto" />
          </div>
        </CarouselItem>
        <CarouselItem className="!pl-0 w-full">
          <div className="w-full h-full">
            <Image src="/banner2.png" alt="banner 2" layout="responsive" width={1920} height={600} sizes="100vw" className="w-full h-auto" />
          </div>
        </CarouselItem>
        <CarouselItem className="!pl-0 w-full">
          <div className="w-full h-full">
            <Image src="/banner3.png" alt="banner 3" layout="responsive" width={1920} height={600} sizes="100vw" className="w-full h-auto" />
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  )
}
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
          <div className="w-full h-[50vh] md:h-[60vh] lg:h-[75vh] xl:h-[85vh] 2xl:h-[45vh] relative">
            <Image
              src="/banner1.png"
              alt="banner 1"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 z-10">
              <div className="mx-auto px-4 py-10 md:py-24 lg:py-24 xl:py-24 2xl:py-40 md:max-w-md md:ml-0">
                <h2 className="text-2xl md:text-4xl lg:text-6xl xl:text-7xl mb-4 md:mb-6 lg:mb-8 text-white"><b>We deliver </b>the ideal</h2>
                <p className="mb-8 text-white">Our carefully curated selection of bath products is designed to elevate your bathing ritual to new heights.</p>
              </div>
            </div>
          </div>
        </CarouselItem>
        <CarouselItem className="!pl-0 w-full">
          <div className="w-full h-[50vh] md:h-[60vh] lg:h-[75vh] xl:h-[85vh] 2xl:h-[45vh] relative">
            <Image
              src="/banner2.png"
              alt="banner 2"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 z-10">
              <div className="mx-auto px-4 py-10 md:py-24 lg:py-24 xl:py-24 2xl:py-40 md:max-w-md md:ml-0">
                <h2 className="text-2xl md:text-4xl lg:text-6xl xl:text-7xl mb-4 md:mb-6 lg:mb-8 text-white"><b>Your bathroom </b>vision made possible.</h2>
                <p className="mb-8 text-white">Imagine stepping into your newly renovated bathroom, greeted by the soft glow of carefully placed lighting and the soothing sound of a cascading waterfall shower.</p>
              </div>
            </div>
          </div>
        </CarouselItem>
        <CarouselItem className="!pl-0 w-full">
          <div className="w-full h-[50vh] md:h-[60vh] lg:h-[75vh] xl:h-[85vh] 2xl:h-[45vh] relative">
            <Image
              src="/banner3.png"
              alt="banner 3"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 z-10">
              <div className="mx-auto px-4 py-10 md:py-24 lg:py-24 xl:py-24 2xl:py-40 md:max-w-md md:ml-0">
                <h2 className="text-2xl md:text-4xl lg:text-6xl xl:text-7xl mb-4 md:mb-6 lg:mb-8 text-white"><b>Bathroom design </b>showroom</h2>
                <p className="mb-8 text-white">The finest materials combined with traditional manufacturing skills make for the perfect look</p>
              </div>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  )
}
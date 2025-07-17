"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel"
import { useEffect, useState } from "react"
import Image from "next/image"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { MoveLeftIcon, MoveRight, MoveRightIcon } from "lucide-react"

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
          <div className="w-full h-[50vh] min-[320px]:h-[344px] min-[375px]:h-[344px] min-[425px]:h-[299px] md:h-[498px] lg:h-[calc(85vh-67px)] min-[1441px]:h-[calc(55vh-67px)] relative">
            <Image
              src="/banner1.png"
              alt="banner 1"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 z-10">
              <div className="mx-auto px-4 py-[40px] sm:py-[60px] md:py-[100px] xl:pt-[170px] md:max-w-5xl md:px-6 md:ml-0 xl:mx-auto">
                <h2 className="truncate whitespace-nowrap text-[26px] max-[425px]:text-[26px] md:text-[41px] lg:text-[56px] min-[1440px]:text-[70px] mb-4 md:mb-6 lg:mb-8 text-white font-serif"><b>We deliver </b>the ideal</h2>
                <p className="truncate whitespace-nowrap text-[14px] mb-8 text-white" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Ubuntu, sans-serif' }}>Our carefully curated selection of bath products is designed to elevate your bathing ritual to new heights.</p>
                <div className="flex flex-col min-[376px]:flex-row justify-center items-center md:justify-start gap-3">
                  <LocalizedClientLink
                    href="/categories"
                    className="flex justify-center items-center text-center px-3 py-4 bg-white font-medium text-sm h-9 text-black border border-white border-solid rounded-full"
                    data-testid="categories-link"
                  >
                    Show our Category
                    <MoveRight className="ml-2 h-4 w-4 text-black" />
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/store"
                    className="flex justify-center items-center text-center px-3 py-4 bg-transparent font-medium text-sm h-9 text-white border border-white border-solid rounded-full"
                    data-testid="store-link"
                  >
                    Show our products
                    <MoveRight className="ml-2 h-4 w-4 text-white" />
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          </div>
        </CarouselItem>
        <CarouselItem className="!pl-0 w-full">
          <div className="w-full h-[50vh] min-[320px]:h-[344px] min-[375px]:h-[344px] min-[425px]:h-[299px] md:h-[498px] lg:h-[calc(85vh-67px)] min-[1441px]:h-[calc(55vh-67px)] relative">
            <Image
              src="/banner2.png"
              alt="banner 2"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 z-10">
              <div className="mx-auto px-4 py-[40px] sm:py-[60px] md:py-[100px] xl:pt-[170px] md:max-w-5xl md:px-6 md:ml-0 xl:mx-auto">
                <h2 className="truncate whitespace-nowrap text-[26px] max-[425px]:text-[26px] md:text-[41px] lg:text-[56px] min-[1440px]:text-[70px] mb-4 md:mb-6 lg:mb-8 text-white font-serif"><b>Your bathroom </b>vision made possible.</h2>
                <p className="truncate whitespace-nowrap text-[14px] mb-8 text-white" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Ubuntu, sans-serif' }}>Imagine stepping into your newly renovated bathroom, greeted by the soft glow of carefully placed lighting and the soothing sound of a cascading waterfall shower.</p>
                <div className="flex flex-col min-[376px]:flex-row justify-center items-center md:justify-start gap-3">
                  <LocalizedClientLink
                    href="/categories"
                    className="flex justify-center items-center text-center px-3 py-4 bg-white font-medium text-sm h-9 text-black border border-white border-solid rounded-full"
                    data-testid="categories-link"
                  >
                    Show our Category
                    <MoveRight className="ml-2 h-4 w-4 text-black" />
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/store"
                    className="flex justify-center items-center text-center px-3 py-4 bg-transparent font-medium text-sm h-9 text-white border border-white border-solid rounded-full"
                    data-testid="store-link"
                  >
                    Show our products
                    <MoveRight className="ml-2 h-4 w-4 text-white" />
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          </div>
        </CarouselItem>
        <CarouselItem className="!pl-0 w-full">
          <div className="w-full h-[50vh] min-[320px]:h-[344px] min-[375px]:h-[344px] min-[425px]:h-[299px] md:h-[498px] lg:h-[calc(85vh-67px)] min-[1441px]:h-[calc(55vh-67px)] relative">
            <Image
              src="/banner3.png"
              alt="banner 3"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 z-10">
              <div className="mx-auto px-4 py-[40px] sm:py-[60px] md:py-[100px] xl:pt-[170px] md:max-w-5xl md:px-6 md:ml-0 xl:mx-auto">
                <h2 className="truncate whitespace-nowrap text-[26px] max-[425px]:text-[26px] md:text-[41px] lg:text-[56px] min-[1440px]:text-[70px] mb-4 md:mb-6 lg:mb-8 text-white font-serif"><b>Bathroom design </b>showroom</h2>
                <p className="truncate whitespace-nowrap text-[14px] mb-8 text-white" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Ubuntu, sans-serif' }}>The finest materials combined with traditional manufacturing skills make for the perfect look</p>
                <div className="flex flex-col min-[376px]:flex-row justify-center items-center md:justify-start gap-3">
                  <LocalizedClientLink
                    href="/categories"
                    className="flex justify-center items-center text-center px-3 py-4 bg-white font-medium text-sm h-9 text-black border border-white border-solid rounded-full"
                    data-testid="categories-link"
                  >
                    Show our Category
                    <MoveRight className="ml-2 h-4 w-4 text-black" />
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/store"
                    className="flex justify-center items-center text-center px-3 py-4 bg-transparent font-medium text-sm h-9 text-white border border-white border-solid rounded-full"
                    data-testid="store-link"
                  >
                    Show our products
                    <MoveRight className="ml-2 h-4 w-4 text-white" />
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>
      <div className="hidden absolute min-h-[35px] w-fit bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 md:flex md:justify-center md:items-center">
        <CarouselPrevious icon={<MoveLeftIcon
          className="w-2 h-2 text-black"
        />} className="min-w-[35px] min-h-[35px] md:min-w-[40px] md:min-h-[40px] bg-[#ededed] shadow-lg" />
        <span className="hidden lg:inline text-[14px] min-w-11 text-center text-white">{current.toString().padStart(2, '0')}/{count.toString().padStart(2, '0')}</span>
        <CarouselNext icon={<MoveRightIcon
          className="w-2 h-2 text-black"
        />} className="min-w-[35px] min-h-[35px] md:min-w-[40px] md:min-h-[40px] bg-[#ededed] shadow-lg" />
      </div>
    </Carousel>
  )
}
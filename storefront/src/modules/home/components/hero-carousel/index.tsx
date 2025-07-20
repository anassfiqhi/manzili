"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel"
import { useEffect, useState } from "react"
import Image from "next/image"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { MoveLeftIcon, MoveRight, MoveRightIcon } from "lucide-react"
import clsx from "clsx"

export function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  // Carousel data array
  const carouselItems = [
    {
      src: "/banner1.png",
      alt: "banner 1",
      title: "<b>Nous livrons </b>l'idéal",
      description: "Notre sélection soigneusement choisie de produits de bain est conçue pour élever votre rituel de bain à de nouveaux sommets.",
    },
    {
      src: "/banner2.png",
      alt: "banner 2",
      title: "<b>Votre vision </b>de salle de bain réalisée.",
      description: "Imaginez entrer dans votre salle de bain nouvellement rénovée, accueilli par la douce lueur d'un éclairage soigneusement placé et le son apaisant d'une douche en cascade.",
    },
    {
      src: "/banner3.png",
      alt: "banner 3",
      title: "<b>Showroom </b>de design de salle de bain",
      description: "Les matériaux les plus fins combinés aux compétences de fabrication traditionnelles créent le look parfait",
    },
  ]

  // Dynamic loading state
  const [imageLoaded, setImageLoaded] = useState(Array(carouselItems.length).fill(false))

  const handleImageLoad = (idx: number) => {
    setImageLoaded((prev) => {
      const updated = [...prev]
      updated[idx] = true
      return updated
    })
  }

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
        {carouselItems.map((item, idx) => (
          <CarouselItem className="!pl-0 w-full" key={item.src}>
            <div className="w-full h-[50vh] min-[320px]:h-[344px] min-[375px]:h-[344px] min-[425px]:h-[299px] md:h-[498px] lg:h-[calc(85vh-67px)] min-[1441px]:h-[calc(55vh-67px)] relative">
              {/* Skeleton */}
              {!imageLoaded[idx] && (
                <div className="absolute inset-0 skeleton-shimmer z-20 rounded-lg" />
              )}
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="100vw"
                className={clsx("object-cover", !imageLoaded[idx] && "invisible")}
                loading="lazy"
                onLoadingComplete={() => handleImageLoad(idx)}
              />
              <div className="absolute top-0 left-0 right-0 bottom-0 z-10">
                <div className="mx-auto px-4 py-[40px] sm:py-[60px] md:py-[100px] xl:pt-[170px] md:max-w-5xl md:px-6 md:ml-0 xl:mx-auto">
                  <h2 className="truncate whitespace-nowrap text-[26px] max-[425px]:text-[26px] md:text-[41px] lg:text-[56px] min-[1440px]:text-[70px] mb-4 md:mb-6 lg:mb-8 text-white font-serif" dangerouslySetInnerHTML={{ __html: item.title }} />
                  <p className="truncate whitespace-nowrap text-[14px] mb-8 text-white" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Ubuntu, sans-serif' }}>{item.description}</p>
                  <div className="flex flex-col min-[376px]:flex-row justify-center items-center md:justify-start gap-3">
                    <LocalizedClientLink
                      href="/categories"
                      className="flex justify-center items-center text-center px-3 py-4 bg-white font-medium text-sm h-9 text-black border border-white border-solid rounded-full"
                      data-testid="categories-link"
                    >
                      Voir nos Catégories
                      <MoveRight className="ml-2 h-4 w-4 text-black" />
                    </LocalizedClientLink>
                    <LocalizedClientLink
                      href="/store"
                      className="flex justify-center items-center text-center px-3 py-4 bg-transparent font-medium text-sm h-9 text-white border border-white border-solid rounded-full"
                      data-testid="store-link"
                    >
                      Voir nos Produits
                      <MoveRight className="ml-2 h-4 w-4 text-white" />
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex absolute min-h-[35px] w-fit bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center">
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
import { Metadata } from "next"
import FeaturedProducts from "@modules/home/components/featured-products"
import { getRegion } from "@lib/data/regions"
import { HeroCarousel } from "@/modules/home/components/hero-carousel"
import CategoriesGrid from "@modules/categories/components/CategoriesGrid"
import SkeletonFeaturedProducts from "@modules/skeletons/components/skeleton-featured-products"
import { getCarouselItemsWithMedia } from "@lib/data/carousel-media"
import { getSlidesAsCarouselItems } from "@lib/data/slides"
import { Suspense } from "react"
import { unstable_cache } from "next/cache"

export const metadata: Metadata = {
  title: "Sweet Nest Store",
  description:
    "Boutique en ligne performante avec Next.js 14 et Medusa.",
}

// Cached carousel items with media (legacy carousel system)
const getCachedCarouselItems = unstable_cache(
  async () => {
    return await getCarouselItemsWithMedia()
  },
  ["active-carousel-with-media"],
  {
    tags: ["carousel", "carousel-media"],
    revalidate: 300, // 5 minutes
  }
)

// Cached slides as carousel items (new slides system)
const getCachedSlidesAsCarouselItems = unstable_cache(
  async () => {
    return await getSlidesAsCarouselItems()
  },
  ["active-slides-as-carousel"],
  {
    tags: ["slides", "slide-media"],
    revalidate: 300, // 5 minutes
  }
)

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string }
}) {
  const region = await getRegion(countryCode)
  if (!region) {
    return null
  }

  // Fetch both carousel systems and merge them
  const [carousels, slidesAsCarousels] = await Promise.all([
    getCachedCarouselItems(),
    getCachedSlidesAsCarouselItems()
  ])
  
  console.log("Page: cached carousel items with media:", carousels)
  console.log("Page: cached slides as carousel items:", slidesAsCarousels)
  
  // Use slides if available, otherwise fall back to carousel system
  const displayCarousels = slidesAsCarousels && slidesAsCarousels.length > 0 
    ? slidesAsCarousels 
    : carousels

  return (
    <>
      <HeroCarousel carousels={displayCarousels} />
      {/* <Hero /> */}
      <CategoriesGrid />
      <div className="py-12">
        <div className="content-container">
          <div className="mb-8 text-center">
            <h2 className="text-2xl-semi mb-2 font-maven text-3xl">Découvrez nos Collections</h2>
            <p className="text-lg text-ui-fg-subtle max-w-2xl mx-auto">
              Découvrez notre sélection de produits soigneusement choisis pour vous offrir le meilleur de notre gamme
            </p>
          </div>
        </div>
        <ul className="flex flex-col gap-x-6">
          <Suspense fallback={<SkeletonFeaturedProducts />}>
            <FeaturedProducts countryCode={countryCode} region={region} />
          </Suspense>
        </ul>
      </div>
    </>
  )
}

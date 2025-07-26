import { Metadata } from "next"
import FeaturedProducts from "@modules/home/components/featured-products"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { HeroCarousel } from "@/modules/home/components/hero-carousel"
import CategoriesGrid from "@modules/categories/components/CategoriesGrid"
import SkeletonFeaturedProducts from "@modules/skeletons/components/skeleton-featured-products"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Manzili Store",
  description:
    "Boutique en ligne performante avec Next.js 14 et Medusa.",
}

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string }
}) {
  const collections = await getCollectionsWithProducts(countryCode)
  const region = await getRegion(countryCode)
  console.log('Collections : ',collections)
  if (!collections || !region) {
    return null
  }

  return (
    <>
      <HeroCarousel />
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
            <FeaturedProducts collections={collections} region={region} />
          </Suspense>
        </ul>
      </div>
    </>
  )
}

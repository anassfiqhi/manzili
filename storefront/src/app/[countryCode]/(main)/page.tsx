import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { HeroCarousel } from "@/modules/home/components/hero-carousel"
import { listCategories } from "@lib/data/categories"
import CategoriesGrid from "@modules/categories/components/CategoriesGrid"

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
  if (!collections || !region) {
    return null
  }

  return (
    <>
      <HeroCarousel />
      {/* <Hero /> */}
      <CategoriesGrid />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}

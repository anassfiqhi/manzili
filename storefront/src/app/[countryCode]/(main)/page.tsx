import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { HeroCarousel } from "@/modules/home/components/hero-carousel"
import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { ArrowUpRightMini } from "@medusajs/icons"
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
  const product_categories = await listCategories()

  if (!collections || !region || !product_categories) {
    return null
  }

  // Filter out categories that have parent categories (only show top-level categories)
  const topLevelCategories = product_categories.filter(
    (category) => !category.parent_category
  )

  const categoryImageMap = {
    "ROBINETTERIE": "taps.png",
    "SANITAIRE": "sanitary.png",
    "MEUBLES SALLE DE BAIN": "bathroom_furniture.png",
    "MIROIRS": "mirrors.png",
    "ACCESOIRES SALLE DE BAIN": "bathroom_accessories.png",
    "FILTRE À EAU": "water_filter.png",
    "CUISINE": "kitchen.png",
    // ...add all mappings as needed
  } as Record<string, string>

  return (
    <>
      <HeroCarousel />
      {/* <Hero /> */}
      <div className="py-12">
        <div className="mb-8 content-container text-center">
          <h1 className="text-2xl-semi mb-2">Categories</h1>
          <p className="text-base-regular text-ui-fg-subtle">
            Browse our full collection of products organized by category
          </p>
        </div>
        <CategoriesGrid topLevelCategories={topLevelCategories} categoryImageMap={categoryImageMap} />
      </div>
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}

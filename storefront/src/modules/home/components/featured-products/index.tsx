import { HttpTypes } from "@medusajs/types"
import { getCollectionsWithProducts } from "@lib/data/collections"
import ProductRail from "@modules/home/components/featured-products/product-rail"
import { unstable_cache } from "next/cache"

// Cache the collections data with 5-minute revalidation
const getCachedCollections = unstable_cache(
  async (countryCode: string) => {
    return await getCollectionsWithProducts(countryCode)
  },
  ['featured-collections'],
  {
    revalidate: 60, // 5 minutes in seconds
    tags: ['collections', 'featured-products']
  }
)

export default async function FeaturedProducts({
  countryCode,
  region,
}: {
  countryCode: string
  region: HttpTypes.StoreRegion
}) {
  try {
    const collections = await getCachedCollections(countryCode)

    if (!collections || collections.length === 0) {
      return (
        <div className="content-container py-12">
          <p className="text-center text-ui-fg-subtle">
            Aucune collection disponible
          </p>
        </div>
      )
    }

    return collections.map((collection) => (
      <li key={collection.id}>
        <ProductRail collection={collection} region={region} />
      </li>
    ))
  } catch (error) {
    console.error("Error fetching collections:", error)
    return (
      <div className="content-container py-12">
        <p className="text-center text-ui-fg-subtle">
          Erreur lors du chargement des collections
        </p>
      </div>
    )
  }
}

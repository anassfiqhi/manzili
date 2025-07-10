import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import PriceFilter from "@/components/ui/price-filter"
import { getProductsList } from "@lib/data/products"
import { getPriceRangeFromProducts, filterProductsByPriceRange } from "@lib/util/get-price-range"
import { getRegion } from "@lib/data/regions"

type StoreProductParamsWithCollection = HttpTypes.StoreProductParams & {
  collection_id?: string[]
}

export default async function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  searchParams,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
  searchParams?: { minPrice?: string; maxPrice?: string }
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  // Fetch products for this collection to calculate price range
  const { response: { products } } = await getProductsList({
    queryParams: { 
      collection_id: [collection.id],
      limit: 100 // Get more products to have a better price range
    } as StoreProductParamsWithCollection,
    countryCode,
  })

  const priceRange = getPriceRangeFromProducts(products)
  const region = await getRegion(countryCode)

  // Apply price filtering if parameters are provided
  let filteredProducts = products
  if (searchParams?.minPrice && searchParams?.maxPrice) {
    const minPrice = parseInt(searchParams.minPrice)
    const maxPrice = parseInt(searchParams.maxPrice)
    filteredProducts = filterProductsByPriceRange(products, minPrice, maxPrice)
  }

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      <div>
        <PriceFilter 
          min={priceRange?.min || 0}
          max={priceRange?.max || 1000}
          currency={priceRange?.currency_code || region?.currency_code || '$'}
        />
        <RefinementList sortBy={sort} />
      </div>
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1>{collection.title}</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
            filteredProducts={filteredProducts}
          />
        </Suspense>
      </div>
    </div>
  )
}

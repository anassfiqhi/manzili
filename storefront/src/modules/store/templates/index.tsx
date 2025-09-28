import { Suspense } from "react"
import { unstable_cache } from "next/cache"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"
import PriceFilter from "@/components/ui/price-filter"
import { getProductsList } from "@lib/data/products"
import { getPriceRangeFromProducts, filterProductsByPriceRange } from "@lib/util/get-price-range"
import { getRegion } from "@lib/data/regions"

const getCachedStoreData = unstable_cache(
  async (countryCode: string) => {
    // Fetch products to calculate price range
    const { response: { products } } = await getProductsList({
      queryParams: { 
        limit: 100 // Get more products to have a better price range
      },
      countryCode,
    })

    const priceRange = getPriceRangeFromProducts(products)
    const region = await getRegion(countryCode)

    return {
      products,
      priceRange,
      region,
    }
  },
  [],
  {
    tags: ["products", "regions"],
    revalidate: 60, // Cache for 10 minutes
  }
)

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  searchParams,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchParams?: { minPrice?: string; maxPrice?: string }
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const { products, priceRange, region } = await getCachedStoreData(countryCode)

  // Apply price filtering if parameters are provided
  let filteredProducts = products
  if (searchParams?.minPrice && searchParams?.maxPrice) {
    const minPrice = parseInt(searchParams.minPrice)
    const maxPrice = parseInt(searchParams.maxPrice)
    filteredProducts = filterProductsByPriceRange(products, minPrice, maxPrice)
  }

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <div>
        <PriceFilter 
          title="Filtrer par Prix"
          min={priceRange?.min || 0}
          max={priceRange?.max || 1000}
          currency={priceRange?.currency_code || region?.currency_code || '$'}
        />
        <RefinementList sortBy={sort} />
      </div>
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1 data-testid="store-page-title">All products</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            filteredProducts={filteredProducts}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate

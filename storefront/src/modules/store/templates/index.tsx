import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"
import PriceFilter from "@/components/ui/price-filter"
import { getProductsList } from "@lib/data/products"
import { getPriceRangeFromProducts } from "@lib/util/get-price-range"
import { getRegion } from "@lib/data/regions"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  // Fetch products to calculate price range
  const { response: { products } } = await getProductsList({
    queryParams: { 
      limit: 100 // Get more products to have a better price range
    },
    countryCode,
  })

  const priceRange = getPriceRangeFromProducts(products)
  const region = await getRegion(countryCode)

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
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
          <h1 data-testid="store-page-title">All products</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate

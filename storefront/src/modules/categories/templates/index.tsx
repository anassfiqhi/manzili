import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import PriceFilter from "@/components/ui/price-filter"
import { getProductsList } from "@lib/data/products"
import { getPriceRangeFromProducts, filterProductsByPriceRange } from "@lib/util/get-price-range"
import { getRegion } from "@lib/data/regions"

type StoreProductParamsWithCategory = HttpTypes.StoreProductParams & {
  category_id?: string[]
}

export default async function CategoryTemplate({
  categories,
  sortBy,
  page,
  countryCode,
  searchParams,
}: {
  categories: HttpTypes.StoreProductCategory[]
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchParams?: { minPrice?: string; maxPrice?: string }
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const category = categories[categories.length - 1]
  const parents = categories.slice(0, categories.length - 1)

  if (!category || !countryCode) notFound()

  // Fetch products for this category to calculate price range
  const { response: { products } } = await getProductsList({
    queryParams: { 
      category_id: [category.id],
      limit: 100 // Get more products to have a better price range
    } as StoreProductParamsWithCategory,
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
        <RefinementList sortBy={sort} data-testid="sort-by-container" />
      </div>
      <div className="w-full">
        <div className="flex flex-row mb-8 text-2xl-semi gap-4">
          {parents &&
            parents.map((parent) => (
              <span key={parent.id} className="text-ui-fg-subtle">
                <LocalizedClientLink
                  className="mr-4 hover:text-black"
                  href={`/categories/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  {parent.name}
                </LocalizedClientLink>
                /
              </span>
            ))}
          <h1 data-testid="category-page-title">{category.name}</h1>
        </div>
        {category.description && (
          <div className="mb-8 text-base-regular">
            <p>{category.description}</p>
          </div>
        )}
        {category.category_children && (
          <div className="mb-8 text-base-large">
            <ul className="grid grid-cols-1 gap-2">
              {category.category_children?.map((c) => (
                <li key={c.id}>
                  <InteractiveLink href={`/categories/${c.handle}`}>
                    {c.name}
                  </InteractiveLink>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            countryCode={countryCode}
            filteredProducts={filteredProducts}
          />
        </Suspense>
      </div>
    </div>
  )
}

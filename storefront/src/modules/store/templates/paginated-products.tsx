import { getProductsListWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"
import { sortProducts } from "@lib/util/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  filteredProducts,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  filteredProducts?: HttpTypes.StoreProduct[]
}) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let products: HttpTypes.StoreProduct[]
  let count: number

  if (filteredProducts) {
    // Use filtered products and apply sorting
    const sortedProducts = sortProducts(filteredProducts, sortBy || "created_at")
    count = sortedProducts.length
    
    // Apply pagination to filtered products
    const startIndex = (page - 1) * PRODUCT_LIMIT
    const endIndex = startIndex + PRODUCT_LIMIT
    products = sortedProducts.slice(startIndex, endIndex)
  } else {
    // Use the original logic for fetching products
    const queryParams: PaginatedProductsParams = {
      limit: 12,
    }

    if (collectionId) {
      queryParams["collection_id"] = [collectionId]
    }

    if (categoryId) {
      queryParams["category_id"] = [categoryId]
    }

    if (productsIds) {
      queryParams["id"] = productsIds
    }

    if (sortBy === "created_at") {
      queryParams["order"] = "created_at"
    }

    const {
      response: { products: fetchedProducts, count: fetchedCount },
    } = await getProductsListWithSort({
      page,
      queryParams,
      sortBy,
      countryCode,
    })

    products = fetchedProducts
    count = fetchedCount
  }

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}

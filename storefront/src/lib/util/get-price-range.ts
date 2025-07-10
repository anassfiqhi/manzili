import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "./get-product-price"

export interface PriceRange {
  min: number
  max: number
  currency_code: string
}

export function getPriceRangeFromProducts(
  products: HttpTypes.StoreProduct[]
): PriceRange | null {
  if (!products || products.length === 0) {
    return null
  }

  let minPrice = Infinity
  let maxPrice = -Infinity
  let currency_code = ""

  products.forEach((product) => {
    const { cheapestPrice } = getProductPrice({ product })
    
    if (cheapestPrice) {
      const price = cheapestPrice.calculated_price_number
      minPrice = Math.min(minPrice, price)
      maxPrice = Math.max(maxPrice, price)
      currency_code = cheapestPrice.currency_code
    }
  })

  // If no valid prices found, return null
  if (minPrice === Infinity || maxPrice === -Infinity) {
    return null
  }

  return {
    min: Math.floor(minPrice),
    max: Math.ceil(maxPrice),
    currency_code,
  }
}

export function filterProductsByPriceRange(
  products: HttpTypes.StoreProduct[],
  minPrice: number,
  maxPrice: number
): HttpTypes.StoreProduct[] {
  if (!products || products.length === 0) {
    return []
  }

  return products.filter((product) => {
    const { cheapestPrice } = getProductPrice({ product })
    
    if (!cheapestPrice) {
      return false
    }

    const price = cheapestPrice.calculated_price_number
    return price >= minPrice && price <= maxPrice
  })
} 
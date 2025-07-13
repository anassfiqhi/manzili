import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Boutique",
  description: "Explorez tous nos produits.",
}

type Params = {
  searchParams: {
    sortBy?: SortOptions
    page?: string
    minPrice?: string
    maxPrice?: string
  }
  params: {
    countryCode: string
  }
}

export default async function StorePage({ searchParams, params }: Params) {
  const { sortBy, page, minPrice, maxPrice } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      searchParams={{ minPrice, maxPrice }}
    />
  )
}

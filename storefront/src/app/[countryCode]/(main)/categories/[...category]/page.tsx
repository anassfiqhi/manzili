import { Metadata } from "next"
import { notFound } from "next/navigation"
import { unstable_cache } from "next/cache"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreProductCategory, StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const dynamic = 'force-dynamic'
export const revalidate = 300 // 5 minutes

type Props = {
  params: { category: string[]; countryCode: string }
  searchParams: {
    sortBy?: SortOptions
    page?: string
    minPrice?: string
    maxPrice?: string
  }
}

// Cached function to get static params for better performance
const getCachedStaticParams = unstable_cache(
  async () => {
    const product_categories = await listCategories()

    if (!product_categories) {
      return []
    }

    const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    const categoryHandles = product_categories.map(
      (category: any) => category.handle
    )

    const staticParams = countryCodes
      ?.map((countryCode: string | undefined) =>
        categoryHandles.map((handle: any) => ({
          countryCode,
          category: [handle],
        }))
      )
      .flat()

    return staticParams
  },
  ["category-static-params"],
  {
    tags: ["categories", "regions"],
    revalidate: 600, // 10 minutes for static params
  }
)

export async function generateStaticParams() {
  return await getCachedStaticParams()
}

// Cached metadata generation for better performance
const getCachedCategoryMetadata = (categoryHandles: string[]) =>
  unstable_cache(
    async () => {
      const { product_categories } = await getCategoryByHandle(categoryHandles)

      if (!product_categories) {
        return null
      }

      const title = product_categories
        .map((category: StoreProductCategory) => category.name)
        .join(" | ")

      const description =
        product_categories[product_categories.length - 1].description ??
        `Catégorie ${title}.`

      return {
        title: `${title} | Sweet Nest Store`,
        description,
        alternates: {
          canonical: `${categoryHandles.join("/")}`,
        },
      }
    },
    ["category-metadata", ...categoryHandles],
    {
      tags: ["categories"],
      revalidate: 600, // 10 minutes for metadata
    }
  )()

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const metadata = await getCachedCategoryMetadata(params.category)
    
    if (!metadata) {
      notFound()
    }

    return metadata
  } catch (error) {
    notFound()
  }
}

// Cached category data fetch with search params consideration
const getCachedCategoryData = (categoryHandles: string[]) => 
  unstable_cache(
    async () => {
      const { product_categories } = await getCategoryByHandle(categoryHandles)
      return product_categories
    },
    ["category-page-data", ...categoryHandles],
    {
      tags: ["categories"],
      revalidate: 300, // 5 minutes for category data
    }
  )()

export default async function CategoryPage({ params, searchParams }: Props) {
  const { sortBy, page, minPrice, maxPrice } = searchParams

  // Use cached category data fetch
  const product_categories = await getCachedCategoryData(params.category)

  if (!product_categories) {
    notFound()
  }

  return (
    <CategoryTemplate
      categories={product_categories}
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      searchParams={{ minPrice, maxPrice }}
    />
  )
}

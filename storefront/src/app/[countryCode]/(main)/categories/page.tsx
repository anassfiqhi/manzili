import { Metadata } from "next"
import { notFound } from "next/navigation"

import { listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreProductCategory, StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text, clx } from "@medusajs/ui"

export const dynamic = 'force-dynamic'

type Props = {
  params: { countryCode: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "Categories | Manzili Store",
    description: "Browse all product categories available in our store.",
    alternates: {
      canonical: "/categories",
    },
  }
}

export default async function CategoriesPage({ params }: Props) {
  const product_categories = await listCategories()

  if (!product_categories) {
    notFound()
  }

  // Filter out categories that have parent categories (only show top-level categories)
  const topLevelCategories = product_categories.filter(
    (category: StoreProductCategory) => !category.parent_category
  )

  return (
    <div className="flex flex-col py-6 content-container">
      <div className="mb-8">
        <h1 className="text-2xl-semi mb-2" data-testid="categories-page-title">
          All Categories
        </h1>
        <p className="text-base-regular text-ui-fg-subtle">
          Browse our complete collection of products organized by category
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topLevelCategories.map((category: StoreProductCategory) => (
          <div
            key={category.id}
            className="border border-ui-border-base rounded-lg p-6 hover:border-ui-border-interactive transition-colors"
            data-testid="category-card"
          >
            <div className="mb-4">
              <h2 className="text-lg-semi mb-2">{category.name}</h2>
              {category.description && (
                <p className="text-small-regular text-ui-fg-subtle mb-4">
                  {category.description}
                </p>
              )}
            </div>

            <LocalizedClientLink
              href={`/categories/${category.handle}`}
              className="text-small-regular text-ui-fg-interactive hover:text-ui-fg-interactive-hover transition-colors"
              data-testid="category-link"
            >
              View Category →
            </LocalizedClientLink>

            {category.category_children && category.category_children.length > 0 && (
              <div className="mt-4">
                <Text className="text-small-regular text-ui-fg-subtle mb-2">
                  Subcategories:
                </Text>
                <ul className="grid grid-cols-1 gap-1">
                  {category.category_children.slice(0, 3).map((child) => (
                    <li key={child.id}>
                      <LocalizedClientLink
                        href={`/categories/${child.handle}`}
                        className={clx(
                          "text-small-regular text-ui-fg-subtle hover:text-ui-fg-base transition-colors"
                        )}
                        data-testid="subcategory-link"
                      >
                        {child.name}
                      </LocalizedClientLink>
                    </li>
                  ))}
                  {category.category_children.length > 3 && (
                    <li className="text-small-regular text-ui-fg-subtle">
                      +{category.category_children.length - 3} more
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {topLevelCategories.length === 0 && (
        <div className="text-center py-12">
          <Text className="text-large-regular text-ui-fg-subtle">
            No categories available at the moment.
          </Text>
        </div>
      )}
    </div>
  )
} 
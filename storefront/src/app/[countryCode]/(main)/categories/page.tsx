import { Metadata } from "next"
import { notFound } from "next/navigation"

import { listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreProductCategory, StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text, clx } from "@medusajs/ui"
import Thumbnail from "@modules/products/components/thumbnail"
import { ArrowUpRightMini } from "@medusajs/icons"

export const dynamic = 'force-dynamic'
export const revalidate = 300 // 5 minutes

type Props = {
  params: { countryCode: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "Catégories | Sweet Nest Store",
    description: "Parcourez toutes les catégories de produits disponibles dans notre boutique.",
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

  const categoryImageMap: Record<string, string> = {
    "ROBINETTERIE": "taps.png",
    "SANITAIRE": "sanitary.png",
    "MEUBLES SALLE DE BAIN": "bathroom_furniture.png",
    "MIROIRS": "mirrors.png",
    "ACCESOIRES SALLE DE BAIN": "bathroom_accessories.png",
    "FILTRE À EAU": "water_filter.png",
    "CUISINE": "kitchen.png",
    // ...add all mappings
  }

  return (
    <div className="flex flex-col py-6 content-container">
      <div className="mb-8 content-container text-center">
        <h1 className="text-2xl-semi mb-2" data-testid="categories-page-title">
          Toutes les catégories
        </h1>
        <p className="text-base-regular text-ui-fg-subtle">
          Parcourez notre collection complète de produits organisés par catégorie
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {topLevelCategories.map((category: StoreProductCategory) => (
          <div
            key={category.id}
            className="rounded-lg p-6 transition-colors w-fit h-fit cursor-pointer group/CategoryItem"
            data-testid="category-card"
          >
            <LocalizedClientLink
              href={`/categories/${category.handle}`}
              className="text-small-regular transition-colors"
              data-testid="category-link"
            >
              <Thumbnail
                thumbnail={
                  categoryImageMap[category.name]
                    ? `/categories/${categoryImageMap[category.name]}`
                    : undefined // fallback if not found
                }
                size="square"
                className="mb-4 w-[200px] h-[200px] aspect-square rounded-xl object-cover group-hover/CategoryItem:shadow-lg mx-auto"
                data-testid="category-thumbnail"
              />
              <div className="mb-4">
                <h2 className="text-lg text-center mb-2 border-b border-black w-fit mx-auto flex justify-center items-center gap-1">{category.name} <ArrowUpRightMini
                  className="group-hover/CategoryItem:rotate-45 ease-in-out duration-150 text-black"
                // color="var(--fg-interactive)"
                /></h2>
                {/* {category.description && (
                  <p className="text-small-regular text-ui-fg-subtle mb-4">
                    {category.description}
                  </p>
                )} */}
              </div>
            </LocalizedClientLink>

            {category.category_children && category.category_children.length > 0 && (
              <div className="mt-4">
                <Text className="text-small-regular text-ui-fg-subtle mb-2">
                  Sous-catégories :
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
                      +{category.category_children.length - 3} de plus
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
            Aucune catégorie disponible pour le moment.
          </Text>
        </div>
      )}
    </div>
  )
} 
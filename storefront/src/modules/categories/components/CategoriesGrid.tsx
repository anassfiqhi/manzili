import { listCategories } from "@lib/data/categories"
import { getCategoriesThumbnails, getCategoryDisplayImage } from "@lib/data/category-media"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { ArrowUpRightMini } from "@medusajs/icons"
import { unstable_cache } from "next/cache"

// Cached categories with thumbnails
const getCachedTopLevelCategoriesWithMedia = unstable_cache(
  async () => {
    const product_categories = await listCategories()
    
    if (!product_categories) {
      return []
    }

    // Filter out categories that have parent categories (only show top-level categories)
    const topLevelCategories = product_categories.filter(
      (category) => !category.parent_category
    )

    // Fetch thumbnails for all categories
    const thumbnails = await getCategoriesThumbnails(topLevelCategories)

    // Combine categories with their thumbnails
    return topLevelCategories.map(category => ({
      ...category,
      thumbnail: thumbnails[category.id]
    }))
  },
  ["top-level-categories-with-media"],
  {
    tags: ["categories", "category-media"],
    revalidate: 300, // 5 minutes
  }
)

const CategoriesGrid = async () => {
  const topLevelCategories = await getCachedTopLevelCategoriesWithMedia()

  if (!topLevelCategories || topLevelCategories.length === 0) {
    return <div>Loading categories...</div>
  }

  return (
    <div className="py-12">
      <div className="mb-8 content-container text-center">
        <h1 className="text-2xl-semi mb-2 font-maven">Découvrez nos Catégories</h1>
        <p className="text-lg text-ui-fg-subtle max-w-2xl mx-auto">
          Explorez notre vaste sélection de produits, soigneusement classés pour répondre à toutes vos envies d'aménagement et de décoration !
        </p>
      </div>
      <div className="flex flex-col lg:flex-row flex-wrap justify-center gap-8">
        {topLevelCategories.map((category) => (
          <div
            key={category.id}
            className="rounded-lg p-6 transition-colors w-full lg:w-fit h-fit cursor-pointer group/CategoryItem"
          >
            <LocalizedClientLink
              href={`/categories/${category.handle}`}
              className="text-small-regular transition-colors"
            >
              <Thumbnail
                thumbnail={getCategoryDisplayImage(
                  category.name, 
                  category.thumbnail, 
                  category.category_children
                )}
                size="square"
                className="mb-4 w-full lg:w-[200px] h-[200px] aspect-square rounded-xl object-cover group-hover/CategoryItem:shadow-lg lg:mx-auto"
              />
              <div className="mb-4">
                <h2 className="text-lg text-center mb-2 border-b border-black w-fit mx-auto flex justify-center items-center gap-1">{category.name} <ArrowUpRightMini className="group-hover/CategoryItem:rotate-45 ease-in-out duration-150 text-black" /></h2>
              </div>
            </LocalizedClientLink>
            {category.category_children && category.category_children.length > 0 && (
              <div className="mt-4">
                <span className="text-small-regular text-ui-fg-subtle mb-2">Sous-catégories :</span>
                <ul className="grid grid-cols-1 gap-1">
                  {category.category_children.slice(0, 3).map((child) => (
                    <li key={child.id}>
                      <LocalizedClientLink
                        href={`/categories/${child.handle}`}
                        className="text-small-regular text-ui-fg-subtle hover:text-ui-fg-base transition-colors"
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
    </div>
  )
}

export default CategoriesGrid 
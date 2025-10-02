import { sdk } from "@lib/config"
import { cache } from "react"
import { unstable_cache } from "next/cache"

export const listCategories = unstable_cache(
  async function () {
    return sdk.store.category
      .list({ fields: "+category_children" }, { next: { tags: ["categories"] } })
      .then(({ product_categories }) => product_categories)
  },
  ["categories-list"],
  {
    tags: ["categories"],
    revalidate: 300, // 5 minutes
  }
)

export const getCategoriesList = cache(async function (
  offset: number = 0,
  limit: number = 100
) {
  return sdk.store.category.list(
    // TODO: Look into fixing the type
    // @ts-ignore
    { limit, offset },
    { next: { tags: ["categories-list"] } }
  )
})

export const getCategoryByHandle = unstable_cache(
  async function (categoryHandle: string[]) {
    return sdk.store.category.list(
      // TODO: Look into fixing the type
      // @ts-ignore
      { handle: categoryHandle },
      { next: { tags: ["categories"] } }
    )
  },
  (categoryHandle: string[]) => ["category-by-handle", ...categoryHandle],
  {
    tags: ["categories"],
    revalidate: 300, // 5 minutes
  }
)

import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { Badge, SearchIcon, ShoppingBagIcon, UserIcon } from "lucide-react"
import SideMenuDrawer from "@modules/layout/components/side-menu-drawer"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { listCategories } from "@lib/data/categories"
import { StoreProductCategory } from "@medusajs/types"
import { getCollectionsList } from "@lib/data/collections"
import { HttpTypes } from "@medusajs/types"
import Thumbnail from "@modules/products/components/thumbnail"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-[67px] mx-auto duration-200 bg-black border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="h-full flex items-center">
            <div className="h-full">
              {/* <SideMenu regions={regions} /> */}
              <SideMenuDrawer regions={regions} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus uppercase pl-4 font-sans text-white text-2xl"
              data-testid="nav-store-link"
            >
              Manzili <span className="hidden md:inline">Store</span>
            </LocalizedClientLink>

          </div>

          <div className="flex items-center h-full pl-10 gap-5">

            <LocalizedClientLink
              href="/store"
              className="text-sm capitalize font-sans text-white hidden lg:inline"
              data-testid="nav-store-link"
            >
              Store
            </LocalizedClientLink>
            {/* Categories Hover Card */}
            <CategoriesHoverCard />
            {/* Collections Hover Card */}
            <CollectionsHoverCard />

          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/search"
                scroll={false}
                data-testid="nav-search-link"
              >
                <SearchIcon className="w-6 h-6 text-white" />
              </LocalizedClientLink>

              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                <UserIcon className="w-6 h-6 text-white" />
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <div className="relative">
                    <ShoppingBagIcon className="w-6 h-6 text-white" >
                    </ShoppingBagIcon>
                    {/* <Badge className="flex items-center justify-center bg-[#b1b1b1] text-black text-xs- w-[14px] h-[14px] p-0 rounded-full font-mono tabular-nums absolute top-[-4px] right-[-4px]">
                      0
                    </Badge> */}
                  </div>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}

const CategoriesHoverCard = async () => {
  const product_categories = await listCategories()
  const topLevelCategories = product_categories.filter(
    (category: StoreProductCategory) => !category.parent_category
  )

  // Don't render the hover card if there are no categories
  if (topLevelCategories.length === 0) {
    return null
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button
          className="text-sm capitalize font-sans text-white hidden lg:inline focus:outline-none h-full"
          data-testid="nav-categories-link"
          type="button"
        >
          <LocalizedClientLink
            href="/categories"
            className="text-sm capitalize font-sans text-white hidden lg:inline"
            data-testid="nav-categories-link"
          >
            Categories
          </LocalizedClientLink>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="p-0 w-screen shadow-none border-none">
        <div className="p-6 mx-auto w-fit bg-white shadow-md outline-none border-none rounded-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topLevelCategories.map((category: StoreProductCategory) => (
              <LocalizedClientLink
                key={category.id}
                href={`/categories/${category.handle}`}
                className="flex flex-col items-center bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow h-full"
                data-testid="hover-category-link"
              >
                <div className="w-full aspect-square mb-4 flex items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                  <Thumbnail thumbnail={undefined} size="medium" />
                </div>
                <span className="text-base font-medium text-center mt-2">{category.name}</span>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

const CollectionsHoverCard = async () => {
  const { collections } = await getCollectionsList(0, 100)

  // Don't render the hover card if there are no collections
  if (collections.length === 0) {
    return null
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button
          className="text-sm capitalize font-sans text-white hidden lg:inline focus:outline-none h-full"
          data-testid="nav-collections-link"
          type="button"
        >
          <LocalizedClientLink
            href="/collections"
            className="text-sm capitalize font-sans text-white hidden lg:inline"
            data-testid="nav-collections-link"
          >
            Collections
          </LocalizedClientLink>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="p-0 w-screen shadow-none border-none">
        <div className="p-6 mx-auto w-fit bg-white shadow-md outline-none border-none rounded-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {collections.map((collection: HttpTypes.StoreCollection) => (
              <LocalizedClientLink
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="flex flex-col items-center bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow h-full"
                data-testid="hover-collection-link"
              >
                <div className="w-full aspect-square mb-4 flex items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                  <Thumbnail thumbnail={undefined} size="medium" />
                </div>
                <span className="text-base font-medium text-center mt-2">{collection.title}</span>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

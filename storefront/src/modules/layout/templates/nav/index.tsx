import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { MoveDownIcon, SearchIcon, ShoppingBagIcon, UserIcon } from "lucide-react"
import SideMenuDrawer from "@modules/layout/components/side-menu-drawer"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { listCategories } from "@lib/data/categories"
import { StoreProductCategory } from "@medusajs/types"
import { getCollectionsList } from "@lib/data/collections"
import { HttpTypes } from "@medusajs/types"
import Thumbnail from "@modules/products/components/thumbnail"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-[67px] mx-auto duration-200 bg-black border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular md:max-w-5xl">
          <div className="h-full flex items-center">
            <div className="h-full">
              {/* <SideMenu regions={regions} /> */}
              <SideMenuDrawer regions={regions} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus uppercase pl-4 font-[outfit] text-white text-2xl"
              data-testid="nav-store-link"
            >
              Manzili <span className="hidden md:inline">Store</span>
            </LocalizedClientLink>

          </div>

          <div className="flex items-center h-full pl-10 gap-5">

            <LocalizedClientLink
              href="/store"
              className="text-sm capitalize font-[outfit] text-white hidden lg:inline"
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

  if (topLevelCategories.length === 0) {
    return null
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button
          className="text-sm capitalize font-[outfit] text-white hidden lg:flex focus:outline-none h-full items-center gap-1 group"
          data-testid="nav-categories-link"
          type="button"
        >
          <a
            href="/categories"
            className="text-sm capitalize font-[outfit] text-white hidden lg:inline"
            data-testid="nav-categories-link"
          >
            Categories
          </a>
          <MoveDownIcon 
            className="w-3 h-3 text-white transition-transform duration-200 group-data-[state=open]:rotate-180" 
          />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="p-0 w-screen shadow-none border-none">
        <div className="p-6 w-full bg-white shadow-md outline-none border-none rounded-md h-[35vh] md:h-[40vh] lg:h-[45vh] 2xl:h-[25vh] flex items-center">
          <div className="relative w-full">
            <Carousel opts={{ align: 'start', loop: false }}>
              <CarouselContent className="pl-0 relative w-4/5 mx-auto overflow-hidden">
                {topLevelCategories.map((category: StoreProductCategory) => (
                  <CarouselItem key={category.id} className="basis-1/4 max-w-xs flex justify-center">
                    <a
                      href={`/categories/${category.handle}`}
                      className="flex flex-col items-center group w-48"
                      data-testid="hover-category-link"
                    >
                      <div className="w-32 h-32 flex items-center justify-center rounded-2xl border-2 border-gray-200 overflow-hidden bg-gray-50 group-hover:border-black transition-all">
                        <Thumbnail thumbnail={undefined} size="medium" />
                      </div>
                      <span className="text-base font-medium text-center mt-4 truncate w-full" title={category.name}>{category.name}</span>
                    </a>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-1" />
              <CarouselNext className="-right-1" />
            </Carousel>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

const CollectionsHoverCard = async () => {
  const { collections } = await getCollectionsList(0, 100)

  if (collections.length === 0) {
    return null
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button
          className="text-sm capitalize font-[outfit] text-white hidden lg:flex focus:outline-none h-full items-center gap-1 group"
          data-testid="nav-collections-link"
          type="button"
        >
          <a
            href="/collections"
            className="text-sm capitalize font-[outfit] text-white hidden lg:inline"
            data-testid="nav-collections-link"
          >
            Collections
          </a>
          <MoveDownIcon 
            className="w-2 h-2 text-white transition-transform duration-200 group-data-[state=open]:rotate-180" 
          />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="p-0 w-screen shadow-none border-none">
        <div className="p-6 w-full bg-white shadow-md outline-none border-none rounded-md h-[35vh] md:h-[40vh] lg:h-[45vh] 2xl:h-[25vh] flex items-center">
          <div className="relative w-full">
            <Carousel opts={{ align: 'start', loop: false }}>
              <CarouselContent className="pl-0">
                {collections.map((collection: HttpTypes.StoreCollection) => (
                  <CarouselItem key={collection.id} className="basis-1/4 max-w-xs flex justify-center">
                    <a
                      href={`/collections/${collection.handle}`}
                      className="flex flex-col items-center group w-48"
                      data-testid="hover-collection-link"
                    >
                      <div className="w-32 h-32 flex items-center justify-center rounded-2xl border-2 border-gray-200 overflow-hidden bg-gray-50 group-hover:border-black transition-all">
                        <Thumbnail thumbnail={undefined} size="medium" />
                      </div>
                      <span className="text-base font-medium text-center mt-4 truncate w-full" title={collection.title}>{collection.title}</span>
                    </a>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

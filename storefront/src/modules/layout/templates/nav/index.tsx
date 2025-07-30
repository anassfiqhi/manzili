import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { ChevronDown, SearchIcon, ShoppingBagIcon, UserIcon } from "lucide-react"
import SideMenuDrawer from "@modules/layout/components/side-menu-drawer"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { listCategories } from "@lib/data/categories"
import { StoreProductCategory } from "@medusajs/types"
import { getCollectionsList } from "@lib/data/collections"
import { HttpTypes } from "@medusajs/types"
import Image from 'next/image'
import InteractiveLink from "@modules/common/components/interactive-link"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  const { collections } = await getCollectionsList(0, 100)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-[67px] mx-auto duration-200 bg-gray-50/50 backdrop-blur-2xl border-b border-gray-950/5 dark:border-white/10 shadow-lg">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular 2xl:max-w-5xl">
          <div className="h-full flex items-center">
            <div className="h-full">
              {/* <SideMenu regions={regions} /> */}
              <SideMenuDrawer regions={regions} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus uppercase pl-4 font-[outfit] text-black text-2xl"
              data-testid="nav-store-link"
            >
              Manzili
            </LocalizedClientLink>

          </div>

          <div className="flex items-center h-full gap-5 flex-1 justify-center">

            <LocalizedClientLink
              href="/store"
              className="text-sm capitalize font-sans text-black hidden lg:inline"
              data-testid="nav-store-link"
            >
              Boutique
            </LocalizedClientLink>
            {/* Categories Hover Card */}
            <CategoriesHoverCard />
            {/* Collections Hover Card */}
            {collections.length > 0 && <CollectionsHoverCard collections={collections} />}

          </div>

          <div className="flex items-center gap-x-6 h-full justify-end">
            <div className="flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/search"
                scroll={false}
                data-testid="nav-search-link"
              >
                <SearchIcon className="w-6 h-6 text-black stroke-[1.5px]" />
              </LocalizedClientLink>

              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                <UserIcon className="w-6 h-6 text-black stroke-[1.5px]" />
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
                    <ShoppingBagIcon className="w-6 h-6 text-black stroke-[1.5px]" >
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
  const rightImages = [
    '/menu-1.jpg',
    '/menu-2.jpg',
  ]
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button
          className="text-sm capitalize font-sans text-black hidden lg:flex focus:outline-none h-full items-center gap-1 group"
          data-testid="nav-categories-link"
          type="button"
        >
          <span className="text-sm capitalize font-sans text-black hidden lg:inline">Catégories</span>
          <ChevronDown
            className="w-[14px] h-[14px] text-black transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="p-0 w-screen shadow-lg border-none bg-gray-50/90 backdrop-blur-lg max-h-[336px] overflow-hidden">
        <div className="flex flex-row w-full max-w-6xl mx-auto py-10 px-8 gap-12">
          {/* Left column: categories list */}
          <div className="flex-1 min-w-[220px]">
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Catégories</h3>
                <ul className="space-y-3">
                  {topLevelCategories.slice(0, 4).map((category) => (
                    <li key={category.id}>
                      <a
                        href={`/categories/${category.handle}`}
                        className="text-lg hover:underline transition-colors"
                      >
                        {category.name}
                      </a>
                    </li>
                  ))}
                  {topLevelCategories.length > 4 && (
                    <li>
                      <InteractiveLink className="w-fit" href="/categories">
                        {'Voir tout'.toLocaleUpperCase()} 
                      </InteractiveLink>
                    </li>
                  )}
                </ul>
            </div>
          </div>
          {/* Right column: images */}
          <div className="flex flex-row gap-8 items-start">
            {rightImages.map((src, idx) => (
              <Image
                key={idx}
                src={src}
                alt={`Showcase ${idx + 1}`}
                width={256}
                height={256}
                className="w-64 h-64 object-cover rounded-2xl shadow-md bg-white"
              />
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

const CollectionsHoverCard = ({ collections }: { collections: HttpTypes.StoreCollection[] }) => {
  const rightImages = [
    '/menu-3.jpg',
    '/menu-4.jpg',
  ]
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button
          className="text-sm capitalize font-sans text-black hidden lg:flex focus:outline-none h-full items-center gap-1 group"
          data-testid="nav-collections-link"
          type="button"
        >
          <span className="text-sm capitalize font-sans text-black hidden lg:inline">Collections</span>
          <ChevronDown
            className="w-[14px] h-[14px] text-black transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="p-0 w-screen shadow-lg border-none bg-gray-50/90 backdrop-blur-lg max-h-[336px] overflow-hidden">
        <div className="flex flex-row w-full max-w-6xl mx-auto py-10 px-8 gap-12">
          {/* Left column: collections list */}
          <div className="flex-1 min-w-[220px]">
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Collections</h3>
                <ul className="space-y-3">
                  {collections.slice(0, 4).map((collection) => (
                    <li key={collection.id}>
                      <a
                        href={`/collections/${collection.handle}`}
                        className="text-lg hover:underline transition-colors"
                      >
                        {collection.title}
                      </a>
                    </li>
                  ))}
                  {collections.length > 4 && (
                    <li>
                      <InteractiveLink className="w-fit" href="/collections">
                        {'Voir tout'.toLocaleUpperCase()} 
                      </InteractiveLink>
                    </li>
                  )}
                </ul>
            </div>
          </div>
          {/* Right column: images */}
          <div className="flex flex-row gap-8 items-start">
            {rightImages.map((src, idx) => (
              <Image
                key={idx}
                src={src}
                alt={`Showcase ${idx + 1}`}
                width={256}
                height={256}
                className="w-64 h-64 object-cover rounded-2xl shadow-md bg-white"
              />
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

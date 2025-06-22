import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { Badge, SearchIcon, ShoppingBagIcon, UserIcon } from "lucide-react"
import SideMenuDrawer from "@modules/layout/components/side-menu-drawer"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-[67px] mx-auto border-b duration-200 bg-black border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              {/* <SideMenu regions={regions} /> */}
              <SideMenuDrawer regions={regions} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              Manzili Store
            </LocalizedClientLink>
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
                    <Badge className="flex items-center justify-center bg-[#b1b1b1] text-black w-[14px] h-[14px] p-0 rounded-full font-mono tabular-nums absolute top-[-4px] right-[-4px]">
                      0
                    </Badge>
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

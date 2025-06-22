"use client"

import { clx, useToggleState } from "@medusajs/ui"
import { useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"
import { ArrowRightIcon, MenuIcon, XIcon } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"

const SideMenuItems = {
  Home: "/",
  Store: "/store",
  Search: "/search",
  Account: "/account",
  Cart: "/cart",
}

const SideMenuDrawer = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger>
            <MenuIcon className="lg:hidden w-6 h-6 text-white" />
          </DrawerTrigger>
          <DrawerContent className="h-full bg-white w-3/4">
            {/* <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>This action cannot be undone.</DrawerDescription>
            </DrawerHeader> */}
            <div
              data-testid="nav-menu-popup"
              className="flex flex-col h-full rounded-rounded justify-between p-6"
            >
              <div className="flex justify-end" id="xmark">
                <button data-testid="close-menu-button" onClick={() => setIsOpen(false)}>
                  <XIcon />
                </button>
              </div>
              <ul className="flex flex-col gap-6 items-start justify-start">
                {Object.entries(SideMenuItems).map(([name, href]) => {
                  return (
                    <li key={name}>
                      <LocalizedClientLink
                        href={href}
                        className="text-3xl leading-10 hover:text-ui-fg-disabled"
                        onClick={() => setIsOpen(false)}
                        data-testid={`${name.toLowerCase()}-link`}
                      >
                        {name}
                      </LocalizedClientLink>
                    </li>
                  )
                })}
              </ul>
              <div className="flex flex-col gap-y-6">
                <div
                  className="flex justify-between"
                  onMouseEnter={toggleState.open}
                  onMouseLeave={toggleState.close}
                >
                  {regions && (
                    <CountrySelect
                      toggleState={toggleState}
                      regions={regions}
                    />
                  )}
                  <ArrowRightIcon
                    className={clx(
                      "transition-transform duration-150",
                      toggleState.state ? "-rotate-90" : ""
                    )}
                  />
                </div>
              </div>
            </div>
            {/* <DrawerFooter>
              <button>Submit</button>
              <DrawerClose>
                <button>Cancel</button>
              </DrawerClose>
            </DrawerFooter> */}
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}

export default SideMenuDrawer

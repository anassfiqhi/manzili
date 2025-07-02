"use client"

import { clx, useToggleState } from "@medusajs/ui"
import { useState, useEffect } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"
import { ArrowRightIcon, MenuIcon, XIcon } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { listCategories } from "@lib/data/categories"
import { getCollectionsList } from "@lib/data/collections"

const SideMenuItems = {
  Home: "/",
  Store: "/store",
  Categories: "/categories",
  Collections: "/collections",
  Search: "/search",
  Account: "/account",
  Cart: "/cart",
}

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const cats = await listCategories();
        setCategories(cats || []);
        const { collections: cols } = await getCollectionsList(0, 100);
        setCollections(cols || []);
      } catch (e) {
        // handle error
      }
    }
    if (isOpen) fetchData();
  }, [isOpen]);

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger>
            <MenuIcon className="lg:hidden w-6 h-6 text-white" />
          </DrawerTrigger>
          <DrawerContent className="h-full bg-white w-3/4">
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
                  if (name === "Categories") {
                    if (categories.length === 0) {
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
                    }
                    return (
                      <li key={name} className="w-full">
                        <Accordion type="single" collapsible>
                          <AccordionItem value="categories" className="border-b-0">
                            <AccordionTrigger className="p-0">
                              <button
                                type="button"
                                className="text-3xl leading-10 hover:text-ui-fg-disabled flex w-full items-center justify-between bg-transparent border-0 p-0 cursor-pointer"
                                tabIndex={0}
                              >
                                <LocalizedClientLink
                                  href="/categories"
                                  className="hover:text-ui-fg-disabled no-underline font-normal"
                                  data-testid="categories-link"
                                >
                                  Categories
                                </LocalizedClientLink>
                              </button>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="pt-4 pl-4 flex flex-col gap-2">
                                {categories.map((cat) => (
                                  <li key={cat.id}>
                                    <LocalizedClientLink
                                      href={`/categories/${cat.handle}`}
                                      className="text-lg leading-8 hover:text-ui-fg-disabled"
                                      onClick={() => setIsOpen(false)}
                                    >
                                      {cat.name}
                                    </LocalizedClientLink>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </li>
                    )
                  }
                  if (name === "Collections") {
                    if (collections.length === 0) {
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
                    }
                    return (
                      <li key={name} className="w-full">
                        <Accordion type="single" collapsible>
                          <AccordionItem value="collections" className="border-b-0">
                            <AccordionTrigger className="p-0">
                              <button
                                type="button"
                                className="text-3xl leading-10 hover:text-ui-fg-disabled flex w-full items-center justify-between bg-transparent border-0 p-0 cursor-pointer"
                                tabIndex={0}
                              >
                                <LocalizedClientLink
                                  href="/collections"
                                  className="hover:text-ui-fg-disabled no-underline font-normal"
                                  data-testid="collections-link"
                                >
                                  Collections
                                </LocalizedClientLink>
                              </button>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="pt-4 pl-4 flex flex-col gap-2">
                                {collections.map((col) => (
                                  <li key={col.id}>
                                    <LocalizedClientLink
                                      href={`/collections/${col.handle}`}
                                      className="text-lg leading-8 hover:text-ui-fg-disabled"
                                      onClick={() => setIsOpen(false)}
                                    >
                                      {col.title}
                                    </LocalizedClientLink>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </li>
                    )
                  }
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
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}

export default SideMenu

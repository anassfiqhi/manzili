import { Module } from "@medusajs/framework/utils"
import CategoryMediaService from "./service"

export const CATEGORY_MEDIA_MODULE = "categoryMediaService"

export default Module(CATEGORY_MEDIA_MODULE, {
  service: CategoryMediaService,
})

export * from "./models/category-media"
export * from "./service"
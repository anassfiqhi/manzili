import { Module } from "@medusajs/framework/utils"
import CarouselService from "./service"

export const CAROUSEL_MODULE = "carouselService"

export default Module(CAROUSEL_MODULE, {
  service: CarouselService,
})

export * from "./models/carousel"
export * from "./service"
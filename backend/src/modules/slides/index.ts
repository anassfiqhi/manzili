import { Module } from "@medusajs/framework/utils"
import SlidesService from "./service"

export const SLIDES_MODULE = "slidesModuleService"

export default Module(SLIDES_MODULE, {
  service: SlidesService,
})
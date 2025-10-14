import { model } from "@medusajs/framework/utils"

export const CarouselSlideMedia = model.define("carousel_slide_media", {
  id: model.id({ prefix: "slidemedia" }).primaryKey(),
  slide_id: model.text(),
  file_id: model.text().nullable(),
  url: model.text(),
  alt_text: model.text().nullable(),
  mime_type: model.text().nullable(),
  size: model.bigNumber().nullable(),
  width: model.number().nullable(),
  height: model.number().nullable(),
  order: model.number().default(0),
  is_thumbnail: model.boolean().default(false),
})

export default CarouselSlideMedia
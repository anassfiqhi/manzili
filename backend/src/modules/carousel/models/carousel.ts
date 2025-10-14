import { model } from "@medusajs/framework/utils"

export const Carousel = model.define("carousel", {
  id: model.id({ prefix: "carousel" }).primaryKey(),
  title: model.text(),
  handle: model.text().nullable(),
  description: model.text().nullable(),
  is_active: model.boolean().default(true),
  
  // Metadata field for custom data
  metadata: model.json().nullable(),
})

export default Carousel
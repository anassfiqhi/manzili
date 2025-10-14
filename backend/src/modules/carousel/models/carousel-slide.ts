import { model } from "@medusajs/framework/utils"

export const CarouselSlide = model.define("carousel_slide", {
  id: model.id({ prefix: "slide" }).primaryKey(),
  
  // Relationship to parent carousel
  carousel_id: model.text(),
  
  // Core slide content
  title: model.text(),
  description: model.text().nullable(),
  
  
  // Buttons
  primary_button_text: model.text().nullable(),
  primary_button_url: model.text().nullable(),
  secondary_button_text: model.text().nullable(),
  secondary_button_url: model.text().nullable(),
  
  // Organization
  rank: model.number().default(0),
  is_active: model.boolean().default(true),
  
  // Metadata for custom data
  metadata: model.json().nullable(),
})

export default CarouselSlide
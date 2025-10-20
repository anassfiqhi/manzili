import { model } from "@medusajs/framework/utils"

export const Slide = model.define("slide", {
  id: model.id({ prefix: "slide" }).primaryKey(),
  
  // Core slide content
  title: model.text(),
  description: model.text().nullable(),
  
  // Primary button
  primary_button_text: model.text().nullable(),
  primary_button_url: model.text().nullable(),
  primary_button_active: model.boolean().default(true),
  
  // Secondary button
  secondary_button_text: model.text().nullable(),
  secondary_button_url: model.text().nullable(),
  secondary_button_active: model.boolean().default(true),
  
  // Organization and display
  rank: model.number().default(0),
  is_active: model.boolean().default(true),
  
  // Media fields (like products)
  media: model.json().nullable(),
  thumbnail: model.text().nullable(),
  
  // Metadata for custom data
  metadata: model.json().nullable(),
})

export default Slide
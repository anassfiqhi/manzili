import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAROUSEL_MODULE } from "../../../modules/carousel"
import CarouselService from "../../../modules/carousel/service"

// GET /store/carousel
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService

  try {
    // Only return active carousels for the store
    const carousels = await carouselService.listActiveCarousels(undefined, false)
    
    res.json({
      carousels: carousels.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image_url: item.image_url,
        alt_text: item.alt_text,
        order: item.order,
        primary_button_text: item.primary_button_text,
        primary_button_url: item.primary_button_url,
        secondary_button_text: item.secondary_button_text,
        secondary_button_url: item.secondary_button_url,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }))
    })
  } catch (error) {
    console.error("Error fetching carousels:", error)
    res.status(500).json({ error: "Failed to fetch carousels" })
  }
}
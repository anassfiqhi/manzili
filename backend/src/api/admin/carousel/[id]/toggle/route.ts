import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAROUSEL_MODULE } from "../../../../../modules/carousel"
import CarouselService from "../../../../../modules/carousel/service"

// POST /admin/carousel/:id/toggle
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: "Carousel ID is required" })
  }

  try {
    const carousel = await carouselService.toggleCarouselStatus(id)
    
    res.json({
      carousel: {
        id: carousel.id,
        title: carousel.title,
        description: carousel.description,
        image_url: carousel.image_url,
        alt_text: carousel.alt_text,
        order: carousel.order,
        is_active: carousel.is_active,
        primary_button_text: carousel.primary_button_text,
        primary_button_url: carousel.primary_button_url,
        secondary_button_text: carousel.secondary_button_text,
        secondary_button_url: carousel.secondary_button_url,
        created_at: carousel.created_at,
        updated_at: carousel.updated_at,
      }
    })
  } catch (error) {
    console.error("Error toggling carousel status:", error)
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: "Failed to toggle carousel status" })
    }
  }
}
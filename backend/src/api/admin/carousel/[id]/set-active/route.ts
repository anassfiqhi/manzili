import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAROUSEL_MODULE } from "../../../../../modules/carousel"
import CarouselService from "../../../../../modules/carousel/service"

// POST /admin/carousel/:id/set-active
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  const { id } = req.params

  try {
    const carousel = await carouselService.setCarouselActive(id)
    
    res.json({
      carousel: {
        id: carousel.id,
        title: carousel.title,
        handle: carousel.handle,
        description: carousel.description,
        is_active: carousel.is_active,
        metadata: carousel.metadata,
        created_at: carousel.created_at,
        updated_at: carousel.updated_at,
      }
    })
  } catch (error) {
    console.error("Error setting carousel as active:", error)
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: "Failed to set carousel as active" })
    }
  }
}
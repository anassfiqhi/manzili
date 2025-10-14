import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAROUSEL_MODULE } from "../../../../modules/carousel"
import CarouselService from "../../../../modules/carousel/service"

// GET /store/carousel/active
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService

  try {
    const carousel = await carouselService.getActiveCarousel()
    
    if (!carousel) {
      return res.status(404).json({ error: "No active carousel found" })
    }
    
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
    console.error("Error fetching active carousel:", error)
    res.status(500).json({ error: "Failed to fetch active carousel" })
  }
}
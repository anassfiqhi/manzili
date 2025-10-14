import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAROUSEL_MODULE } from "../../../../../../modules/carousel"
import CarouselService from "../../../../../../modules/carousel/service"

// POST /admin/slides/:id/media/cleanup
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  const { id: slideId } = req.params

  try {
    // Delete all media for this slide
    await carouselService.deleteAllSlideMedia(slideId, { container: req.scope })
    
    res.json({
      success: true,
      message: "All slide media deleted successfully"
    })
  } catch (error) {
    console.error("Error cleaning up slide media:", error)
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: "Failed to clean up slide media" })
    }
  }
}
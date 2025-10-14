import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAROUSEL_MODULE } from "../../../modules/carousel"
import CarouselService from "../../../modules/carousel/service"

// GET /store/carousel
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService

  try {
    // Only return active carousels for the store
    const carousels = await carouselService.listAllCarousels({ include_inactive: false })
    
    res.json({
      carousels: carousels.map(item => ({
        id: item.id,
        title: item.title,
        handle: item.handle,
        description: item.description,
        is_active: item.is_active,
        metadata: item.metadata,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }))
    })
  } catch (error) {
    console.error("Error fetching carousels:", error)
    res.status(500).json({ error: "Failed to fetch carousels" })
  }
}
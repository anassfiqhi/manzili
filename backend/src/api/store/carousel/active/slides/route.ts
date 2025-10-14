import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAROUSEL_MODULE } from "../../../../../modules/carousel"
import CarouselService from "../../../../../modules/carousel/service"

// GET /store/carousel/active/slides
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService

  try {
    const result = await carouselService.getActiveCarouselWithSlides()
    
    if (!result) {
      return res.status(404).json({ error: "No active carousel found" })
    }
    
    res.json({
      carousel: {
        id: result.carousel.id,
        title: result.carousel.title,
        handle: result.carousel.handle,
        description: result.carousel.description,
        is_active: result.carousel.is_active,
        metadata: result.carousel.metadata,
        created_at: result.carousel.created_at,
        updated_at: result.carousel.updated_at,
      },
      slides: result.slides.map(slide => ({
        id: slide.id,
        carousel_id: slide.carousel_id,
        title: slide.title,
        description: slide.description,
        primary_button_text: slide.primary_button_text,
        primary_button_url: slide.primary_button_url,
        secondary_button_text: slide.secondary_button_text,
        secondary_button_url: slide.secondary_button_url,
        rank: slide.rank,
        is_active: slide.is_active,
        metadata: slide.metadata,
        created_at: slide.created_at,
        updated_at: slide.updated_at,
      }))
    })
  } catch (error) {
    console.error("Error fetching active carousel with slides:", error)
    res.status(500).json({ error: "Failed to fetch active carousel with slides" })
  }
}
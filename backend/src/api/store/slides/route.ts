import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAROUSEL_MODULE } from "../../../modules/carousel"
import CarouselService from "../../../modules/carousel/service"

interface SlideListQuery {
  limit?: number
  offset?: number
}

// GET /store/slides - List active slides for public display
export const GET = async (req: MedusaRequest<SlideListQuery>, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService

  try {
    const { limit = 20, offset = 0 } = req.query || {}

    // Only return active slides for store
    const slides = await carouselService.listSlides(
      { include_inactive: false },
      { take: limit, skip: offset }
    )

    const transformedSlides = slides.map((item: any) => ({
      id: item.id,
      carousel_id: item.carousel_id,
      title: item.title,
      description: item.description,
      primary_button_text: item.primary_button_text,
      primary_button_url: item.primary_button_url,
      secondary_button_text: item.secondary_button_text,
      secondary_button_url: item.secondary_button_url,
      rank: item.rank,
      is_active: item.is_active,
      metadata: item.metadata,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }))

    res.json({
      slides: transformedSlides,
      count: slides.length,
      offset,
      limit,
    })
  } catch (error: any) {
    console.error("Error listing store slides:", error)
    res.status(500).json({ error: "Failed to list slides" })
  }
}
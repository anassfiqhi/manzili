import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CarouselSlideService from "../../../modules/carousel-slide/service"

interface SlideListQuery {
  limit?: number
  offset?: number
}

// GET /store/slides - List active slides for public display
export const GET = async (req: MedusaRequest<SlideListQuery>, res: MedusaResponse) => {
  const slideService: CarouselSlideService = req.scope.resolve("carouselSlideService")

  try {
    const { limit = 20, offset = 0 } = req.query || {}

    // Only return active slides for store
    const slides = await slideService.listSlides(
      { include_inactive: false },
      { take: limit, skip: offset }
    )

    const transformedSlides = slides.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      alt_text: item.alt_text,
      primary_button_text: item.primary_button_text,
      primary_button_url: item.primary_button_url,
      secondary_button_text: item.secondary_button_text,
      secondary_button_url: item.secondary_button_url,
      rank: item.rank,
      metadata: item.metadata,
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
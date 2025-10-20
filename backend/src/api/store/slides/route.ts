import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SLIDES_MODULE } from "../../../modules/slides"
import SlidesService from "../../../modules/slides/service"

interface SlideListQuery {
  limit?: number
  offset?: number
}

// GET /store/slides - List active slides for public display
export const GET = async (req: MedusaRequest<SlideListQuery>, res: MedusaResponse) => {
  const slidesService = req.scope.resolve(SLIDES_MODULE) as SlidesService

  try {
    const { limit = 20, offset = 0 } = req.query || {}

    console.log("=== STORE SLIDES API CALLED ===")
    console.log("limit:", limit, "offset:", offset)

    // Only return active slides for store
    const slides = await slidesService.listSlidesCustom({ include_inactive: false })
    
    // Apply pagination
    const startIndex = Number(offset) || 0
    const limitNumber = Number(limit) || 20
    const paginatedSlides = slides.slice(startIndex, startIndex + limitNumber)

    const transformedSlides = paginatedSlides.map((slide: any) => ({
      id: slide.id,
      title: slide.title,
      description: slide.description,
      primary_button_text: slide.primary_button_text,
      primary_button_url: slide.primary_button_url,
      primary_button_active: slide.primary_button_active,
      secondary_button_text: slide.secondary_button_text,
      secondary_button_url: slide.secondary_button_url,
      secondary_button_active: slide.secondary_button_active,
      rank: slide.rank,
      is_active: slide.is_active,
      metadata: slide.metadata,
      // Include media with proper structure
      media: slide.media || [],
      thumbnail: slide.thumbnail || null,
      order: slide.rank, // Map rank to order for compatibility
      created_at: slide.created_at,
      updated_at: slide.updated_at,
    }))

    console.log("Store slides response:", {
      count: transformedSlides.length,
      total: slides.length,
      slides: transformedSlides
    })

    res.json({
      slides: transformedSlides,
      count: transformedSlides.length,
      total: slides.length,
      offset: startIndex,
      limit: limitNumber,
    })
  } catch (error: any) {
    console.error("Error listing store slides:", error)
    res.status(500).json({ error: "Failed to list slides" })
  }
}
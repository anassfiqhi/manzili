import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SLIDES_MODULE } from "../../../../../modules/slides"
import SlidesService from "../../../../../modules/slides/service"

// GET /admin/slides/:id/media - returns slide with images/thumbnail
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const slidesService = req.scope.resolve(SLIDES_MODULE) as SlidesService
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: "Slide ID is required" })
  }

  try {
    const slide = await slidesService.getSlide(id)
    
    res.json({
      slide: {
        id: slide.id,
        media: slide.media || [],
        thumbnail: slide.thumbnail || null,
      }
    })
  } catch (error) {
    console.error("Error fetching slide:", error)
    res.status(500).json({ error: "Failed to fetch slide" })
  }
}

// PUT /admin/slides/:id/media - updates slide images/thumbnail
export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  const slidesService = req.scope.resolve(SLIDES_MODULE) as SlidesService
  const { id } = req.params
  
  if (!id) {
    return res.status(400).json({ error: "Slide ID is required" })
  }

  try {
    const { media, thumbnail } = req.body as { media?: any[], thumbnail?: string }
    
    const updatedSlide = await slidesService.updateSlide(id, {
      media,
      thumbnail,
    })

    res.json({
      slide: {
        id: updatedSlide.id,
        images: updatedSlide.images || [],
        thumbnail: updatedSlide.thumbnail || null,
      }
    })
  } catch (error) {
    console.error("Error updating slide media:", error)
    res.status(500).json({ error: "Failed to update slide media" })
  }
}
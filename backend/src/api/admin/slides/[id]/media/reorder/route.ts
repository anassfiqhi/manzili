import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAROUSEL_MODULE } from "../../../../../../modules/carousel"
import CarouselService from "../../../../../../modules/carousel/service"

interface ReorderSlideMediaRequest {
  media_ids: string[]
}

// POST /admin/slides/:id/media/reorder
export const POST = async (req: MedusaRequest<ReorderSlideMediaRequest>, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  const { id: slideId } = req.params
  
  let parsedBody: ReorderSlideMediaRequest
  
  try {
    if (req.body && typeof req.body === 'object') {
      parsedBody = req.body as ReorderSlideMediaRequest
    } else {
      let rawBody: string = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {})
      
      if (rawBody.startsWith('"') && rawBody.endsWith('"')) {
        rawBody = rawBody.slice(1, -1).replace(/\\"/g, '"')
      }
      
      parsedBody = JSON.parse(rawBody)
    }
  } catch (parseError) {
    console.error("JSON parsing error:", parseError)
    return res.status(400).json({ error: "Invalid JSON in request body" })
  }

  const { media_ids } = parsedBody

  if (!media_ids || !Array.isArray(media_ids)) {
    return res.status(400).json({ error: "media_ids array is required" })
  }

  try {
    await carouselService.reorderSlideMedia(slideId, media_ids)
    res.json({ message: "Slide media reordered successfully" })
  } catch (error) {
    console.error("Error reordering slide media:", error)
    res.status(500).json({ error: "Failed to reorder slide media" })
  }
}
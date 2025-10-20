import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SLIDES_MODULE } from "../../../../modules/slides"
import SlidesService from "../../../../modules/slides/service"

interface ReorderSlidesRequest {
  slide_ids: string[]
}

// POST /admin/slides/reorder
export const POST = async (req: MedusaRequest<ReorderSlidesRequest>, res: MedusaResponse) => {
  const slidesService = req.scope.resolve(SLIDES_MODULE) as SlidesService
  
  let parsedBody: ReorderSlidesRequest
  
  try {
    if (req.body && typeof req.body === 'object') {
      parsedBody = req.body as ReorderSlidesRequest
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

  const { slide_ids } = parsedBody

  if (!slide_ids || !Array.isArray(slide_ids)) {
    return res.status(400).json({ error: "slide_ids array is required" })
  }

  try {
    await slidesService.reorderSlides(slide_ids)
    res.json({ message: "Slides reordered successfully" })
  } catch (error) {
    console.error("Error reordering slides:", error)
    res.status(500).json({ error: "Failed to reorder slides" })
  }
}
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SLIDES_MODULE } from "../../../../modules/slides"
import SlidesService from "../../../../modules/slides/service"

interface UpdateSlideRequest {
  title?: string
  description?: string
  primary_button_text?: string
  primary_button_url?: string
  primary_button_active?: boolean
  secondary_button_text?: string
  secondary_button_url?: string
  secondary_button_active?: boolean
  rank?: number
  is_active?: boolean
  media?: Array<{ id?: string; url: string }>
  thumbnail?: string | null
  metadata?: any
}

// GET /admin/slides/[id]
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const slidesService = req.scope.resolve(SLIDES_MODULE) as SlidesService
  const { id } = req.params

  try {
    const slide = await slidesService.getSlide(id)
    
    res.json({
      slide: {
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
        media: slide.media || [],
        thumbnail: slide.thumbnail || null,
        created_at: slide.created_at,
        updated_at: slide.updated_at,
      }
    })
  } catch (error) {
    console.error("Error fetching slide:", error)
    res.status(404).json({ error: "Slide not found" })
  }
}

// PUT /admin/slides/[id]
export const PUT = async (req: MedusaRequest<UpdateSlideRequest>, res: MedusaResponse) => {
  const slidesService = req.scope.resolve(SLIDES_MODULE) as SlidesService
  const { id } = req.params
  
  let parsedBody: UpdateSlideRequest
  
  try {
    if (req.body && typeof req.body === 'object') {
      parsedBody = req.body as UpdateSlideRequest
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

  try {
    const slide = await slidesService.updateSlide(id, parsedBody)

    res.json({
      slide: {
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
        media: slide.media || [],
        thumbnail: slide.thumbnail || null,
        created_at: slide.created_at,
        updated_at: slide.updated_at,
      }
    })
  } catch (error) {
    console.error("Error updating slide:", error)
    res.status(500).json({ error: "Failed to update slide" })
  }
}

// DELETE /admin/slides/[id]
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const slidesService = req.scope.resolve(SLIDES_MODULE) as SlidesService
  const { id } = req.params

  try {
    const result = await slidesService.deleteSlide(id)
    res.json(result)
  } catch (error) {
    console.error("Error deleting slide:", error)
    res.status(500).json({ error: "Failed to delete slide" })
  }
}
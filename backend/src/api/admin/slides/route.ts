import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SLIDES_MODULE } from "../../../modules/slides"
import SlidesService from "../../../modules/slides/service"

interface CreateSlideRequest {
  title: string
  description?: string
  primary_button_text?: string
  primary_button_url?: string
  primary_button_active?: boolean
  secondary_button_text?: string
  secondary_button_url?: string
  secondary_button_active?: boolean
  rank?: number
  is_active?: boolean
  metadata?: any
}

// GET /admin/slides
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const slidesService = req.scope.resolve(SLIDES_MODULE) as SlidesService
  const includeInactive = req.query.include_inactive === 'true'

  console.log("=== SLIDES LIST API CALLED ===")
  console.log("includeInactive:", includeInactive)
  console.log("req.query:", req.query)

  try {
    console.log("Calling slidesService.listSlidesCustom...")
    const slides = await slidesService.listSlidesCustom({ include_inactive: includeInactive })
    console.log("slides returned from service:", slides)
    
    res.json({
      slides: slides.map(slide => ({
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
      })),
      count: slides.length
    })
  } catch (error) {
    console.error("Error fetching slides:", error)
    res.status(500).json({ error: "Failed to fetch slides" })
  }
}

// POST /admin/slides
export const POST = async (req: MedusaRequest<CreateSlideRequest>, res: MedusaResponse) => {
  const slidesService = req.scope.resolve(SLIDES_MODULE) as SlidesService
  
  let parsedBody: CreateSlideRequest
  
  try {
    if (req.body && typeof req.body === 'object') {
      parsedBody = req.body as CreateSlideRequest
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
  
  const { 
    title,
    description, 
    primary_button_text,
    primary_button_url,
    primary_button_active,
    secondary_button_text,
    secondary_button_url,
    secondary_button_active,
    rank,
    is_active,
    metadata
  } = parsedBody

  if (!title) {
    return res.status(400).json({ error: "Title is required" })
  }

  try {
    const slide = await slidesService.createSlide({
      title,
      description,
      primary_button_text,
      primary_button_url,
      primary_button_active,
      secondary_button_text,
      secondary_button_url,
      secondary_button_active,
      rank,
      is_active,
      metadata,
    })

    res.status(201).json({
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
        created_at: slide.created_at,
        updated_at: slide.updated_at,
      }
    })
  } catch (error) {
    console.error("Error creating slide:", error)
    res.status(500).json({ error: "Failed to create slide" })
  }
}
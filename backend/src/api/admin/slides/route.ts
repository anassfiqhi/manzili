import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAROUSEL_MODULE } from "../../../modules/carousel"
import CarouselService from "../../../modules/carousel/service"

interface CreateSlideRequest {
  carousel_id: string
  title: string
  description?: string
  primary_button_text?: string
  primary_button_url?: string
  secondary_button_text?: string
  secondary_button_url?: string
  rank?: number
  is_active?: boolean
  metadata?: any
}

// GET /admin/slides
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  const includeInactive = req.query.include_inactive === 'true'
  const carouselId = req.query.carousel_id as string

  try {
    let slides
    if (carouselId) {
      slides = await carouselService.getSlidesByCarouselId(carouselId, includeInactive)
    } else {
      slides = await carouselService.listSlides({ include_inactive: includeInactive })
    }
    
    res.json({
      slides: slides.map(item => ({
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
    })
  } catch (error) {
    console.error("Error fetching slides:", error)
    res.status(500).json({ error: "Failed to fetch slides" })
  }
}

// POST /admin/slides
export const POST = async (req: MedusaRequest<CreateSlideRequest>, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  
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
    carousel_id,
    title,
    description, 
    primary_button_text,
    primary_button_url,
    secondary_button_text,
    secondary_button_url,
    rank,
    is_active,
    metadata
  } = parsedBody

  if (!carousel_id) {
    return res.status(400).json({ error: "carousel_id is required" })
  }

  if (!title) {
    return res.status(400).json({ error: "Title is required" })
  }

  try {
    const slide = await carouselService.createSlide({
      carousel_id,
      title,
      description,
      primary_button_text,
      primary_button_url,
      secondary_button_text,
      secondary_button_url,
      rank,
      is_active,
      metadata,
    })

    res.status(201).json({
      slide: {
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
      }
    })
  } catch (error) {
    console.error("Error creating slide:", error)
    res.status(500).json({ error: "Failed to create slide" })
  }
}
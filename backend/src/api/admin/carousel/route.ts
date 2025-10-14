import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAROUSEL_MODULE } from "../../../modules/carousel"
import CarouselService from "../../../modules/carousel/service"

interface CreateCarouselRequest {
  title: string
  handle?: string
  description?: string
  is_active?: boolean
  metadata?: any
}

// GET /admin/carousel
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  const includeInactive = req.query.include_inactive === 'true'

  try {
    const carousels = await carouselService.listCarousels({ include_inactive: includeInactive })
    
    res.json({
      carousels: carousels.map(item => ({
        id: item.id,
        title: item.title,
        handle: item.handle,
        description: item.description,
        is_active: item.is_active,
        metadata: item.metadata,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }))
    })
  } catch (error) {
    console.error("Error fetching carousels:", error)
    res.status(500).json({ error: "Failed to fetch carousels" })
  }
}

// POST /admin/carousel
export const POST = async (req: MedusaRequest<CreateCarouselRequest>, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  
  let parsedBody: CreateCarouselRequest
  
  try {
    // Handle potential JSON parsing issues like in category-media
    if (req.body && typeof req.body === 'object') {
      parsedBody = req.body as CreateCarouselRequest
    } else {
      let rawBody: string = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {})
      
      console.log("Raw body received:", rawBody)
      
      if (rawBody.startsWith('"') && rawBody.endsWith('"')) {
        rawBody = rawBody.slice(1, -1).replace(/\\"/g, '"')
        console.log("Unescaped body:", rawBody)
      }
      
      parsedBody = JSON.parse(rawBody)
      console.log("Parsed body:", parsedBody)
    }
    
  } catch (parseError) {
    console.error("JSON parsing error:", parseError)
    console.error("Request body was:", req.body)
    return res.status(400).json({ error: "Invalid JSON in request body" })
  }
  
  const { 
    title, 
    handle,
    description, 
    is_active,
    metadata
  } = parsedBody

  if (!title) {
    return res.status(400).json({ error: "Title is required" })
  }

  try {
    const carousel = await carouselService.createCarousel({
      title,
      handle,
      description,
      is_active,
      metadata,
    })

    res.status(201).json({
      carousel: {
        id: carousel.id,
        title: carousel.title,
        handle: carousel.handle,
        description: carousel.description,
        is_active: carousel.is_active,
        metadata: carousel.metadata,
        created_at: carousel.created_at,
        updated_at: carousel.updated_at,
      }
    })
  } catch (error) {
    console.error("Error creating carousel:", error)
    res.status(500).json({ error: "Failed to create carousel" })
  }
}
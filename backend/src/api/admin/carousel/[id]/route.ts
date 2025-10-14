import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAROUSEL_MODULE } from "../../../../modules/carousel"
import CarouselService from "../../../../modules/carousel/service"

interface UpdateCarouselRequest {
  title?: string
  handle?: string
  description?: string
  is_active?: boolean
  metadata?: any
}

// GET /admin/carousel/:id
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: "Carousel ID is required" })
  }

  try {
    const carousel = await carouselService.getCarouselById(id)
    
    if (!carousel) {
      return res.status(404).json({ error: "Carousel not found" })
    }
    
    res.json({
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
    console.error("Error fetching carousel:", error)
    res.status(500).json({ error: "Failed to fetch carousel" })
  }
}

// PUT /admin/carousel/:id
export const PUT = async (req: MedusaRequest<UpdateCarouselRequest>, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  const { id } = req.params
  
  // Handle potential JSON parsing issues
  let parsedBody: UpdateCarouselRequest
  try {
    if (typeof req.body === 'string') {
      let bodyStr: string = req.body
      if (bodyStr.startsWith('"') && bodyStr.endsWith('"')) {
        bodyStr = bodyStr.slice(1, -1).replace(/\\"/g, '"')
      }
      parsedBody = JSON.parse(bodyStr)
    } else {
      parsedBody = req.body as UpdateCarouselRequest
    }
  } catch (parseError) {
    console.error("JSON parsing error:", parseError)
    return res.status(400).json({ error: "Invalid JSON in request body" })
  }
  
  const { 
    title, 
    handle,
    description, 
    is_active,
    metadata
  } = parsedBody

  if (!id) {
    return res.status(400).json({ error: "Carousel ID is required" })
  }


  try {
    const carousel = await carouselService.updateCarousel(id, {
      title,
      handle,
      description,
      is_active,
      metadata,
    })

    res.json({
      carousel: {
        id: carousel.id,
        title: carousel.title,
        description: carousel.description,
        image_url: carousel.image_url,
        alt_text: carousel.alt_text,
        order: carousel.order,
        is_active: carousel.is_active,
        primary_button_text: carousel.primary_button_text,
        primary_button_url: carousel.primary_button_url,
        secondary_button_text: carousel.secondary_button_text,
        secondary_button_url: carousel.secondary_button_url,
        created_at: carousel.created_at,
        updated_at: carousel.updated_at,
      }
    })
    res.json({
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
    console.error("Error updating carousel:", error)
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: "Failed to update carousel" })
    }
  }
}

// DELETE /admin/carousel/:id
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: "Carousel ID is required" })
  }

  try {
    // Pass the request scope container to the service for file deletion
    const context = { container: req.scope }
    await carouselService.deleteCarousel(id, context)
    
    res.json({
      id: id,
      deleted: true
    })
  } catch (error) {
    console.error("Error deleting carousel:", error)
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: "Failed to delete carousel" })
    }
  }
}
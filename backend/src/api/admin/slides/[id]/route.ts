import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAROUSEL_MODULE } from "../../../../modules/carousel"
import CarouselService from "../../../../modules/carousel/service"

interface UpdateSlideRequest {
  title?: string
  description?: string
  primary_button_text?: string
  primary_button_url?: string
  secondary_button_text?: string
  secondary_button_url?: string
  rank?: number
  is_active?: boolean
  metadata?: any
}

// GET /admin/slides/:id
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  const { id } = req.params

  try {
    const slide = await carouselService.getSlideById(id)
    
    if (!slide) {
      return res.status(404).json({ error: "Slide not found" })
    }

    res.json({
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
    console.error("Error fetching slide:", error)
    res.status(500).json({ error: "Failed to fetch slide" })
  }
}

// PATCH /admin/slides/:id
export const PATCH = async (req: MedusaRequest<UpdateSlideRequest>, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  const { id } = req.params

  try {
    const updatedSlide = await carouselService.updateSlide(id, req.body)

    res.json({
      slide: {
        id: updatedSlide.id,
        carousel_id: updatedSlide.carousel_id,
        title: updatedSlide.title,
        description: updatedSlide.description,
        primary_button_text: updatedSlide.primary_button_text,
        primary_button_url: updatedSlide.primary_button_url,
        secondary_button_text: updatedSlide.secondary_button_text,
        secondary_button_url: updatedSlide.secondary_button_url,
        rank: updatedSlide.rank,
        is_active: updatedSlide.is_active,
        metadata: updatedSlide.metadata,
        created_at: updatedSlide.created_at,
        updated_at: updatedSlide.updated_at,
      }
    })
  } catch (error) {
    console.error("Error updating slide:", error)
    res.status(500).json({ error: "Failed to update slide" })
  }
}

// DELETE /admin/slides/:id
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  const { id } = req.params

  try {
    await carouselService.deleteSlide(id)
    res.status(204).send()
  } catch (error) {
    console.error("Error deleting slide:", error)
    res.status(500).json({ error: "Failed to delete slide" })
  }
}
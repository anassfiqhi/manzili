import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAROUSEL_MODULE } from "../../../../../../modules/carousel"
import CarouselService from "../../../../../../modules/carousel/service"

interface UpdateSlideMediaRequest {
  alt_text?: string
  order?: number
  is_thumbnail?: boolean
}

// PATCH /admin/slides/:id/media/:media_id
export const PATCH = async (req: MedusaRequest<UpdateSlideMediaRequest>, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  const { media_id } = req.params

  try {
    const updatedMedia = await carouselService.updateSlideMedia(media_id, req.body)

    res.json({
      media: {
        id: updatedMedia.id,
        slide_id: updatedMedia.slide_id,
        file_id: updatedMedia.file_id,
        url: updatedMedia.url,
        alt_text: updatedMedia.alt_text,
        mime_type: updatedMedia.mime_type,
        size: updatedMedia.size,
        width: updatedMedia.width,
        height: updatedMedia.height,
        order: updatedMedia.order,
        is_thumbnail: updatedMedia.is_thumbnail,
        created_at: updatedMedia.created_at,
        updated_at: updatedMedia.updated_at,
      }
    })
  } catch (error) {
    console.error("Error updating slide media:", error)
    res.status(500).json({ error: "Failed to update slide media" })
  }
}

// DELETE /admin/slides/:id/media/:media_id
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  const { media_id } = req.params

  try {
    await carouselService.deleteSlideMedia(media_id)
    res.status(204).send()
  } catch (error) {
    console.error("Error deleting slide media:", error)
    res.status(500).json({ error: "Failed to delete slide media" })
  }
}
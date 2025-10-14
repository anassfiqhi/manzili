import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAROUSEL_MODULE } from "../../../../../../../modules/carousel"
import CarouselService from "../../../../../../../modules/carousel/service"

// POST /admin/slides/:id/media/:media_id/thumbnail
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  const { id: slideId, media_id } = req.params

  try {
    const media = await carouselService.setSlideMediaThumbnail(slideId, media_id)

    res.json({
      media: {
        id: media.id,
        slide_id: media.slide_id,
        file_id: media.file_id,
        url: media.url,
        alt_text: media.alt_text,
        mime_type: media.mime_type,
        size: media.size,
        width: media.width,
        height: media.height,
        order: media.order,
        is_thumbnail: media.is_thumbnail,
        created_at: media.created_at,
        updated_at: media.updated_at,
      }
    })
  } catch (error) {
    console.error("Error setting slide media thumbnail:", error)
    res.status(500).json({ error: "Failed to set slide media thumbnail" })
  }
}
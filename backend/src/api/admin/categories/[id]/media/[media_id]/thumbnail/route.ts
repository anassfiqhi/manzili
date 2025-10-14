import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CATEGORY_MEDIA_MODULE } from "../../../../../../../modules/category-media"
import CategoryMediaService from "../../../../../../../modules/category-media/service"

// POST /admin/categories/:id/media/:media_id/thumbnail
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const categoryMediaService = req.scope.resolve(CATEGORY_MEDIA_MODULE) as CategoryMediaService
  const { id: categoryId, media_id } = req.params

  if (!categoryId) {
    return res.status(400).json({ error: "Category ID is required" })
  }

  if (!media_id) {
    return res.status(400).json({ error: "Media ID is required" })
  }

  try {
    const media = await categoryMediaService.setThumbnail(categoryId, media_id)

    res.json({
      media: {
        id: media.id,
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
    console.error("Error setting thumbnail:", error)
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: "Failed to set thumbnail" })
    }
  }
}
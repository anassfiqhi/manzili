import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CATEGORY_MEDIA_MODULE } from "../../../../../modules/category-media"
import CategoryMediaService from "../../../../../modules/category-media/service"

// GET /store/categories/:id/media
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const categoryMediaService = req.scope.resolve(CATEGORY_MEDIA_MODULE) as CategoryMediaService
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: "Category ID is required" })
  }

  try {
    const media = await categoryMediaService.listCategoryMedia(id)
    
    res.json({
      media: media.map(item => ({
        id: item.id,
        url: item.url,
        alt_text: item.alt_text,
        mime_type: item.mime_type,
        size: item.size,
        width: item.width,
        height: item.height,
        order: item.order,
        is_thumbnail: item.is_thumbnail,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }))
    })
  } catch (error) {
    console.error("Error fetching category media:", error)
    res.status(500).json({ error: "Failed to fetch category media" })
  }
}
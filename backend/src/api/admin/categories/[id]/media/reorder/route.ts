import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CATEGORY_MEDIA_MODULE } from "../../../../../../modules/category-media"
import CategoryMediaService from "../../../../../../modules/category-media/service"

interface ReorderCategoryMediaRequest {
  media_ids: string[]
}

// POST /admin/categories/:id/media/reorder
export const POST = async (req: MedusaRequest<ReorderCategoryMediaRequest>, res: MedusaResponse) => {
  const categoryMediaService = req.scope.resolve(CATEGORY_MEDIA_MODULE) as CategoryMediaService
  const { id } = req.params
  
  // Handle potential JSON parsing issues
  let parsedBody: ReorderCategoryMediaRequest
  try {
    if (typeof req.body === 'string') {
      let bodyStr: string = req.body
      if (bodyStr.startsWith('"') && bodyStr.endsWith('"')) {
        bodyStr = bodyStr.slice(1, -1).replace(/\\"/g, '"')
      }
      parsedBody = JSON.parse(bodyStr)
    } else {
      parsedBody = req.body as ReorderCategoryMediaRequest
    }
  } catch (parseError) {
    console.error("JSON parsing error:", parseError)
    return res.status(400).json({ error: "Invalid JSON in request body" })
  }
  
  const { media_ids } = parsedBody

  if (!id) {
    return res.status(400).json({ error: "Category ID is required" })
  }

  if (!Array.isArray(media_ids)) {
    return res.status(400).json({ error: "media_ids must be an array" })
  }

  if (media_ids.length === 0) {
    return res.status(400).json({ error: "media_ids array cannot be empty" })
  }

  if (!media_ids.every(id => typeof id === 'string')) {
    return res.status(400).json({ error: "All media_ids must be strings" })
  }

  try {
    await categoryMediaService.reorderCategoryMedia(id, media_ids)
    
    const updatedMedia = await categoryMediaService.listCategoryMedia(id)
    
    res.json({
      media: updatedMedia.map(item => ({
        id: item.id,
        url: item.url,
        alt_text: item.alt_text,
        mime_type: item.mime_type,
        size: item.size,
        width: item.width,
        height: item.height,
        order: item.order,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }))
    })
  } catch (error) {
    console.error("Error reordering category media:", error)
    res.status(500).json({ error: "Failed to reorder category media" })
  }
}
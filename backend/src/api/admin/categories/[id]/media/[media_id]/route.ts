import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CATEGORY_MEDIA_MODULE } from "../../../../../../modules/category-media"
import CategoryMediaService from "../../../../../../modules/category-media/service"

interface UpdateCategoryMediaRequest {
  alt_text?: string
  order?: number
  is_thumbnail?: boolean
}

// PUT /admin/categories/:id/media/:media_id
export const PUT = async (req: MedusaRequest<UpdateCategoryMediaRequest>, res: MedusaResponse) => {
  const categoryMediaService = req.scope.resolve(CATEGORY_MEDIA_MODULE) as CategoryMediaService
  const { media_id } = req.params
  
  // Handle potential JSON parsing issues
  let parsedBody: UpdateCategoryMediaRequest
  try {
    if (typeof req.body === 'string') {
      let bodyStr: string = req.body
      if (bodyStr.startsWith('"') && bodyStr.endsWith('"')) {
        bodyStr = bodyStr.slice(1, -1).replace(/\\"/g, '"')
      }
      parsedBody = JSON.parse(bodyStr)
    } else {
      parsedBody = req.body as UpdateCategoryMediaRequest
    }
  } catch (parseError) {
    console.error("JSON parsing error:", parseError)
    return res.status(400).json({ error: "Invalid JSON in request body" })
  }
  
  const { alt_text, order, is_thumbnail } = parsedBody

  if (!media_id) {
    return res.status(400).json({ error: "Media ID is required" })
  }

  if (order !== undefined && (typeof order !== 'number' || order < 0)) {
    return res.status(400).json({ error: "Order must be a non-negative number" })
  }

  try {
    const media = await categoryMediaService.updateCategoryMedia(media_id, {
      alt_text,
      order,
      is_thumbnail,
    })

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
    console.error("Error updating category media:", error)
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: "Failed to update category media" })
    }
  }
}

// DELETE /admin/categories/:id/media/:media_id
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const categoryMediaService = req.scope.resolve(CATEGORY_MEDIA_MODULE) as CategoryMediaService
  const { media_id } = req.params

  if (!media_id) {
    return res.status(400).json({ error: "Media ID is required" })
  }

  try {
    // Pass the request scope container to the service for file deletion
    const context = { container: req.scope }
    await categoryMediaService.deleteCategoryMedia(media_id, context)
    
    res.json({
      id: media_id,
      deleted: true
    })
  } catch (error) {
    console.error("Error deleting category media:", error)
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: "Failed to delete category media" })
    }
  }
}
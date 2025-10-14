import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CATEGORY_MEDIA_MODULE } from "../../../../../modules/category-media"
import CategoryMediaService from "../../../../../modules/category-media/service"

interface CreateCategoryMediaRequest {
  file_id?: string
  url?: string
  alt_text?: string
  mime_type?: string
  size?: number
  width?: number
  height?: number
  order?: number
  is_thumbnail?: boolean
}


// GET /admin/categories/:id/media
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


// POST /admin/categories/:id/media
export const POST = async (req: MedusaRequest<CreateCategoryMediaRequest>, res: MedusaResponse) => {
  const categoryMediaService = req.scope.resolve(CATEGORY_MEDIA_MODULE) as CategoryMediaService
  const { id } = req.params
  
  let parsedBody: CreateCategoryMediaRequest
  
  try {
    // First try to use the existing body
    if (req.body && typeof req.body === 'object') {
      parsedBody = req.body as CreateCategoryMediaRequest
    } else {
      // Handle string body (which might be double-encoded)
      let rawBody: string = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {})
      
      console.log("Raw body received:", rawBody)
      
      // Handle double-quoted JSON strings
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
  
  const { file_id, url, alt_text, mime_type, size, width, height, order, is_thumbnail } = parsedBody

  if (!id) {
    return res.status(400).json({ error: "Category ID is required" })
  }

  if (!file_id && !url) {
    return res.status(400).json({ error: "Either file_id or url is required" })
  }

  // Ensure is_thumbnail is a boolean
  const thumbnailFlag = Boolean(is_thumbnail)

  try {
    const media = await categoryMediaService.createCategoryMedia({
      category_id: id,
      file_id,
      url,
      alt_text,
      mime_type,
      size,
      width,
      height,
      order,
      is_thumbnail: thumbnailFlag,
    })

    res.status(201).json({
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
    console.error("Error creating category media:", error)
    res.status(500).json({ error: "Failed to create category media" })
  }
}
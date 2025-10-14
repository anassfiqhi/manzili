import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAROUSEL_MODULE } from "../../../../../modules/carousel"
import CarouselService from "../../../../../modules/carousel/service"

interface CreateSlideMediaRequest {
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

// GET /admin/slides/:id/media
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  const { id: slideId } = req.params

  try {
    const media = await carouselService.listSlideMedia(slideId)
    
    res.json({
      media: media.map(item => ({
        id: item.id,
        slide_id: item.slide_id,
        file_id: item.file_id,
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
    console.error("Error fetching slide media:", error)
    res.status(500).json({ error: "Failed to fetch slide media" })
  }
}

// POST /admin/slides/:id/media
export const POST = async (req: MedusaRequest<CreateSlideMediaRequest>, res: MedusaResponse) => {
  const carouselService = req.scope.resolve(CAROUSEL_MODULE) as CarouselService
  const { id: slideId } = req.params
  
  let parsedBody: CreateSlideMediaRequest
  
  try {
    if (req.body && typeof req.body === 'object') {
      parsedBody = req.body as CreateSlideMediaRequest
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
    file_id,
    url,
    alt_text,
    mime_type,
    size,
    width,
    height,
    order,
    is_thumbnail
  } = parsedBody

  if (!file_id && !url) {
    return res.status(400).json({ error: "Either file_id or url is required" })
  }

  try {
    const media = await carouselService.createSlideMedia({
      slide_id: slideId,
      file_id,
      url,
      alt_text,
      mime_type,
      size,
      width,
      height,
      order,
      is_thumbnail,
    })

    res.status(201).json({
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
    console.error("Error creating slide media:", error)
    res.status(500).json({ error: "Failed to create slide media" })
  }
}
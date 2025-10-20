import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SLIDES_MODULE } from "../../../../modules/slides"
import SlidesService from "../../../../modules/slides/service"

// GET /store/slides/active - Get all active slides with media for frontend
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const slidesService = req.scope.resolve(SLIDES_MODULE) as SlidesService

  try {
    console.log("=== STORE ACTIVE SLIDES API CALLED ===")

    // Get only active slides
    const slides = await slidesService.listSlidesCustom({ include_inactive: false })
    
    console.log("Active slides found:", slides.length)

    const transformedSlides = slides.map((slide: any) => {
      // Get the display image (thumbnail or first media item)  
      const image_url = getSlideDisplayImageUrl(slide)
      
      return {
        id: slide.id,
        title: slide.title,
        description: slide.description,
        // Image data for carousel display
        image_url,
        alt_text: slide.title,
        // Button data with active states
        primary_button_text: slide.primary_button_active ? slide.primary_button_text : null,
        primary_button_url: slide.primary_button_active ? slide.primary_button_url : null,
        secondary_button_text: slide.secondary_button_active ? slide.secondary_button_text : null,
        secondary_button_url: slide.secondary_button_active ? slide.secondary_button_url : null,
        // Organization
        order: slide.rank,
        rank: slide.rank,
        is_active: slide.is_active,
        metadata: slide.metadata,
        // Full media array and thumbnail for advanced usage
        media: slide.media || [],
        thumbnail: slide.thumbnail || null,
        created_at: slide.created_at,
        updated_at: slide.updated_at,
      }
    })

    // Sort by rank
    transformedSlides.sort((a, b) => a.rank - b.rank)

    console.log("Store active slides response:", {
      count: transformedSlides.length,
      slides: transformedSlides.map(s => ({ 
        id: s.id, 
        title: s.title, 
        has_image: !!s.image_url,
        image_url: s.image_url 
      }))
    })

    res.json({
      slides: transformedSlides,
      count: transformedSlides.length
    })
  } catch (error: any) {
    console.error("Error fetching active slides:", error)
    res.status(500).json({ error: "Failed to fetch active slides" })
  }
}

/**
 * Get the display image URL for a slide using the new media structure
 * Returns thumbnail if available, otherwise first media item URL, or empty string
 */
const getSlideDisplayImageUrl = (slide: any): string => {
  // First try to use thumbnail if available
  if (slide.thumbnail) {
    return slide.thumbnail
  }
  
  // Then try to use first media item
  if (slide.media && slide.media.length > 0) {
    return slide.media[0].url
  }
  
  // Final fallback to empty string
  return ''
}
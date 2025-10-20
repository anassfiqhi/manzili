import { sdk } from "../config"

export interface SlideMedia {
  id: string
  url: string
  alt_text?: string
  rank: number
  isThumbnail: boolean
}

export interface Slide {
  id: string
  title: string
  description?: string
  image_url?: string // Legacy field - will be computed from media/thumbnail
  alt_text?: string
  order: number
  rank: number
  primary_button_text?: string
  primary_button_url?: string
  primary_button_active?: boolean
  secondary_button_text?: string
  secondary_button_url?: string
  secondary_button_active?: boolean
  is_active: boolean
  metadata?: any
  media: Array<{ id: string; url: string }> // Updated to match backend structure
  thumbnail?: string | null
  created_at: string
  updated_at: string
}

export interface SlideListResponse {
  slides: Slide[]
  count: number
  total?: number
  offset?: number
  limit?: number
}

export interface ActiveSlidesResponse {
  slides: Slide[]
  count: number
}

/**
 * Fetch all active slides for the store
 */
export const getActiveSlides = async (): Promise<Slide[]> => {
  try {
    console.log("Fetching active slides from store API")
    const response = await sdk.client.fetch(`/store/slides/active`, {
      method: "GET",
    }) as ActiveSlidesResponse

    console.log("Active slides response:", response)
    return response.slides || []
  } catch (error) {
    console.error("Failed to fetch active slides:", error)
    return []
  }
}

/**
 * Fetch slides with pagination
 */
export const getSlides = async (options: {
  limit?: number
  offset?: number
} = {}): Promise<SlideListResponse> => {
  try {
    const { limit = 20, offset = 0 } = options
    
    console.log("Fetching slides from store API", { limit, offset })
    
    const queryParams = new URLSearchParams()
    if (limit) queryParams.set('limit', limit.toString())
    if (offset) queryParams.set('offset', offset.toString())
    
    const queryString = queryParams.toString()
    const url = `/store/slides${queryString ? `?${queryString}` : ''}`
    
    const response = await sdk.client.fetch(url, {
      method: "GET",
    }) as SlideListResponse

    console.log("Slides response:", response)
    return response
  } catch (error) {
    console.error("Failed to fetch slides:", error)
    return { slides: [], count: 0 }
  }
}

/**
 * Get the primary image URL for a slide from media/thumbnail
 */
const getSlideImageUrl = (slide: Slide): string => {
  // First try to use thumbnail if available
  if (slide.thumbnail) {
    return slide.thumbnail
  }
  
  // Then try to use first media item
  if (slide.media && slide.media.length > 0) {
    return slide.media[0].url
  }
  
  // Fall back to legacy image_url if available
  if (slide.image_url) {
    return slide.image_url
  }
  
  // Final fallback to empty string
  return ''
}

/**
 * Convert slides to the legacy CarouselItem format for compatibility
 */
export const convertSlidesToCarouselItems = (slides: Slide[]) => {
  console.log("Converting slides to carousel items:", slides)
  
  const converted = slides.map((slide) => {
    const image_url = getSlideImageUrl(slide)
    
    const item = {
      id: slide.id,
      title: slide.title,
      description: slide.description,
      image_url,
      alt_text: slide.alt_text || slide.title,
      order: slide.order,
      primary_button_text: slide.primary_button_text,
      primary_button_url: slide.primary_button_url,
      primary_button_active: slide.primary_button_active,
      secondary_button_text: slide.secondary_button_text,
      secondary_button_url: slide.secondary_button_url,
      secondary_button_active: slide.secondary_button_active,
      created_at: slide.created_at,
      updated_at: slide.updated_at,
    }
    
    console.log("Converted slide:", {
      original: slide,
      converted: item,
      thumbnail: slide.thumbnail,
      mediaCount: slide.media?.length || 0,
      firstMediaUrl: slide.media?.[0]?.url,
      computedImageUrl: image_url,
      hasImageUrl: !!image_url
    })
    
    return item
  })
  
  console.log("Final converted carousel items:", converted)
  return converted
}

/**
 * Get carousel items from slides with proper media handling and fallback
 * This is the main function to use in components for carousel display
 */
export const getSlidesAsCarouselItems = async () => {
  try {
    // Fetch active slides
    const slides = await getActiveSlides()
    
    if (!slides || slides.length === 0) {
      console.log("No active slides found, returning empty array")
      return []
    }

    // Convert slides to carousel items with proper media handling
    const carouselItems = convertSlidesToCarouselItems(slides)
    
    // Sort by order/rank
    return carouselItems.sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error("Failed to get slides as carousel items:", error)
    return []
  }
}
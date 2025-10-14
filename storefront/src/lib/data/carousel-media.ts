import { sdk } from "../config"
import { CarouselItem, CarouselSlide, SlideMedia } from "./carousel"

export interface CarouselWithMedia {
  carousel: {
    id: string
    title: string
    handle?: string
    description?: string
    is_active: boolean
    metadata?: any
    created_at: string
    updated_at: string
  }
  slides: CarouselSlideWithMedia[]
}

export interface CarouselSlideWithMedia extends CarouselSlide {
  media: SlideMedia[]
}

/**
 * Get the thumbnail/display image for a carousel slide
 * Returns the media marked as thumbnail, or first media item, or null
 */
export const getSlideDisplayImage = (slide: CarouselSlideWithMedia): SlideMedia | null => {
  if (!slide.media || slide.media.length === 0) {
    console.log(`No media found for slide ${slide.id}`)
    return null
  }

  // First try to find a media item marked as thumbnail
  const thumbnail = slide.media.find(item => item.is_thumbnail)
  if (thumbnail) {
    console.log(`Found thumbnail for slide ${slide.id}:`, thumbnail.url)
    return thumbnail
  }

  // Fall back to the first media item (they should be ordered)
  console.log(`Using first media item as thumbnail for slide ${slide.id}:`, slide.media[0].url)
  return slide.media[0]
}

/**
 * Fetch active carousel with media using the optimized endpoint
 */
export const fetchActiveCarouselWithMedia = async (): Promise<CarouselWithMedia | null> => {
  try {
    console.log("Fetching active carousel with media from store API")
    const response = await sdk.client.fetch(`/store/carousel/active/slides-with-media`, {
      method: "GET",
    }) as CarouselWithMedia

    console.log("Active carousel with media response:", response)
    return response
  } catch (error) {
    console.error("Failed to fetch active carousel with media:", error)
    return null
  }
}

/**
 * Convert carousel slides with media to legacy CarouselItem format
 * This function properly handles media conversion following the categories pattern
 */
export const convertSlidesWithMediaToCarouselItems = (slides: CarouselSlideWithMedia[]): CarouselItem[] => {
  console.log("Converting slides with media to carousel items:", slides)
  
  const converted = slides.map((slide) => {
    // Get the display image (thumbnail or first media item)
    const displayMedia = getSlideDisplayImage(slide)
    
    const item: CarouselItem = {
      id: slide.id,
      title: slide.title,
      description: slide.description,
      image_url: displayMedia?.url || '', // Use display media URL or empty string
      alt_text: displayMedia?.alt_text || slide.title, // Use display media alt_text or slide title
      order: slide.rank,
      primary_button_text: slide.primary_button_text,
      primary_button_url: slide.primary_button_url,
      secondary_button_text: slide.secondary_button_text,
      secondary_button_url: slide.secondary_button_url,
      created_at: slide.created_at,
      updated_at: slide.updated_at,
    }
    
    console.log("Converted slide with media:", {
      slideId: slide.id,
      mediaCount: slide.media?.length || 0,
      displayMediaUrl: displayMedia?.url,
      hasImageUrl: !!item.image_url,
      finalItem: item
    })
    
    return item
  })
  
  console.log("Final converted carousel items with media:", converted)
  return converted
}

/**
 * Get carousel items with proper media handling and fallback
 * This is the main function to use in components
 */
export const getCarouselItemsWithMedia = async (): Promise<CarouselItem[]> => {
  try {
    // Fetch active carousel with media
    const activeCarouselData = await fetchActiveCarouselWithMedia()
    
    if (!activeCarouselData) {
      console.log("No active carousel found, returning empty array")
      return []
    }

    // Convert slides to carousel items with proper media handling
    const carouselItems = convertSlidesWithMediaToCarouselItems(activeCarouselData.slides)
    
    // Sort by order/rank
    return carouselItems.sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error("Failed to get carousel items with media:", error)
    return []
  }
}
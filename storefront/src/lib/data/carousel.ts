import { sdk } from "../config"

export interface CarouselItem {
  id: string
  title: string
  description?: string
  image_url: string
  alt_text?: string
  order: number
  primary_button_text?: string
  primary_button_url?: string
  secondary_button_text?: string
  secondary_button_url?: string
  created_at: string
  updated_at: string
}

export interface CarouselSlide {
  id: string
  carousel_id: string
  title: string
  description?: string
  primary_button_text?: string
  primary_button_url?: string
  secondary_button_text?: string
  secondary_button_url?: string
  rank: number
  is_active: boolean
  metadata?: any
  created_at: string
  updated_at: string
  // These fields are added by the backend when fetching with media
  image_url?: string
  alt_text?: string
  media?: SlideMedia[]
}

export interface SlideMedia {
  id: string
  url: string
  alt_text?: string
  mime_type?: string
  order: number
  is_thumbnail: boolean
}

export interface Carousel {
  id: string
  title: string
  handle?: string
  description?: string
  is_active: boolean
  metadata?: any
  created_at: string
  updated_at: string
}

export interface CarouselResponse {
  carousels: CarouselItem[]
}

export interface ActiveCarouselResponse {
  carousel: Carousel
  slides: CarouselSlide[]
}

/**
 * Fetch active carousels for the store (legacy)
 */
export const getCarousels = async (): Promise<CarouselItem[]> => {
  try {
    console.log("Fetching carousels from store API")
    const response = await sdk.client.fetch(`/store/carousel`, {
      method: "GET",
    }) as CarouselResponse

    console.log("Carousel response:", response)
    return response.carousels || []
  } catch (error) {
    console.error("Failed to fetch carousels:", error)
    return []
  }
}

/**
 * Fetch the active carousel with its slides (without media)
 */
export const getActiveCarousel = async (): Promise<{ carousel: Carousel; slides: CarouselSlide[] } | null> => {
  try {
    console.log("Fetching active carousel from store API")
    const response = await sdk.client.fetch(`/store/carousel/active/slides`, {
      method: "GET",
    }) as ActiveCarouselResponse

    console.log("Active carousel response:", response)
    return response
  } catch (error) {
    console.error("Failed to fetch active carousel:", error)
    return null
  }
}

/**
 * Fetch the active carousel with its slides and media
 */
export const getActiveCarouselWithMedia = async (): Promise<{ carousel: Carousel; slides: CarouselSlide[] } | null> => {
  try {
    console.log("Fetching active carousel with media from store API")
    const response = await sdk.client.fetch(`/store/carousel/active/slides-with-media`, {
      method: "GET",
    }) as ActiveCarouselResponse

    console.log("Active carousel with media response:", response)
    console.log("Slides with media:", response?.slides)
    if (response?.slides) {
      response.slides.forEach((slide, index) => {
        console.log(`Slide ${index}:`, {
          id: slide.id,
          title: slide.title,
          image_url: slide.image_url,
          alt_text: slide.alt_text,
          media: slide.media
        })
      })
    }
    return response
  } catch (error) {
    console.error("Failed to fetch active carousel with media:", error)
    return null
  }
}

/**
 * Convert carousel slides to the legacy CarouselItem format
 */
export const convertSlidesToCarouselItems = (slides: CarouselSlide[]): CarouselItem[] => {
  console.log("Converting slides to carousel items:", slides)
  
  const converted = slides.map((slide) => {
    const item = {
      id: slide.id,
      title: slide.title,
      description: slide.description,
      image_url: slide.image_url || '',
      alt_text: slide.alt_text || slide.title,
      order: slide.rank,
      primary_button_text: slide.primary_button_text,
      primary_button_url: slide.primary_button_url,
      secondary_button_text: slide.secondary_button_text,
      secondary_button_url: slide.secondary_button_url,
      created_at: slide.created_at,
      updated_at: slide.updated_at,
    }
    
    console.log("Converted slide:", {
      original: slide,
      converted: item,
      hasImageUrl: !!slide.image_url,
      imageUrl: slide.image_url
    })
    
    return item
  })
  
  console.log("Final converted carousel items:", converted)
  return converted
}
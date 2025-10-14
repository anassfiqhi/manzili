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

export interface CarouselResponse {
  carousels: CarouselItem[]
}

/**
 * Fetch active carousels for the store
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
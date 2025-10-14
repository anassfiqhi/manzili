import { HttpTypes } from "@medusajs/types"
import { sdk } from "../config"

export interface CategoryMedia {
  id: string
  url: string
  alt_text?: string
  mime_type?: string
  size?: number
  width?: number
  height?: number
  order: number
  is_thumbnail?: boolean
  created_at: string
  updated_at: string
}

export interface CategoryMediaResponse {
  media: CategoryMedia[]
}

/**
 * Fetch media for a specific category
 */
export const getCategoryMedia = async (categoryId: string): Promise<CategoryMedia[]> => {
  try {
    console.log(`Fetching media for category: ${categoryId}`)
    const response = await sdk.client.fetch(`/store/categories/${categoryId}/media`, {
      method: "GET",
    }) as CategoryMediaResponse

    console.log(`Media response for ${categoryId}:`, response)
    return response.media || []
  } catch (error) {
    console.error(`Failed to fetch media for category ${categoryId}:`, error)
    return []
  }
}

/**
 * Get the thumbnail media for a category (the one marked as is_thumbnail: true)
 * Falls back to the first media item if no thumbnail is set
 */
export const getCategoryThumbnail = async (categoryId: string): Promise<CategoryMedia | null> => {
  try {
    const media = await getCategoryMedia(categoryId)
    
    console.log(`Got ${media.length} media items for category ${categoryId}`)
    
    if (!media || media.length === 0) {
      console.log(`No media found for category ${categoryId}`)
      return null
    }

    // First try to find a media item marked as thumbnail
    const thumbnail = media.find(item => item.is_thumbnail)
    if (thumbnail) {
      console.log(`Found thumbnail for category ${categoryId}:`, thumbnail.url)
      return thumbnail
    }

    // Fall back to the first media item (they should be ordered by order field)
    console.log(`Using first media item as thumbnail for category ${categoryId}:`, media[0].url)
    return media[0]
  } catch (error) {
    console.error(`Failed to fetch thumbnail for category ${categoryId}:`, error)
    return null
  }
}

/**
 * Get thumbnails for multiple categories efficiently
 */
export const getCategoriesThumbnails = async (
  categories: HttpTypes.StoreProductCategory[]
): Promise<Record<string, CategoryMedia | null>> => {
  const thumbnails: Record<string, CategoryMedia | null> = {}
  
  // Fetch thumbnails for all categories in parallel
  const thumbnailPromises = categories.map(async (category) => {
    const thumbnail = await getCategoryThumbnail(category.id)
    return { categoryId: category.id, thumbnail }
  })

  const results = await Promise.allSettled(thumbnailPromises)
  
  results.forEach((result, index) => {
    const categoryId = categories[index].id
    if (result.status === 'fulfilled') {
      thumbnails[categoryId] = result.value.thumbnail
    } else {
      console.error(`Failed to fetch thumbnail for category ${categoryId}:`, result.reason)
      thumbnails[categoryId] = null
    }
  })

  return thumbnails
}

/**
 * Helper function to get the display URL for a category with fallback to static image
 */
export const getCategoryDisplayImage = (
  categoryName: string,
  thumbnail: CategoryMedia | null,
  _categoryChildren?: any[]
): string | undefined => {
  // Use dynamic media if available
  if (thumbnail?.url) {
    return thumbnail.url
  }

  // Helper function to normalize names for file matching
  const normalizeName = (name: string) => name.toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9_]/g, '')

  // Static fallback mapping (existing logic - highest priority)
  const categoryImageMap = {
    "ROBINETTERIE": "taps.png",
    "SANITAIRE": "sanitary.png", 
    "MEUBLES SALLE DE BAIN": "bathroom_furniture.png",
    "MIROIRS": "mirrors.png",
    "ACCESOIRES SALLE DE BAIN": "bathroom_accessories.png",
    "FILTRE À EAU": "water_filter.png",
    "CUISINE": "kitchen.png",
  } as Record<string, string>

  // First try the existing static mapping
  const staticImage = categoryImageMap[categoryName]
  if (staticImage) {
    return `/categories/${staticImage}`
  }

  // List of known static images that actually exist
  const existingStaticImages = [
    'bathroom_accessories.png',
    'bathroom_furniture.png', 
    'kitchen.png',
    'mirrors.png',
    'sanitary.png',
    'taps.png',
    'water_filter.png'
  ]

  // Then try to find a matching image by normalized category name
  const normalizedCategoryName = normalizeName(categoryName)
  const potentialFilename = `${normalizedCategoryName}.png`
  
  // Only return the normalized filename if it exists in our known list
  if (existingStaticImages.includes(potentialFilename)) {
    return `/categories/${potentialFilename}`
  }

  // No matching image found - return undefined to show placeholder
  return undefined

  // Note: In a production environment, you might want to verify file existence
  // or have a build process that generates the available static images list
}
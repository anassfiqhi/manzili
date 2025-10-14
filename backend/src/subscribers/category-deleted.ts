import { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa'
import { CATEGORY_MEDIA_MODULE } from '../modules/category-media'
import CategoryMediaService from '../modules/category-media/service'

export default async function categoryDeletedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  try {
    const categoryMediaService: CategoryMediaService = container.resolve(CATEGORY_MEDIA_MODULE)
    
    console.log(`Category deleted event received for category: ${data.id}`)
    
    // Delete all media associated with this category
    await categoryMediaService.deleteAllCategoryMedia(data.id)
    
    console.log(`Successfully cleaned up media for deleted category: ${data.id}`)
  } catch (error) {
    console.error(`Error cleaning up media for deleted category ${data.id}:`, error)
    // Don't throw - category deletion should succeed even if media cleanup fails
  }
}

export const config: SubscriberConfig = {
  event: 'product-category.deleted'
}
import { InjectManager, MedusaContext, InjectTransactionManager, MedusaService, Modules } from "@medusajs/framework/utils"
import { CategoryMedia } from "./models/category-media"
import { Context, DAL, InferTypeOf, IFileModuleService } from "@medusajs/framework/types"
import { EntityManager } from "@mikro-orm/knex"


export type CategoryMediaEntity = InferTypeOf<typeof CategoryMedia>
type Injected = { 
  categoryMediaRepository: DAL.RepositoryService<CategoryMediaEntity>
}


export default class CategoryMediaService extends MedusaService({
  CategoryMedia,
}) {

  protected categoryMediaRepository_: DAL.RepositoryService<CategoryMediaEntity>

  constructor({ categoryMediaRepository }: Injected) {
    super(...arguments)
    this.categoryMediaRepository_ = categoryMediaRepository
  }

  @InjectTransactionManager()
  async createCategoryMedia(data: {
    category_id: string
    file_id?: string
    url?: string
    alt_text?: string
    mime_type?: string
    size?: number
    width?: number
    height?: number
    order?: number
    is_thumbnail?: boolean
  },
    @MedusaContext() shared?: Context<EntityManager>) {
    
    // Validate that we have either file_id or url
    if (!data.file_id && !data.url) {
      throw new Error("Either file_id or url is required")
    }
    
    const { order, is_thumbnail, ...restData } = data
    
    // If setting as thumbnail, remove thumbnail flag from all other media in this category
    if (is_thumbnail) {
      const otherMedia = await this.categoryMediaRepository_.find({
        where: { category_id: data.category_id }
      }, shared)
      
      if (otherMedia.length > 0) {
        const updates = otherMedia.map((media: any) => ({
          entity: media,
          update: { is_thumbnail: false }
        }))
        await this.categoryMediaRepository_.update(updates, shared)
      }
    }
    
    // Ensure we have required fields
    const mediaData = {
      ...restData,
      file_id: data.file_id || null,
      url: data.url || '',
      order: order ?? 0,
      is_thumbnail: is_thumbnail ?? false,
    }
    
    console.log("Creating category media with data:", mediaData)
    
    try {
      const [categoryMedia] = await this.categoryMediaRepository_.create([mediaData], shared)
      return categoryMedia
    } catch (error) {
      console.error("Error in categoryMediaRepository_.create:", error)
      throw error
    }
  }

  @InjectTransactionManager()
  async updateCategoryMedia(
    id: string,
    data: Partial<{
      alt_text: string
      order: number
      is_thumbnail: boolean
    }>,
    @MedusaContext() shared?: Context<EntityManager>
  ) {
    const categoryMedia = (await this.categoryMediaRepository_.find({
      where: { id },
    }, shared))[0]

    if (!categoryMedia) {
      throw new Error(`Category media with id ${id} not found`)
    }

    // If setting as thumbnail, remove thumbnail flag from all other media in this category
    if (data.is_thumbnail) {
      const otherMedia = await this.categoryMediaRepository_.find({
        where: { 
          category_id: categoryMedia.category_id,
          id: { $ne: id }
        }
      }, shared)
      
      if (otherMedia.length > 0) {
        const updates = otherMedia.map((media: any) => ({
          entity: media,
          update: { is_thumbnail: false }
        }))
        await this.categoryMediaRepository_.update(updates, shared)
      }
    }

    const updated = await this.categoryMediaRepository_.update([
      {
        entity: categoryMedia,
        update: data,
      },
    ], shared)

    return updated[0]
  }

  @InjectTransactionManager()
  async deleteCategoryMedia(id: string, @MedusaContext() shared?: Context<EntityManager> | any) {
    // First, get the media record to obtain file information
    const mediaRecord = await this.getCategoryMediaById(id, shared)
    if (!mediaRecord) {
      throw new Error(`Category media with id ${id} not found`)
    }

    // Delete from database first
    const deletedIds = await this.categoryMediaRepository_.delete({ id }, shared)
    if (!deletedIds.length) {
      throw new Error(`Category media with id ${id} not found`)
    }

    // Then delete the actual file if we have file info
    if (mediaRecord.file_id) {
      try {
        // Resolve file service from container
        const fileService: IFileModuleService = shared?.container?.resolve(Modules.FILE)
        
        if (fileService) {
          console.log(`Attempting to delete file with ID: ${mediaRecord.file_id}`)
          // Try to delete the file using file_id - works with both MinIO and local providers
          await fileService.deleteFiles([mediaRecord.file_id])
          console.log(`Successfully deleted file with ID: ${mediaRecord.file_id}`)
        } else {
          console.warn(`File service not available for deleting file: ${mediaRecord.file_id}`)
        }
      } catch (fileError) {
        // Log error but don't fail the entire operation
        console.warn(`Failed to delete file with ID ${mediaRecord.file_id}:`, fileError.message)
      }
    } else {
      console.log(`No file_id found for media record ${id}, skipping file deletion`)
    }
  }

  async listCategoryMedia(categoryId: string, @MedusaContext() shared?: Context<EntityManager>) {
    return await this.categoryMediaRepository_.find({
      where: { category_id: categoryId },
      options: { orderBy: { order: "ASC", created_at: "ASC" } }
    }, shared)
  }

  async getCategoryMediaById(id: string, @MedusaContext() shared?: Context<EntityManager>) {
    const result = await this.categoryMediaRepository_.find({ where: { id } }, shared)
    return result[0] || null
  }

  @InjectTransactionManager()
  async reorderCategoryMedia(categoryId: string, mediaIds: string[], @MedusaContext() shared?: Context<EntityManager>) {
    const mediaItems = await this.categoryMediaRepository_.find({
      where: {
        category_id: categoryId,
        id: { $in: mediaIds }
      }
    }, shared)
  
    const updates = mediaIds.map((id, index) => {
      const media = mediaItems.find((m: any) => m.id === id)
      if (media) {
        return { entity: media, update: { order: index } }
      }
      return null
    }).filter(Boolean)
  
    if (updates.length) {
      await this.categoryMediaRepository_.update(updates, shared)
    }
  }

  @InjectTransactionManager()
  async setThumbnail(categoryId: string, mediaId: string, @MedusaContext() shared?: Context<EntityManager>) {
    // First, remove thumbnail flag from all media in this category
    const allMedia = await this.categoryMediaRepository_.find({
      where: { category_id: categoryId }
    }, shared)
    
    if (allMedia.length > 0) {
      const updates = allMedia.map((media: any) => ({
        entity: media,
        update: { is_thumbnail: false }
      }))
      await this.categoryMediaRepository_.update(updates, shared)
    }

    // Then set the specified media as thumbnail
    const media = (await this.categoryMediaRepository_.find({
      where: { id: mediaId, category_id: categoryId }
    }, shared))[0]

    if (!media) {
      throw new Error(`Media with id ${mediaId} not found in category ${categoryId}`)
    }

    await this.categoryMediaRepository_.update([{
      entity: media,
      update: { is_thumbnail: true }
    }], shared)

    return media
  }

  @InjectTransactionManager()
  async deleteAllCategoryMedia(categoryId: string, @MedusaContext() shared?: Context<EntityManager> | any) {
    const mediaItems = await this.categoryMediaRepository_.find({
      where: { category_id: categoryId }
    }, shared)

    if (mediaItems.length > 0) {
      // Delete files first if possible
      try {
        const fileService: IFileModuleService = shared?.container?.resolve(Modules.FILE)
        
        if (fileService) {
          const fileIdsToDelete = mediaItems
            .filter(item => item.file_id)
            .map(item => item.file_id)
          
          if (fileIdsToDelete.length > 0) {
            console.log(`Attempting to delete ${fileIdsToDelete.length} files:`, fileIdsToDelete)
            await fileService.deleteFiles(fileIdsToDelete)
            console.log(`Successfully deleted ${fileIdsToDelete.length} files`)
          } else {
            console.log(`No files to delete for category ${categoryId}`)
          }
        } else {
          console.warn(`File service not available for bulk deletion`)
        }
      } catch (fileError) {
        console.warn(`Failed to delete some files:`, fileError.message)
      }

      // Then delete database records
      const mediaIds = mediaItems.map((item: any) => item.id)
      await this.categoryMediaRepository_.delete({ id: { $in: mediaIds } }, shared)
      console.log(`Deleted ${mediaItems.length} media items for category ${categoryId}`)
    }
  }
}
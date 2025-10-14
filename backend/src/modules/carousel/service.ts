import { MedusaContext, InjectTransactionManager, MedusaService, Modules } from "@medusajs/framework/utils"
import { Carousel, CarouselSlide, CarouselSlideMedia } from "./models"
import { Context, DAL, InferTypeOf, IFileModuleService } from "@medusajs/framework/types"
import { EntityManager } from "@mikro-orm/knex"

export type CarouselEntity = InferTypeOf<typeof Carousel>
export type CarouselSlideEntity = InferTypeOf<typeof CarouselSlide>
export type CarouselSlideMediaEntity = InferTypeOf<typeof CarouselSlideMedia>

type Injected = { 
  carouselRepository: DAL.RepositoryService<CarouselEntity>
  carouselSlideRepository: DAL.RepositoryService<CarouselSlideEntity>
  carouselSlideMediaRepository: DAL.RepositoryService<CarouselSlideMediaEntity>
}

export default class CarouselService extends MedusaService({
  Carousel,
  CarouselSlide,
  CarouselSlideMedia,
}) {

  protected carouselRepository_: DAL.RepositoryService<CarouselEntity>
  protected carouselSlideRepository_: DAL.RepositoryService<CarouselSlideEntity>
  protected carouselSlideMediaRepository_: DAL.RepositoryService<CarouselSlideMediaEntity>

  constructor({ carouselRepository, carouselSlideRepository, carouselSlideMediaRepository }: Injected) {
    super(...arguments)
    this.carouselRepository_ = carouselRepository
    this.carouselSlideRepository_ = carouselSlideRepository
    this.carouselSlideMediaRepository_ = carouselSlideMediaRepository
  }

  @InjectTransactionManager()
  async createCarousel(data: {
    title: string
    handle?: string
    description?: string
    is_active?: boolean
    metadata?: any
  },
    @MedusaContext() shared?: Context<EntityManager>) {
    
    const { is_active, ...restData } = data
    
    const carouselData = {
      ...restData,
      is_active: is_active ?? true,
    }
    
    console.log("Creating carousel with data:", carouselData)
    
    try {
      const [carousel] = await this.carouselRepository_.create([carouselData], shared)
      return carousel
    } catch (error) {
      console.error("Error in carouselRepository_.create:", error)
      throw error
    }
  }

  @InjectTransactionManager()
  async updateCarousel(
    id: string,
    data: Partial<{
      title: string
      handle: string
      description: string
      is_active: boolean
      metadata: any
    }>,
    @MedusaContext() shared?: Context<EntityManager>
  ) {
    const carousel = (await this.carouselRepository_.find({
      where: { id },
    }, shared))[0]

    if (!carousel) {
      throw new Error(`Carousel with id ${id} not found`)
    }

    const updated = await this.carouselRepository_.update([
      {
        entity: carousel,
        update: data,
      },
    ], shared)

    return updated[0]
  }

  @InjectTransactionManager()
  async deleteCarousel(id: string, @MedusaContext() shared?: Context<EntityManager> | any) {
    // First, get the carousel record
    const carouselRecord = await this.getCarouselById(id, shared)
    if (!carouselRecord) {
      throw new Error(`Carousel with id ${id} not found`)
    }

    // Delete from database
    const deletedIds = await this.carouselRepository_.delete({ id }, shared)
    if (!deletedIds.length) {
      throw new Error(`Carousel with id ${id} not found`)
    }
  }

  async listAllCarousels(filters: any = {}, config: any = {}, @MedusaContext() sharedContext?: Context<EntityManager>) {
    const { include_inactive, ...restFilters } = filters
    const includeInactive = include_inactive || false
    const whereClause = includeInactive ? {} : { is_active: true }
    
    return await this.carouselRepository_.find({
      where: { ...whereClause, ...restFilters },
      options: { 
        orderBy: { created_at: "ASC" },
        ...config
      }
    }, sharedContext)
  }

  async getCarouselById(id: string, @MedusaContext() shared?: Context<EntityManager>) {
    const result = await this.carouselRepository_.find({ where: { id } }, shared)
    return result[0] || null
  }

  @InjectTransactionManager()
  async toggleCarouselStatus(id: string, @MedusaContext() shared?: Context<EntityManager>) {
    const carousel = (await this.carouselRepository_.find({
      where: { id }
    }, shared))[0]

    if (!carousel) {
      throw new Error(`Carousel with id ${id} not found`)
    }

    await this.carouselRepository_.update([{
      entity: carousel,
      update: { is_active: !carousel.is_active }
    }], shared)

    return { ...carousel, is_active: !carousel.is_active }
  }

  @InjectTransactionManager()
  async setCarouselActive(id: string, @MedusaContext() shared?: Context<EntityManager>) {
    // First, deactivate all carousels
    const allCarousels = await this.carouselRepository_.find({ where: {} }, shared)
    
    if (allCarousels.length > 0) {
      const deactivateUpdates = allCarousels.map((carousel: any) => ({
        entity: carousel,
        update: { is_active: false }
      }))
      await this.carouselRepository_.update(deactivateUpdates, shared)
    }

    // Then activate the specified carousel
    const targetCarousel = (await this.carouselRepository_.find({
      where: { id }
    }, shared))[0]

    if (!targetCarousel) {
      throw new Error(`Carousel with id ${id} not found`)
    }

    await this.carouselRepository_.update([{
      entity: targetCarousel,
      update: { is_active: true }
    }], shared)

    return { ...targetCarousel, is_active: true }
  }

  async getActiveCarousel(@MedusaContext() shared?: Context<EntityManager>) {
    const result = await this.carouselRepository_.find({ 
      where: { is_active: true },
      options: { limit: 1 }
    }, shared)
    return result[0] || null
  }

  async getActiveCarouselWithSlides(@MedusaContext() shared?: Context<EntityManager>) {
    const activeCarousel = await this.getActiveCarousel(shared)
    if (!activeCarousel) {
      return null
    }

    const slides = await this.getSlidesByCarouselId(activeCarousel.id, false, shared)
    return {
      carousel: activeCarousel,
      slides: slides
    }
  }

  // ===== CAROUSEL SLIDE METHODS =====

  @InjectTransactionManager()
  async createSlide(data: {
    carousel_id: string
    title: string
    description?: string
    primary_button_text?: string
    primary_button_url?: string
    secondary_button_text?: string
    secondary_button_url?: string
    rank?: number
    is_active?: boolean
    metadata?: any
  },
    @MedusaContext() shared?: Context<EntityManager>) {
    
    const { rank, is_active, ...restData } = data
    
    const slideData = {
      ...restData,
      rank: rank ?? 0,
      is_active: is_active ?? true,
    }
    
    console.log("Creating carousel slide with data:", slideData)
    
    try {
      const [slide] = await this.carouselSlideRepository_.create([slideData], shared)
      return slide
    } catch (error) {
      console.error("Error in carouselSlideRepository_.create:", error)
      throw error
    }
  }

  @InjectTransactionManager()
  async updateSlide(
    id: string,
    data: Partial<{
      carousel_id: string
      title: string
      description: string
      primary_button_text: string
      primary_button_url: string
      secondary_button_text: string
      secondary_button_url: string
      rank: number
      is_active: boolean
      metadata: any
    }>,
    @MedusaContext() shared?: Context<EntityManager>
  ) {
    const slide = (await this.carouselSlideRepository_.find({
      where: { id },
    }, shared))[0]

    if (!slide) {
      throw new Error(`Carousel slide with id ${id} not found`)
    }

    const updated = await this.carouselSlideRepository_.update([
      {
        entity: slide,
        update: data,
      },
    ], shared)

    return updated[0]
  }

  @InjectTransactionManager()
  async deleteSlide(id: string, @MedusaContext() shared?: Context<EntityManager> | any) {
    // First check if slide exists
    const slide = await this.getSlideById(id, shared)
    if (!slide) {
      throw new Error(`Carousel slide with id ${id} not found`)
    }

    // Delete slide media first
    await this.carouselSlideMediaRepository_.delete({ slide_id: id }, shared)
    
    // Then delete the slide
    await this.carouselSlideRepository_.delete({ id }, shared)
  }

  async listSlides(filters: any = {}, config: any = {}, @MedusaContext() sharedContext?: Context<EntityManager>) {
    const { include_inactive, ...restFilters } = filters
    const includeInactive = include_inactive || false
    const whereClause = includeInactive ? {} : { is_active: true }
    
    return await this.carouselSlideRepository_.find({
      where: { ...whereClause, ...restFilters },
      options: { 
        orderBy: { rank: "ASC", created_at: "ASC" },
        ...config
      }
    }, sharedContext)
  }

  async getSlideById(id: string, @MedusaContext() shared?: Context<EntityManager>) {
    const result = await this.carouselSlideRepository_.find({ where: { id } }, shared)
    return result[0] || null
  }

  async getSlidesByCarouselId(carousel_id: string, includeInactive = false, @MedusaContext() shared?: Context<EntityManager>) {
    const whereClause = includeInactive ? { carousel_id } : { carousel_id, is_active: true }
    
    return await this.carouselSlideRepository_.find({
      where: whereClause,
      options: { 
        orderBy: { rank: "ASC", created_at: "ASC" }
      }
    }, shared)
  }

  @InjectTransactionManager()
  async reorderSlides(slideIds: string[], @MedusaContext() shared?: Context<EntityManager>) {
    const slideItems = await this.carouselSlideRepository_.find({
      where: {
        id: { $in: slideIds }
      }
    }, shared)
  
    const updates = slideIds.map((id, index) => {
      const slide = slideItems.find((s: any) => s.id === id)
      if (slide) {
        return { entity: slide, update: { rank: index } }
      }
      return null
    }).filter(Boolean)
  
    if (updates.length) {
      await this.carouselSlideRepository_.update(updates, shared)
    }
  }

  @InjectTransactionManager()
  async toggleSlideStatus(id: string, @MedusaContext() shared?: Context<EntityManager>) {
    const slide = (await this.carouselSlideRepository_.find({
      where: { id }
    }, shared))[0]

    if (!slide) {
      throw new Error(`Carousel slide with id ${id} not found`)
    }

    await this.carouselSlideRepository_.update([{
      entity: slide,
      update: { is_active: !slide.is_active }
    }], shared)

    return { ...slide, is_active: !slide.is_active }
  }

  // ===== CAROUSEL SLIDE MEDIA METHODS =====

  @InjectTransactionManager()
  async createSlideMedia(data: {
    slide_id: string
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
    
    // If setting as thumbnail, remove thumbnail flag from all other media in this slide
    if (is_thumbnail) {
      const otherMedia = await this.carouselSlideMediaRepository_.find({
        where: { slide_id: data.slide_id }
      }, shared)
      
      if (otherMedia.length > 0) {
        const updates = otherMedia.map((media: any) => ({
          entity: media,
          update: { is_thumbnail: false }
        }))
        await this.carouselSlideMediaRepository_.update(updates, shared)
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
    
    console.log("Creating carousel slide media with data:", mediaData)
    
    try {
      const [slideMedia] = await this.carouselSlideMediaRepository_.create([mediaData], shared)
      return slideMedia
    } catch (error) {
      console.error("Error in carouselSlideMediaRepository_.create:", error)
      throw error
    }
  }

  @InjectTransactionManager()
  async updateSlideMedia(
    id: string,
    data: Partial<{
      alt_text: string
      order: number
      is_thumbnail: boolean
    }>,
    @MedusaContext() shared?: Context<EntityManager>
  ) {
    const slideMedia = (await this.carouselSlideMediaRepository_.find({
      where: { id },
    }, shared))[0]

    if (!slideMedia) {
      throw new Error(`Carousel slide media with id ${id} not found`)
    }

    // If setting as thumbnail, remove thumbnail flag from all other media in this slide
    if (data.is_thumbnail) {
      const otherMedia = await this.carouselSlideMediaRepository_.find({
        where: { 
          slide_id: slideMedia.slide_id,
          id: { $ne: id }
        }
      }, shared)
      
      if (otherMedia.length > 0) {
        const updates = otherMedia.map((media: any) => ({
          entity: media,
          update: { is_thumbnail: false }
        }))
        await this.carouselSlideMediaRepository_.update(updates, shared)
      }
    }

    const updated = await this.carouselSlideMediaRepository_.update([
      {
        entity: slideMedia,
        update: data,
      },
    ], shared)

    return updated[0]
  }

  @InjectTransactionManager()
  async deleteSlideMedia(id: string, @MedusaContext() shared?: Context<EntityManager> | any) {
    // First, get the media record to obtain file information
    const mediaRecord = await this.getSlideMediaById(id, shared)
    if (!mediaRecord) {
      throw new Error(`Carousel slide media with id ${id} not found`)
    }

    // Delete from database first
    const deletedIds = await this.carouselSlideMediaRepository_.delete({ id }, shared)
    if (!deletedIds.length) {
      throw new Error(`Carousel slide media with id ${id} not found`)
    }

    // Then delete the actual file if we have file info
    if (mediaRecord.file_id) {
      try {
        // Resolve file service from container
        const fileService: IFileModuleService = shared?.container?.resolve(Modules.FILE)
        
        if (fileService) {
          console.log(`Attempting to delete file with ID: ${mediaRecord.file_id}`)
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

  async listSlideMedia(slideId: string, @MedusaContext() shared?: Context<EntityManager>) {
    return await this.carouselSlideMediaRepository_.find({
      where: { slide_id: slideId },
      options: { orderBy: { order: "ASC", created_at: "ASC" } }
    }, shared)
  }

  async getSlideMediaById(id: string, @MedusaContext() shared?: Context<EntityManager>) {
    const result = await this.carouselSlideMediaRepository_.find({ where: { id } }, shared)
    return result[0] || null
  }

  @InjectTransactionManager()
  async reorderSlideMedia(slideId: string, mediaIds: string[], @MedusaContext() shared?: Context<EntityManager>) {
    const mediaItems = await this.carouselSlideMediaRepository_.find({
      where: {
        slide_id: slideId,
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
      await this.carouselSlideMediaRepository_.update(updates, shared)
    }
  }

  @InjectTransactionManager()
  async setThumbnail(slideId: string, mediaId: string, @MedusaContext() shared?: Context<EntityManager>) {
    // First, remove thumbnail flag from all media in this slide
    const allMedia = await this.carouselSlideMediaRepository_.find({
      where: { slide_id: slideId }
    }, shared)
    
    if (allMedia.length > 0) {
      const updates = allMedia.map((media: any) => ({
        entity: media,
        update: { is_thumbnail: false }
      }))
      await this.carouselSlideMediaRepository_.update(updates, shared)
    }

    // Then set the specified media as thumbnail
    const media = (await this.carouselSlideMediaRepository_.find({
      where: { id: mediaId, slide_id: slideId }
    }, shared))[0]

    if (!media) {
      throw new Error(`Media with id ${mediaId} not found in slide ${slideId}`)
    }

    await this.carouselSlideMediaRepository_.update([{
      entity: media,
      update: { is_thumbnail: true }
    }], shared)

    return media
  }

  @InjectTransactionManager()
  async deleteAllSlideMedia(slideId: string, @MedusaContext() shared?: Context<EntityManager> | any) {
    const mediaItems = await this.carouselSlideMediaRepository_.find({
      where: { slide_id: slideId }
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
            console.log(`No files to delete for slide ${slideId}`)
          }
        } else {
          console.warn(`File service not available for bulk deletion`)
        }
      } catch (fileError) {
        console.warn(`Failed to delete some files:`, fileError.message)
      }

      // Then delete database records
      const mediaIds = mediaItems.map((item: any) => item.id)
      await this.carouselSlideMediaRepository_.delete({ id: { $in: mediaIds } }, shared)
      console.log(`Deleted ${mediaItems.length} media items for slide ${slideId}`)
    }
  }
}
import { MedusaContext, InjectTransactionManager, MedusaService } from "@medusajs/framework/utils"
import { Slide } from "./models"
import { Context, DAL, InferTypeOf } from "@medusajs/framework/types"
import { EntityManager } from "@mikro-orm/knex"

export type SlideEntity = InferTypeOf<typeof Slide>

type Injected = { 
  slideRepository: DAL.RepositoryService<SlideEntity>
}

class SlidesService extends MedusaService({
  Slide,
}) {
  protected slideRepository_: DAL.RepositoryService<SlideEntity>

  constructor({ slideRepository }: Injected) {
    super(...arguments)
    this.slideRepository_ = slideRepository
  }
  // List all slides
  @InjectTransactionManager()
  async listSlides(options: { include_inactive?: boolean } = {}, @MedusaContext() shared?: Context<EntityManager>) {
    const { include_inactive = false } = options
    
    console.log("=== SlidesService.listSlides called ===")
    console.log("options:", options)
    console.log("include_inactive:", include_inactive)
    
    try {
      // Query options for listing slides
      const queryOptions: any = {
        order: { rank: "ASC", created_at: "DESC" }
      }
      
      if (!include_inactive) {
        queryOptions.where = { is_active: true }
      }
      
      console.log("queryOptions:", queryOptions)
      console.log("Calling slideRepository_.find...")
      
      const slides = await this.slideRepository_.find(queryOptions, shared)
      
      console.log("Raw result from slideRepository_.find:", slides)
      
      console.log("Slides result:", slides)
      
      return slides
    } catch (error) {
      // Return empty array if tables don't exist yet
      console.error("Error in listSlides:", error)
      console.log("Slides table not found, returning empty array")
      return []
    }
  }

  // Get single slide
  @InjectTransactionManager()
  async getSlide(id: string, @MedusaContext() shared?: Context<EntityManager>) {
    try {
      const slide = (await this.slideRepository_.find({
        where: { id },
      }, shared))[0]

      if (!slide) {
        throw new Error(`Slide with id ${id} not found`)
      }

      return slide
    } catch (error) {
      throw new Error("Slide not found")
    }
  }

  // Create slide
  @InjectTransactionManager()
  async createSlide(data: {
    title: string
    description?: string
    primary_button_text?: string
    primary_button_url?: string
    primary_button_active?: boolean
    secondary_button_text?: string
    secondary_button_url?: string
    secondary_button_active?: boolean
    rank?: number
    is_active?: boolean
    metadata?: any
  }, @MedusaContext() shared?: Context<EntityManager>) {
    
    const { is_active, primary_button_active, secondary_button_active, rank, ...restData } = data
    
    const slideData = {
      ...restData,
      is_active: is_active ?? true,
      primary_button_active: primary_button_active ?? true,
      secondary_button_active: secondary_button_active ?? true,
      rank: rank ?? 0,
    }
    
    console.log("Creating slide with data:", slideData)
    
    const slides = await this.slideRepository_.create([slideData], shared)
    const slide = slides[0]
    
    console.log("Created slide:", slide)
    
    return slide
  }

  // Update slide
  @InjectTransactionManager()
  async updateSlide(id: string, data: {
    title?: string
    description?: string
    primary_button_text?: string
    primary_button_url?: string
    primary_button_active?: boolean
    secondary_button_text?: string
    secondary_button_url?: string
    secondary_button_active?: boolean
    rank?: number
    is_active?: boolean
    media?: any[]
    thumbnail?: string
    metadata?: any
  }, @MedusaContext() shared?: Context<EntityManager>) {
    const slide = (await this.slideRepository_.find({
      where: { id },
    }, shared))[0]

    if (!slide) {
      throw new Error(`Slide with id ${id} not found`)
    }

    const updated = await this.slideRepository_.update([
      {
        entity: slide,
        update: data,
      },
    ], shared)

    return updated[0]
  }

  // Delete slide
  @InjectTransactionManager()
  async deleteSlide(id: string, @MedusaContext() shared?: Context<EntityManager>) {
    const slide = (await this.slideRepository_.find({
      where: { id },
    }, shared))[0]

    if (!slide) {
      throw new Error(`Slide with id ${id} not found`)
    }

    await this.slideRepository_.delete([slide], shared)
    return { id, deleted: true }
  }

  // Toggle slide status
  async toggleSlideStatus(id: string) {
    const slide = await this.getSlide(id)
    const updatedSlide = await this.updateSlide(id, {
      is_active: !slide.is_active
    })
    return updatedSlide
  }

  // Reorder slides
  async reorderSlides(slideIds: string[]) {
    for (let i = 0; i < slideIds.length; i++) {
      await this.updateSlide(slideIds[i], { rank: i })
    }
  }

  // Toggle button status
  async toggleButtonStatus(id: string, buttonType: 'primary' | 'secondary') {
    const slide = await this.getSlide(id)
    const updateData = buttonType === 'primary' 
      ? { primary_button_active: !slide.primary_button_active }
      : { secondary_button_active: !slide.secondary_button_active }
    
    const updatedSlide = await this.updateSlide(id, updateData)
    return updatedSlide
  }

  // No separate media methods needed - slides work like products with images/thumbnail fields
}

export default SlidesService
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SLIDES_MODULE } from "../../../../../modules/slides"
import SlidesService from "../../../../../modules/slides/service"

interface ToggleButtonRequest {
  buttonType: 'primary' | 'secondary'
}

// POST /admin/slides/[id]/toggle-button
export const POST = async (req: MedusaRequest<ToggleButtonRequest>, res: MedusaResponse) => {
  const slidesService = req.scope.resolve(SLIDES_MODULE) as SlidesService
  const { id } = req.params
  const { buttonType } = req.body

  if (!buttonType || (buttonType !== 'primary' && buttonType !== 'secondary')) {
    return res.status(400).json({ error: "buttonType must be 'primary' or 'secondary'" })
  }

  try {
    const slide = await slidesService.toggleButtonStatus(id, buttonType)
    
    res.json({
      slide: {
        id: slide.id,
        title: slide.title,
        description: slide.description,
        primary_button_text: slide.primary_button_text,
        primary_button_url: slide.primary_button_url,
        primary_button_active: slide.primary_button_active,
        secondary_button_text: slide.secondary_button_text,
        secondary_button_url: slide.secondary_button_url,
        secondary_button_active: slide.secondary_button_active,
        rank: slide.rank,
        is_active: slide.is_active,
        metadata: slide.metadata,
        created_at: slide.created_at,
        updated_at: slide.updated_at,
      }
    })
  } catch (error) {
    console.error("Error toggling button status:", error)
    res.status(500).json({ error: "Failed to toggle button status" })
  }
}
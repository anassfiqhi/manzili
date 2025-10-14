import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CATEGORY_MEDIA_MODULE } from "../../../../../../modules/category-media"
import CategoryMediaService from "../../../../../../modules/category-media/service"

// DELETE /admin/categories/:id/media/cleanup
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const categoryMediaService = req.scope.resolve(CATEGORY_MEDIA_MODULE) as CategoryMediaService
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: "Category ID is required" })
  }

  try {
    // Pass the request scope container to the service for file deletion
    const context = { container: req.scope }
    await categoryMediaService.deleteAllCategoryMedia(id, context)
    
    res.json({
      category_id: id,
      message: "All media for this category has been deleted"
    })
  } catch (error) {
    console.error("Error cleaning up category media:", error)
    res.status(500).json({ error: "Failed to cleanup category media" })
  }
}
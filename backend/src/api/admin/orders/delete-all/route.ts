import { logger } from "@medusajs/framework"
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function DELETE(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    // Authentication is enforced by middleware (see src/api/middlewares.ts)
    const orderModuleService = req.scope.resolve(Modules.ORDER)

    try {
        // Get all orders
        const orders = await orderModuleService.listOrders({}, { take: null })

        logger.info(`Found ${orders.length} orders to delete`)

        if (orders.length === 0) {
            logger.info("No orders to delete")
            res.json({
                success: true,
                message: "No orders to delete",
                deleted_count: 0
            })
            return
        }

        // Delete all orders
        const orderIds = orders.map((order) => order.id)
        await orderModuleService.deleteOrders(orderIds)

        logger.info(`Deleted ${orderIds.length} orders`)

        res.json({
            success: true,
            message: `Successfully deleted ${orderIds.length} orders`,
            deleted_count: orderIds.length
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to delete orders"
        })
    }
}

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "zod"
import SMSService from "../../../modules/sms/service"

const contactSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("L'email doit être valide"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Le sujet est requis"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
})

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)
    const smsService: SMSService = req.scope.resolve("sms")

    // Validate request body
    const validationResult = contactSchema.safeParse(req.body)
    
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: validationResult.error.errors
      })
      return
    }

    const { name, email, phone, subject, message } = validationResult.data

    logger.info("Processing contact form submission", { name, email, subject })

    // Send notification SMS to admin
    try {
      await smsService.sendContactNotification({
        name,
        email,
        subject,
        message
      })
      logger.info("Admin notification SMS sent successfully")
    } catch (error) {
      logger.error("Failed to send admin notification SMS", { error })
      // Continue even if SMS fails
    }

    // Send confirmation SMS to customer if phone provided
    if (phone) {
      try {
        await smsService.sendCustomerConfirmation({
          name,
          phone,
          subject
        })
        logger.info("Customer confirmation SMS sent successfully")
      } catch (error) {
        logger.error("Failed to send customer confirmation SMS", { error })
        // Continue even if SMS fails
      }
    }

    // Here you could also:
    // 1. Save to database
    // 2. Send email notifications
    // 3. Create a support ticket
    
    res.status(200).json({
      success: true,
      message: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais."
    })

  } catch (error) {
    const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)
    logger.error("Contact form submission failed", { error })
    
    res.status(500).json({
      success: false,
      message: "Une erreur interne s'est produite. Veuillez réessayer plus tard."
    })
  }
}
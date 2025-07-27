import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { INotificationModuleService } from "@medusajs/framework/types"
import { z } from "zod"

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
    const notificationService: INotificationModuleService = req.scope.resolve(Modules.NOTIFICATION)

    // Validate request body
    const validationResult = contactSchema.safeParse(req.body)

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: validationResult.error
      })
      return
    }

    const { name, email, phone, subject, message } = validationResult.data

    logger.info(`Processing contact form submission ${JSON.stringify({ name, email, subject })}`)

    // Send notification SMS to admin
    try {
      const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER || "212770362167"
      const adminMessage = `
Nouveau message de contact reçu:

De: ${name} (${email})
Sujet: ${subject}

Message: ${message}

---
Manzili E-commerce
      `.trim()

      await notificationService.createNotifications({
        to: adminPhoneNumber,
        channel: 'sms',
        template: 'contact_notification',
        data: {
          message: adminMessage
        }
      })
      logger.info("Admin notification SMS sent successfully")
    } catch (error) {
      logger.error(`Failed to send admin notification SMS ${JSON.stringify({ error })}`)
      // Continue even if SMS fails
    }

    // Send confirmation SMS to customer if phone provided
    if (phone) {
      try {
        const confirmationMessage = `
Bonjour ${name},

Merci de nous avoir contactés concernant "${subject}".

Votre message a été reçu et notre équipe vous répondra dans les plus brefs délais.

Cordialement,
L'équipe Manzili
        `.trim()

        await notificationService.createNotifications({
          to: phone,
          channel: 'sms',
          template: 'contact_confirmation',
          data: {
            message: confirmationMessage
          }
        })
        logger.info("Customer confirmation SMS sent successfully")
      } catch (error) {
        logger.error(`Failed to send customer confirmation SMS ${JSON.stringify({ error })}`)
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
    logger.error(`Contact form submission failed ${JSON.stringify({ error })}`)

    res.status(500).json({
      success: false,
      message: "Une erreur interne s'est produite. Veuillez réessayer plus tard."
    })
  }
}
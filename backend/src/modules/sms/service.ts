import { Logger, MedusaService } from "@medusajs/framework/utils"
import { Vonage } from "@vonage/server-sdk"

type InjectedDependencies = {
  logger: Logger
}

type SendSMSInput = {
  to: string
  message: string
  from?: string
}

export default class SMSService extends MedusaService({
  inject: ["logger"],
}) {
  protected logger_: Logger
  private vonage: Vonage

  constructor({ logger }: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.logger_ = logger

    // Initialize Vonage with API credentials
    this.vonage = new Vonage({
      apiKey: process.env.VONAGE_API_KEY || "4d0",
      apiSecret: process.env.VONAGE_API_SECRET || "yVmqjtla"
    })
  }

  async sendSMS({ to, message, from = "Manzili Support" }: SendSMSInput) {
    try {
      this.logger_.info(`Sending SMS to ${to}`)
      
      const response = await this.vonage.sms.send({
        to,
        from,
        text: message
      })

      this.logger_.info(`SMS sent successfully to ${to}`, { response })
      return response
    } catch (error) {
      this.logger_.error(`Failed to send SMS to ${to}`, { error })
      throw new Error(`SMS sending failed: ${error.message}`)
    }
  }

  async sendContactNotification(contactData: {
    name: string
    email: string
    subject: string
    message: string
  }) {
    const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER || "212770362167"
    
    const smsMessage = `
Nouveau message de contact reçu:

De: ${contactData.name} (${contactData.email})
Sujet: ${contactData.subject}

Message: ${contactData.message}

---
Manzili E-commerce
    `.trim()

    return await this.sendSMS({
      to: adminPhoneNumber,
      message: smsMessage,
      from: "Manzili Contact"
    })
  }

  async sendCustomerConfirmation(customerData: {
    name: string
    phone: string
    subject: string
  }) {
    const confirmationMessage = `
Bonjour ${customerData.name},

Merci de nous avoir contactés concernant "${customerData.subject}".

Votre message a été reçu et notre équipe vous répondra dans les plus brefs délais.

Cordialement,
L'équipe Manzili
    `.trim()

    return await this.sendSMS({
      to: customerData.phone,
      message: confirmationMessage,
      from: "Manzili"
    })
  }
}
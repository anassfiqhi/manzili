import { Logger, NotificationTypes } from '@medusajs/framework/types'
import { AbstractNotificationProviderService, MedusaError } from '@medusajs/framework/utils'
import { Vonage } from '@vonage/server-sdk'
import { Auth } from '@vonage/auth'

type InjectedDependencies = {
  logger: Logger
}

interface VonageServiceConfig {
  apiKey: string
  apiSecret: string
  from: string
}

export interface VonageNotificationServiceOptions {
  api_key: string
  api_secret: string
  from: string
}

/**
 * Service to handle SMS notifications using the Vonage API.
 */
export class VonageNotificationService extends AbstractNotificationProviderService {
  static identifier = "VONAGE_NOTIFICATION_SERVICE"
  protected config_: VonageServiceConfig
  protected logger_: Logger
  protected vonage: Vonage

  constructor({ logger }: InjectedDependencies, options: VonageNotificationServiceOptions) {
    super()
    this.config_ = {
      apiKey: options.api_key,
      apiSecret: options.api_secret,
      from: options.from
    }
    this.logger_ = logger
    const credentials = new Auth({
      apiKey: this.config_.apiKey,
      apiSecret: this.config_.apiSecret
    })
    this.vonage = new Vonage(credentials)
  }

  private isValidPhoneNumber(phone: string): boolean {
    // Basic phone number validation - should start with + and contain only digits
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  async send(
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    if (!notification) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `No notification information provided`)
    }
    if (notification.channel !== 'sms') {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `Only SMS notifications are supported by this provider`)
    }

    // Validate phone number
    if (!notification.to || !notification.to.trim() || !this.isValidPhoneNumber(notification.to)) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `Invalid phone number: ${notification.to}`)
    }

    // Get message content from notification data
    const message = (notification.data?.message || notification.data?.text) as string
    if (!message) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `No message content provided`)
    }

    // Send SMS via Vonage
    try {
      this.logger_.info(`Sending SMS to ${notification.to}`)
      
      const response = await this.vonage.sms.send({
        to: notification.to,
        from: notification.from?.trim() ?? this.config_.from,
        text: message
      })

      this.logger_.info(`Response ${JSON.stringify(response)}`)
      this.logger_.info(`SMS sent successfully to ${notification.to}`)
      return {}
    } catch (error: any) {
      this.logger_.error(`Failed to send SMS to ${notification.to}`)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to send SMS to ${notification.to}: ${error.message}`
      )
    }
  }

  // Helper method for direct SMS sending (backward compatibility)
  async sendSMS(to: string, message: string, from?: string): Promise<any> {
    return this.send({
      to,
      from: from || this.config_.from,
      channel: 'sms',
      template: 'custom',
      data: { message }
    } as NotificationTypes.ProviderSendNotificationDTO)
  }
}

export default VonageNotificationService
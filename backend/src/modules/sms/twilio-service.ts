import { Logger, NotificationTypes } from '@medusajs/framework/types'
import { AbstractNotificationProviderService, MedusaError } from '@medusajs/framework/utils'
import { Twilio } from 'twilio'

type InjectedDependencies = {
  logger: Logger
}

interface TwilioServiceConfig {
  accountSid: string
  authToken: string
  from: string
}

export interface TwilioNotificationServiceOptions {
  account_sid: string
  auth_token: string
  from: string
}

/**
 * Service to handle SMS notifications using the Twilio API.
 */
export class TwilioNotificationService extends AbstractNotificationProviderService {
  static identifier = "TWILIO_NOTIFICATION_SERVICE"
  protected config_: TwilioServiceConfig
  protected logger_: Logger
  protected twilio: Twilio

  constructor({ logger }: InjectedDependencies, options: TwilioNotificationServiceOptions) {
    super()
    this.config_ = {
      accountSid: options.account_sid,
      authToken: options.auth_token,
      from: options.from
    }
    this.logger_ = logger
    this.twilio = new Twilio(this.config_.accountSid, this.config_.authToken)
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

    // Ensure phone number has proper format for Twilio
    let toNumber = notification.to
    if (!toNumber.startsWith('+')) {
      toNumber = '+' + toNumber
    }

    // Send SMS via Twilio
    try {
      this.logger_.info(`Sending SMS to ${toNumber}`)
      
      const response = await this.twilio.messages.create({
        to: toNumber,
        from: notification.from?.trim() ?? this.config_.from,
        body: message
      })

      this.logger_.info(`SMS sent successfully to ${toNumber}, Message SID: ${response.sid}`)
      return {}
    } catch (error: any) {
      this.logger_.error(`Failed to send SMS to ${toNumber}: ${error.message}`)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to send SMS to ${toNumber}: ${error.message}`
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

export default TwilioNotificationService
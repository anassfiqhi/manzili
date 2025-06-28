import { Modules } from '@medusajs/framework/utils'
import { INotificationModuleService, IOrderModuleService } from '@medusajs/framework/types'
import { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa'
import { EmailTemplates } from '../modules/email-notifications/templates'

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const notificationModuleService: INotificationModuleService = container.resolve(Modules.NOTIFICATION)
  const orderModuleService: IOrderModuleService = container.resolve(Modules.ORDER)
  
  const order = await orderModuleService.retrieveOrder(data.id, { relations: ['items', 'summary', 'shipping_address'] })
  const shippingAddress = await (orderModuleService as any).orderAddressService_.retrieve(order.shipping_address.id)

  // Generate guest email based on phone number if no email is provided
  const generateGuestEmailFromPhone = (phoneNumber: string): string => {
    if (!phoneNumber || !phoneNumber.trim()) {
      // Fallback to random number if no phone number
      const randomNumber = Math.floor(Math.random() * 1000000)
      return `guest${randomNumber}@fakeemail.fake`
    }
    
    // Clean phone number (remove spaces, dashes, parentheses, etc.)
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '')
    
    // Use full phone number for uniqueness
    return `guest${cleanPhone}@fakeemail.fake`
  }

  // Determine the email to use
  let emailToUse = order.email
  
  // If no email is provided, generate one based on phone number
  if (!emailToUse || !emailToUse.trim() || emailToUse.includes('@fakeemail.fake')) {
    const phoneNumber = shippingAddress?.phone || ''
    emailToUse = generateGuestEmailFromPhone(phoneNumber)
    
    // Update the order with the generated email
    try {
      await orderModuleService.updateOrders(order.id, { email: emailToUse })
    } catch (error) {
      console.error('Error updating order with generated email:', error)
    }
  }

  try {
    await notificationModuleService.createNotifications({
      to: emailToUse,
      channel: 'email',
      template: EmailTemplates.ORDER_PLACED,
      data: {
        emailOptions: {
          replyTo: 'info@example.com',
          subject: 'Your order has been placed'
        },
        order,
        shippingAddress,
        preview: 'Thank you for your order!'
      }
    })
  } catch (error) {
    console.error('Error sending order confirmation notification:', error)
  }
}

export const config: SubscriberConfig = {
  event: 'order.placed'
}

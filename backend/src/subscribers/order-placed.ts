import { Modules } from '@medusajs/framework/utils'
import { INotificationModuleService, IOrderModuleService } from '@medusajs/framework/types'
import { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa'
import { EmailTemplates } from '../modules/email-notifications/templates'
import { VonageNotificationService } from '../modules/sms/service'

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const notificationModuleService: INotificationModuleService = container.resolve(Modules.NOTIFICATION)
  const orderModuleService: IOrderModuleService = container.resolve(Modules.ORDER)
  const smsService = new VonageNotificationService(
    { logger: container.resolve('logger') },
    {
      api_key: process.env.VONAGE_API_KEY || "4d0",
      api_secret: process.env.VONAGE_API_SECRET || "yVmqjtla",
      from: process.env.VONAGE_FROM || "Manzili"
    }
  )

  const order = await orderModuleService.retrieveOrder(data.id, { relations: ['items', 'summary', 'shipping_address', 'billing_address'] })
  const shippingAddress = await (orderModuleService as any).orderAddressService_.retrieve(order.shipping_address.id)
  const billingAddress = order.billing_address ? await (orderModuleService as any).orderAddressService_.retrieve(order.billing_address.id) : null

  // Send email notification
  try {
    await notificationModuleService.createNotifications({
      to: order.email,
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
    console.error('Error sending order confirmation email:', error)
  }

  // Send SMS notifications
  try {
    // Get customer phone number from shipping or billing address
    const customerPhone = (shippingAddress?.phone || billingAddress?.phone)?.replace(/^\+/, '')

    // Send SMS to customer (if phone number available)
    if (customerPhone) {
      const customerMessage = `
        Bonjour ${shippingAddress.first_name || 'Cher client'},

        Votre commande #${order.display_id} a été confirmée !

        Montant total: MAD ${(Number(order.total || 0) / 100).toFixed(2)}
        Articles: ${order.items?.length || 0} produit(s)

        Nous vous tiendrons informé de l'expédition.

        Merci pour votre confiance !
        L'équipe Manzili
      `.trim()

      await smsService.sendSMS(customerPhone, customerMessage)
      console.log(`Order confirmation SMS sent to customer: ${customerPhone}`)
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Send SMS notification to admin/store owner
    const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER || "212770362167"
    const adminMessage = `
      ***NOUVELLE COMMANDE!***

      Commande #${order.display_id}
      Client: ${shippingAddress?.first_name} ${shippingAddress?.last_name}
      Email: ${order.email}
      Montant: MAD ${(Number(order.total || 0) / 100).toFixed(2)}
      Articles: ${order.items?.length || 0}

      Voir dans l'admin: ${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/orders/${order.id}

      ${JSON.stringify(order)}



      
    `.trim()

    await smsService.sendSMS(adminPhoneNumber, adminMessage)
    console.log(`Order notification SMS sent to admin: ${adminPhoneNumber}`)
  } catch (error) {
    console.error('Error sending SMS notifications:', error);
    // Don't throw - SMS failure shouldn't break the order process
  }
}

export const config: SubscriberConfig = {
  event: 'order.placed'
}

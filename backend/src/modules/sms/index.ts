import { Module } from "@medusajs/framework/utils"
import SMSService from "./service"

export const SMS_MODULE = "sms"

export default Module(SMS_MODULE, {
  service: SMSService,
})
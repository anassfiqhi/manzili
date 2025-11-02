"use client"

import { useState } from "react"
import { Heading, Text } from "@medusajs/ui"

import Input from "@modules/common/components/input"
import { Button } from "@/components/ui/button"

const ContactTemplate = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitted(true)
    setIsSubmitting(false)
    
    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    }, 3000)
  }

  if (isSubmitted) {
    return (
      <div className="content-container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <Heading level="h1" className="text-green-800 mb-4">
              Message envoyé avec succès !
            </Heading>
            <Text className="text-green-700">
              Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.
            </Text>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="content-container py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <Heading level="h1" className="mb-4">
            Contactez notre support
          </Heading>
          <Text size="large" className="text-ui-fg-subtle">
            Nous sommes là pour vous aider. N'hésitez pas à nous faire part de vos questions ou préoccupations.
          </Text>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nom complet"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Adresse e-mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <Input
            label="Sujet"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleInputChange}
            required
          />

          <div className="flex flex-col w-full">
            <label 
              htmlFor="message" 
              className="mb-2 txt-compact-medium-plus text-ui-fg-base"
            >
              Message <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleInputChange}
              required
              className="pt-4 pb-1 block w-full px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover resize-none"
              placeholder="Décrivez votre demande ou votre problème en détail..."
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[200px]"
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
            </Button>
          </div>
        </form>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <Heading level="h3" className="text-lg">
              E-mail
            </Heading>
            <Text className="text-ui-fg-subtle">
              {process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@sweet-nest.com"}
            </Text>
          </div>
          
          <div className="space-y-2">
            <Heading level="h3" className="text-lg">
              Téléphone
            </Heading>
            <Text className="text-ui-fg-subtle">
              {process.env.NEXT_PUBLIC_CONTACT_PHONE || "+33 1 23 45 67 89"}
            </Text>
          </div>
          
          <div className="space-y-2">
            <Heading level="h3" className="text-lg">
              Heures d'ouverture
            </Heading>
            <Text className="text-ui-fg-subtle">
              {process.env.NEXT_PUBLIC_BUSINESS_HOURS_WEEKDAYS || "Lun-Ven: 9h-18h"}<br />
              {process.env.NEXT_PUBLIC_BUSINESS_HOURS_WEEKEND || "Sam: 10h-16h"}
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactTemplate
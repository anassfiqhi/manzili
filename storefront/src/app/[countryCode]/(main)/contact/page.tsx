import { Metadata } from "next"

import ContactTemplate from "@modules/contact/templates"

export const metadata: Metadata = {
  title: "Contact Support",
  description: "Contactez notre équipe d'assistance pour toute question ou demande d'aide.",
}

export default function ContactPage() {
  return <ContactTemplate />
}
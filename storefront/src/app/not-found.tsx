import { Metadata } from "next"
import NotFoundClient from "./not-found-client"

export const metadata: Metadata = {
  title: "404",
  description: "Une erreur s'est produite",
}

export default function NotFound() {
  return <NotFoundClient />
}

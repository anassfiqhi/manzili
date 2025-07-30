import { Metadata } from "next"

import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import { getBaseURL } from "@lib/util/env"
import BackgroundOverlay from "@/modules/common/components/background-overlay"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <BackgroundOverlay />
      <Nav />
      {props.children}
      <Footer />
    </>
  )
}

import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import QueryProvider from "@lib/providers/query-provider"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <QueryProvider>
          <main className="relative">{props.children}</main>
        </QueryProvider>
      </body>
    </html>
  )
}

import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import QueryProvider from "@lib/providers/query-provider"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  icons: {
    icon: [
      {
        url: '/sweethome-black.ico',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/sweethome-white.ico',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <body>
        <QueryProvider>
          <main className="relative">{props.children}</main>
        </QueryProvider>
      </body>
    </html>
  )
}

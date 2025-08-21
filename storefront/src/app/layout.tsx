import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import QueryProvider from "@lib/providers/query-provider"
import ThemeFavicon from "@/components/theme-favicon"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <body>
        <ThemeFavicon />
        <QueryProvider>
          <main className="relative">{props.children}</main>
        </QueryProvider>
      </body>
    </html>
  )
}

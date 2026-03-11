// change global stylesheet to the one in styles/ so that all of our custom
// color variables and Tailwind directives are included. The original
// `app/globals.css` only provided minimal resets and was overriding the
// richer file in `styles/`.
import "../styles/globals.css"
import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "EventHub",
  description: "Event booking platform",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
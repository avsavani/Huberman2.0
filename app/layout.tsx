import { Inter as FontSans } from "next/font/google"
import localFont from "next/font/local"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"

import "@/app/globals.css"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})



interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Huberman ai",
    "Andrew Huberman",
    "Huberman GPT",
    "talk to Huberman",
    "Huberman Lab",
    "Huberman Lab podcast",
  ],
  authors: [
    {
      name: "Ashish Savani",
      url: "https://askhuberman.app",
    },
  ],
  creator: "Ashish Savani",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@shadcn",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
          {children}
      </body>
    </html>
  )
}
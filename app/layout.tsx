import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import { NavigationWrapper } from "@/components/navigation-wrapper"
import { ClerkProviderWrapper } from "@/components/clerk-provider"
import { V0Provider } from "@/lib/v0-context"
import { Toaster } from "sonner"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    template: "%s – Baby Collab",
    default: "Baby Collab – Build Your Career",
  },
  description:
    "Career development platform for college students and early professionals. Build roadmaps, collaborate on projects, and grow your career.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased font-sans`}>
        <V0Provider isV0={true}>
          <ClerkProviderWrapper>
            <NavigationWrapper />
            {children}
            <Toaster />
          </ClerkProviderWrapper>
        </V0Provider>
      </body>
    </html>
  )
}
import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { TeamProvider } from "@/contexts/TeamContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Plyow - Scientific Method Manager",
  description: "Search, organize, and build pipelines with scientific methods from our comprehensive library.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TeamProvider>
            {children}
          </TeamProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

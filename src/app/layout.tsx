import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import ScrollToTopButton from "@/components/ScrollToTopButton"
import { ThemeProvider } from "@/components/theme-provider"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Study Sphere",
  description: "A platform for collaborative learning and knowledge sharing",
  keywords: ["study", "learning", "education", "flashcards", "notes", "quizzes"],
  authors: [{ name: "Study Sphere Team" }],
  creator: "Study Sphere",
  publisher: "Study Sphere",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ]
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    title: "Study Sphere",
    description: "A platform for collaborative learning and knowledge sharing",
    url: "https://study-sphere.com",
    siteName: "Study Sphere",
    images: [
      {
        url: "/og banner.png",
        width: 1200,
        height: 630,
        alt: "Study Sphere - Collaborative Learning Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Sphere",
    description: "A platform for collaborative learning and knowledge sharing",
    images: ["/og banner.png"]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          {children}
          <ScrollToTopButton />
        </ThemeProvider>
      </body>
    </html>
  )
}

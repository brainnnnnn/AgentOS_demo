import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "FEconf 2025 - Frontend Developer Conference",
  description: "Korea's largest frontend development conference",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts via CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Questrial&family=Orbitron:wght@400;500;600;700&family=Zen+Dots&display=swap"
          rel="stylesheet"
        />
        {/* Korean fonts */}
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/packages/pretendard/dist/web/static/pretendard.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/gh/hyundai-42dot/42dot-font@main/dist/web/css/42dot_font.css"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-questrial: 'Questrial', sans-serif;
            --font-orbitron: 'Orbitron', sans-serif;
            --font-zen-dots: 'Zen Dots', cursive;
          }
        `}</style>
      </head>
      <body style={{ fontFamily: 'var(--font-questrial)' }}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

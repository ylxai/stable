import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'
import '@/styles/heart-animations.css'
import '@/styles/color-palette.css'
import '@/styles/hero-enhancements.css'

export const metadata: Metadata = {
  title: 'Hafi Portrait - Photo Sharing untuk Event',
  description: 'Platform berbagi foto untuk event dan acara spesial',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 
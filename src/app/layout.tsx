// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hernandez Jumpers - Sales & Rentals',
  description: 'Industrial quality bounce houses, tables, and chairs for sale and rent. Duramax products with 2-year warranty. Serving Phoenix, Arizona.',
  keywords: 'bounce house, party rentals, tables, chairs, Phoenix, Arizona, Duramax, party supplies',
  authors: [{ name: 'Hernandez Jumpers' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
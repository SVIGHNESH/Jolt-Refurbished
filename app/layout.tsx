import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JOLT // 88 — Sticker-sheet notes',
  description: 'A loud little notebook. Memphis arcade aesthetic.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

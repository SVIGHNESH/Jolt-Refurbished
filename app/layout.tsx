import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JOLT — Notes',
  description: 'Minimal editorial notes app',
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

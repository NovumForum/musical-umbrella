import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Novum Focus - AI-Powered Productivity Timer',
  description: 'Turn your focus into productivity with our AI-powered focus timer and task tracker. Perfect for remote workers and entrepreneurs.',
  keywords: 'focus timer, productivity, pomodoro, task management, deep work, remote work',
  authors: [{ name: 'Novum Focus' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
  openGraph: {
    title: 'Novum Focus - AI-Powered Productivity Timer',
    description: 'Turn your focus into productivity with our AI-powered focus timer and task tracker.',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Novum Focus - AI-Powered Productivity Timer',
    description: 'Turn your focus into productivity with our AI-powered focus timer and task tracker.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

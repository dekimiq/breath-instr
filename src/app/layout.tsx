import { SmoothScroll } from '@/providers/SmoothScroll'
import type { Metadata } from 'next'

import { ChatWrapper } from '@/components/features/chat/ChatWrapper'

import '@/styles/globals.scss'

export const metadata: Metadata = {
  title: 'Vspolohi',
  description: 'Дыхание - инструмент для решения проблем.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body>
        <SmoothScroll>
          {children}
          <ChatWrapper />
        </SmoothScroll>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'

import '@/app/(landing)/landing.scss'

import { Header } from '@/components/features/landing/Header/Header'

export const metadata: Metadata = {
  title: 'Vspolohi',
  description:
    'Дыхание — эффективный инструмент для снятия стресса, тревоги и восстановления энергии. Пройдите консультацию у специалиста по дыхательным практикам и верните контроль над своим состоянием.',
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="landing-layout">
      <Header />
      <main>{children}</main>
    </div>
  )
}

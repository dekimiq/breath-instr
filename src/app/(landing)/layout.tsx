import type { Metadata } from 'next'

import '@/app/(landing)/landing.scss'

import { Header } from '@/components/features/landing/Header/Header'

export const metadata: Metadata = {
  title: 'Breath Instr - Landing',
  description: 'Landing page for Breath Instr',
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

'use client'

import { usePathname } from 'next/navigation'

import Chat from '@/components/features/chat/Chat'

export function ChatWrapper() {
  const pathname = usePathname()
  const isAdminPage =
    pathname?.startsWith('/login') || pathname?.startsWith('/management-portal')

  if (isAdminPage) return null
  return <Chat />
}

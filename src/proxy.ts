import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { decrypt } from '@/services/auth'

export async function proxy(request: NextRequest) {
  const session = request.cookies.get('session')?.value

  // Приватные /api/admin
  if (
    request.nextUrl.pathname.startsWith('/api/admin') &&
    request.nextUrl.pathname !== '/api/admin/login'
  ) {
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      await decrypt(session)
      return NextResponse.next()
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin/:path*'],
}

import { db } from '@/db'
import { users } from '@/db/schema'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { encrypt } from '@/services/auth'

export async function POST(request: Request) {
  try {
    const { login, password } = await request.json()

    if (!login || !password) {
      return NextResponse.json(
        { error: 'Логин и пароль обязательны' },
        { status: 400 }
      )
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.login, login))
      .limit(1)

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'Неверные учетные данные' },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].passwordHash)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Неверные учетные данные' },
        { status: 401 }
      )
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({
      userId: user[0].id,
      login: user[0].login,
      expires,
    })

    ;(await cookies()).set('session', session, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

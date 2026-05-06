import { db } from '@/db'
import { settings } from '@/db/schema'
import axios from 'axios'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const allSettings = await db.select().from(settings)
    return NextResponse.json(allSettings)
  } catch (error) {
    console.error('[Settings API] GET error:', error)
    return NextResponse.json(
      { error: 'Не удалось загрузить настройки' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as
      | { key: string; value: unknown }
      | { key: string; value: unknown }[]

    if (Array.isArray(body)) {
      for (const item of body) {
        if (item.key === 'AI_IP_LIMIT' || item.key === 'AI_USAGE_RESET_DAYS') {
          const val = item.value
          if (Number(val) < 3) {
            return NextResponse.json(
              { error: `Лимит для ${item.key} должен быть не менее 3` },
              { status: 400 }
            )
          }
        }
      }

      const baseUrlSetting = body.find((s) => s.key === 'AI_BASE_URL')
      if (baseUrlSetting && typeof baseUrlSetting.value === 'string') {
        try {
          await axios.get(baseUrlSetting.value, { timeout: 5000 })
        } catch {
          return NextResponse.json(
            {
              error:
                'Не удалось подключиться к указанному Base URL. Проверьте правильность адреса.',
            },
            { status: 400 }
          )
        }
      }

      for (const item of body) {
        await db
          .update(settings)
          .set({ value: String(item.value) })
          .where(eq(settings.key, item.key))
      }

      return NextResponse.json({ success: true })
    }

    const { key, value } = body
    if (!key) {
      return NextResponse.json({ error: 'Ключ обязателен' }, { status: 400 })
    }

    if (key === 'AI_IP_LIMIT' || key === 'AI_USAGE_RESET_DAYS') {
      const val = value
      if (Number(val) < 3) {
        return NextResponse.json(
          { error: `Лимит для ${key} должен быть не менее 3` },
          { status: 400 }
        )
      }
    }

    if (key === 'AI_BASE_URL' && typeof value === 'string') {
      try {
        await axios.get(value, {
          timeout: 5000,
          ...(process.env.USE_PROXY === 'false' && { proxy: false }),
        })
      } catch {
        return NextResponse.json(
          {
            error:
              'Не удалось подключиться к указанному Base URL. Проверьте правильность адреса.',
          },
          { status: 400 }
        )
      }
    }

    await db
      .update(settings)
      .set({ value: String(value) })
      .where(eq(settings.key, key))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json(
      { error: 'Не удалось обновить настройки' },
      { status: 500 }
    )
  }
}

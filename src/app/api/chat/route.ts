export const dynamic = 'force-dynamic'

import { db } from '@/db'
import { aiUsage } from '@/db/schema'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText } from 'ai'
import { eq, sql } from 'drizzle-orm'
import * as fs from 'fs'
import { headers } from 'next/headers'
import * as path from 'path'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
})

const MODEL_NAME = process.env.AI_MODEL_NAME || 'openai/gpt-3.5-turbo'
const MAX_CHARS = Number(process.env.MAX_CHAT_CHARS) || 128
const DAILY_LIMIT = Number(process.env.DAILY_IP_LIMIT) || 3
const REQUEST_TIMEOUT = 10000

export async function POST(req: Request) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const { message } = await req.json()

    if (!message || message.length > MAX_CHARS) {
      return new Response(
        JSON.stringify({
          error: `Сообщение слишком длинное (макс. ${MAX_CHARS} символов)`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const personaPath = path.join(process.cwd(), 'docs', 'bot_instruction.md')
    let systemPromptContent =
      'You are a helpful and empathetic breathwork instructor AI.'
    if (fs.existsSync(personaPath)) {
      systemPromptContent = fs.readFileSync(personaPath, 'utf8')
    }

    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1'
    const isLocalhost =
      ip === '127.0.0.1' ||
      ip === '::1' ||
      ip === 'localhost' ||
      ip.endsWith('127.0.0.1')

    if (isLocalhost) {
      console.warn(
        `[AI API] Request from localhost (${ip}): Rate limit bypassed.`
      )
    }

    const todayDateStr = new Date().toISOString().split('T')[0]

    const existingUsage = isLocalhost
      ? []
      : await db
          .select()
          .from(aiUsage)
          .where(
            sql`${aiUsage.ip} = ${ip} AND ${aiUsage.date} = ${todayDateStr}::date`
          )

    if (!isLocalhost) {
      if (existingUsage.length > 0) {
        const currentCount = existingUsage[0].requestCount
        if (currentCount >= DAILY_LIMIT) {
          return new Response(
            JSON.stringify({
              error: 'Лимит запросов на сегодня исчерпан.',
              code: 'SESSION_LIMIT_REACHED',
            }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
          )
        }

        await db
          .update(aiUsage)
          .set({ requestCount: currentCount + 1 })
          .where(eq(aiUsage.id, existingUsage[0].id))
      } else {
        await db.insert(aiUsage).values({
          ip,
          date: todayDateStr,
          requestCount: 1,
        })
      }
    }

    if (Math.random() < 0.01) {
      await db.execute(
        sql`DELETE FROM ${aiUsage} WHERE ${aiUsage.date} < NOW() - INTERVAL '3 months'`
      )
    }

    const result = streamText({
      model: openrouter.chat(MODEL_NAME),
      messages: [
        { role: 'system', content: systemPromptContent },
        { role: 'user', content: message },
      ],
      abortSignal: controller.signal,
    })

    return result.toTextStreamResponse()
  } catch (err: unknown) {
    clearTimeout(timeoutId)
    console.error('AI Proxy Error:', err)

    const error = err as Error
    const isTimeout = error.name === 'AbortError'
    const status = isTimeout ? 504 : 500
    const message = isTimeout
      ? 'Превышено время ожидания ответа.'
      : 'Ошибка сервера при обработке запроса.'

    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  } finally {
    clearTimeout(timeoutId)
  }
}

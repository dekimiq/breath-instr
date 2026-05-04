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
const AI_IP_LIMIT = Number(process.env.AI_IP_LIMIT) || 3
const RESET_DAYS = Number(process.env.AI_USAGE_RESET_DAYS) || 1
const REQUEST_TIMEOUT = 10000

interface ChatHistoryMessage {
  role: 'user' | 'assistant'
  content: string
}

const MEDICAL_KEYWORDS = [
  'лечен',
  'симптом',
  'противопоказан',
  'врач',
  'доктор',
  'препарат',
  'лекарств',
  'таблет',
  'болезн',
  'заболеван',
  'терапи',
  'диагноз',
  'рецепт',
  'больниц',
  'клиник',
  'медицин',
  'здоров',
]

const MEDICAL_DISCLAIMER =
  '\n\n*Не является медицинской консультацией или рекомендацией. Обязательно обратитесь к специалисту.*'

export async function POST(req: Request) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const body = await req.json()
    const message = body.message as string
    const history = body.history as ChatHistoryMessage[]

    if (!message || message.length > MAX_CHARS) {
      return new Response(
        JSON.stringify({
          error: `Сообщение слишком длинное (макс. ${MAX_CHARS} символов)`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const validatedHistory = Array.isArray(history) ? history.slice(-4) : []
    for (const msg of validatedHistory) {
      const isAssistant = msg.role === 'assistant'
      const limit = isAssistant ? MAX_CHARS * 2 : MAX_CHARS
      if (typeof msg.content !== 'string' || msg.content.length > limit) {
        msg.content = msg.content.substring(0, limit)
      }
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
    // For dev
    // const isLocalhost = false
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

    const now = new Date()
    const resetThreshold = new Date(
      now.getTime() - RESET_DAYS * 24 * 60 * 60 * 1000
    )
    const todayDateStr = now.toISOString().split('T')[0]

    const existingUsage = isLocalhost
      ? []
      : await db
          .select()
          .from(aiUsage)
          .where(
            sql`${aiUsage.ip} = ${ip} AND ${aiUsage.date} > ${resetThreshold.toISOString().split('T')[0]}::date`
          )
          .orderBy(sql`${aiUsage.date} DESC`)
          .limit(1)

    let currentUsageCount = 0
    if (!isLocalhost) {
      if (existingUsage.length > 0) {
        const usage = existingUsage[0]
        currentUsageCount = usage.requestCount
        if (currentUsageCount >= AI_IP_LIMIT) {
          return new Response(
            JSON.stringify({
              error: `Лимит запросов (${AI_IP_LIMIT}) исчерпан. Попробуйте позже.`,
              code: 'SESSION_LIMIT_REACHED',
            }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
          )
        }

        await db
          .update(aiUsage)
          .set({
            requestCount: currentUsageCount + 1,
            updatedAt: new Date(),
          })
          .where(eq(aiUsage.id, usage.id))
        currentUsageCount++
      } else {
        await db.insert(aiUsage).values({
          ip,
          date: todayDateStr,
          requestCount: 1,
        })
        currentUsageCount = 1
      }
    }

    if (Math.random() < 0.01) {
      await db.execute(
        sql`DELETE FROM ${aiUsage} WHERE ${aiUsage.date} < NOW() - INTERVAL '3 months'`
      )
    }

    const messages = [
      { role: 'system' as const, content: systemPromptContent },
      ...validatedHistory.map((msg) => ({
        role:
          msg.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ]

    const result = streamText({
      model: openrouter.chat(MODEL_NAME),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: messages as any,
      abortSignal: controller.signal,
      onFinish: async ({ text }) => {
        // Optional: logging or processing
      },
    })

    const containsMedical = messages.some((m) => {
      if (typeof m.content !== 'string') return false
      const content = m.content.toLowerCase()
      return MEDICAL_KEYWORDS.some((keyword) => content.includes(keyword))
    })

    if (containsMedical) {
      const textStream = result.textStream
      const encoder = new TextEncoder()

      const transformStream = new TransformStream({
        async transform(chunk, controller) {
          controller.enqueue(chunk)
        },
        flush(controller) {
          controller.enqueue(encoder.encode(MEDICAL_DISCLAIMER))
        },
      })

      const responseStream = textStream
        .pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              controller.enqueue(encoder.encode(chunk))
            },
          })
        )
        .pipeThrough(transformStream)

      return new Response(responseStream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'x-ai-max-chars': MAX_CHARS.toString(),
          'x-ai-limit-total': AI_IP_LIMIT.toString(),
          'x-ai-limit-remaining': isLocalhost
            ? AI_IP_LIMIT.toString()
            : Math.max(0, AI_IP_LIMIT - currentUsageCount).toString(),
        },
      })
    }

    return result.toTextStreamResponse({
      headers: {
        'x-ai-max-chars': MAX_CHARS.toString(),
        'x-ai-limit-total': AI_IP_LIMIT.toString(),
        'x-ai-limit-remaining': isLocalhost
          ? AI_IP_LIMIT.toString()
          : Math.max(0, AI_IP_LIMIT - currentUsageCount).toString(),
      },
    })
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

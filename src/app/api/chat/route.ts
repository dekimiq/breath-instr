export const dynamic = 'force-dynamic'

import { db } from '@/db'
import { aiUsage, settings } from '@/db/schema'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText } from 'ai'
import axios from 'axios'
import { eq, sql } from 'drizzle-orm'
import { headers } from 'next/headers'

const REQUEST_TIMEOUT = 15000
const MAX_CHARS_USER = 128
const MAX_CHARS_AI_CONTEXT = MAX_CHARS_USER * 2

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
  'самочувс',
]

const MEDICAL_DISCLAIMER =
  '\n\n*Не является медицинской консультацией или рекомендацией. Обязательно обратитесь к специалисту.*'

interface AISettings {
  baseUrl: string
  apiKey: string
  ipLimit: number
  resetDays: number
  systemPrompt: string
  modelName: string
}

async function getAISettings(): Promise<Partial<AISettings>> {
  const allSettings = await db.select().from(settings)
  const config: Partial<AISettings> = {}

  allSettings.forEach((s) => {
    const val = s.value as string
    if (s.key === 'AI_BASE_URL') config.baseUrl = val as string
    else if (s.key === 'AI_API_KEY') config.apiKey = val as string
    else if (s.key === 'AI_IP_LIMIT') config.ipLimit = Number(val)
    else if (s.key === 'AI_USAGE_RESET_DAYS') config.resetDays = Number(val)
    else if (s.key === 'AI_PROMPT') config.systemPrompt = val as string
    else if (s.key === 'AI_MODEL_NAME') config.modelName = val as string
  })

  return config
}

export async function POST(req: Request) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const config = await getAISettings()

    if (
      !config.apiKey ||
      !config.modelName ||
      !config.systemPrompt ||
      !config.baseUrl ||
      config.ipLimit === undefined ||
      config.resetDays === undefined
    ) {
      console.error('[AI API] Missing critical configuration in DB:', config)
      return new Response(
        JSON.stringify({ error: 'Сервис временно недоступен.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const safeConfig = config as AISettings
    const body = await req.json()
    const message = body.message as string
    const history = body.history as ChatHistoryMessage[]

    if (!message || message.length > MAX_CHARS_USER) {
      return new Response(
        JSON.stringify({
          error: `Сообщение слишком длинное (макс. ${MAX_CHARS_USER} символов)`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const openrouter = createOpenRouter({
      apiKey: safeConfig.apiKey,
      baseURL: safeConfig.baseUrl,
      fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = input.toString()
        const method = init?.method || 'GET'

        try {
          const axiosResponse = await axios({
            url,
            method,
            headers: init?.headers as Record<string, string>,
            data: init?.body,
            responseType: 'arraybuffer',
            validateStatus: () => true,
          })

          const response = new Response(axiosResponse.data, {
            status: axiosResponse.status,
            statusText: axiosResponse.statusText,
            headers: axiosResponse.headers as Record<string, string>,
          })

          if (!response.ok) {
            const errorBody = new TextDecoder().decode(axiosResponse.data)
            console.error(`[AI API] Request Failed:`, {
              status: response.status,
              statusText: response.statusText,
              url,
              body: errorBody.slice(0, 500),
            })
          }

          return response
        } catch (axiosError) {
          console.error(`[AI API] Axios Exception for ${url}:`, axiosError)
          throw axiosError
        }
      },
    })

    const validatedHistory = Array.isArray(history) ? history.slice(-4) : []

    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1'

    const isLocalhost = true
    // const isLocalhost = ip === '127.0.0.1' || ip === '::1' || ip === 'localhost'

    const now = new Date()
    const resetThreshold = new Date(
      now.getTime() - safeConfig.resetDays * 24 * 60 * 60 * 1000
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
        if (currentUsageCount >= safeConfig.ipLimit) {
          return new Response(
            JSON.stringify({
              error: `Лимит запросов (${safeConfig.ipLimit}) исчерпан. Попробуйте позже.`,
              code: 'SESSION_LIMIT_REACHED',
            }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
          )
        }
      }
    }

    const responseHeaders = {
      'x-ai-max-chars': MAX_CHARS_USER.toString(),
      'x-ai-limit-total': safeConfig.ipLimit.toString(),
      'x-ai-limit-remaining': isLocalhost
        ? safeConfig.ipLimit.toString()
        : Math.max(0, safeConfig.ipLimit - currentUsageCount).toString(),
    }

    const result = streamText({
      model: openrouter.chat(safeConfig.modelName),
      system: safeConfig.systemPrompt,
      messages: validatedHistory
        .map((msg) => ({
          role:
            msg.role === 'assistant'
              ? ('assistant' as const)
              : ('user' as const),
          content: msg.content.slice(0, MAX_CHARS_AI_CONTEXT),
        }))
        .concat([{ role: 'user' as const, content: message }]),
      abortSignal: controller.signal,
      onFinish: async ({ text }) => {
        if (!isLocalhost && text && text.trim().length > 0) {
          try {
            if (existingUsage.length > 0) {
              const usage = existingUsage[0]
              await db
                .update(aiUsage)
                .set({
                  requestCount: usage.requestCount + 1,
                  updatedAt: new Date(),
                })
                .where(eq(aiUsage.id, usage.id))
            } else {
              await db.insert(aiUsage).values({
                ip,
                date: todayDateStr,
                requestCount: 1,
              })
            }
            console.log(`[AI API] Usage recorded for IP: ${ip}`)
          } catch (dbError) {
            console.error(
              '[AI API] Failed to record usage in onFinish:',
              dbError
            )
          }
        }
      },
    })

    const encoder = new TextEncoder()
    const reader = result.textStream.getReader()
    let fullText = ''

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            fullText += value
            controller.enqueue(encoder.encode(value))
          }

          const containsMedical = MEDICAL_KEYWORDS.some((keyword) =>
            fullText.toLowerCase().includes(keyword)
          )
          const alreadyHasDisclaimer = fullText.includes(
            MEDICAL_DISCLAIMER.trim()
          )

          if (
            containsMedical &&
            !alreadyHasDisclaimer &&
            fullText.trim().length > 0
          ) {
            controller.enqueue(encoder.encode(MEDICAL_DISCLAIMER))
          }
          controller.close()
        } catch (err) {
          console.error('[Stream Error]:', err)
          controller.error(err)
        } finally {
          reader.releaseLock()
        }
      },
    })

    return new Response(responseStream, {
      headers: {
        ...responseHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (err: unknown) {
    clearTimeout(timeoutId)
    console.error('[AI API] CRITICAL ERROR:', err)
    const error = err as Error
    const isTimeout = error.name === 'AbortError'
    return new Response(
      JSON.stringify({
        error: isTimeout ? 'Превышено время ожидания.' : 'Ошибка сервера.',
      }),
      {
        status: isTimeout ? 504 : 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } finally {
    clearTimeout(timeoutId)
  }
}

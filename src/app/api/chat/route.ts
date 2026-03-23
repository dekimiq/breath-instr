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

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const personaPath = path.join(process.cwd(), 'docs', 'ai_persona.md')
    let systemPromptContent =
      'You are a helpful and empathetic breathwork instructor AI.'
    if (fs.existsSync(personaPath)) {
      systemPromptContent = fs.readFileSync(personaPath, 'utf8')
    }

    const systemPromptMessage = {
      role: 'system',
      content: systemPromptContent,
    }

    const oopsPath = path.join(process.cwd(), 'docs', 'ai_limit_message.md')
    let oopsMessage = 'Daily limit reached. Try again tomorrow.'
    if (fs.existsSync(oopsPath)) {
      oopsMessage = fs.readFileSync(oopsPath, 'utf8')
    }

    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1'

    const todayDateStr = new Date().toISOString().split('T')[0]

    const existingUsage = await db
      .select()
      .from(aiUsage)
      .where(
        sql`${aiUsage.ip} = ${ip} AND ${aiUsage.date} = ${todayDateStr}::date`
      )

    if (existingUsage.length > 0) {
      if (existingUsage[0].requestCount >= 3) {
        return new Response(JSON.stringify({ error: oopsMessage }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      await db
        .update(aiUsage)
        .set({ requestCount: existingUsage[0].requestCount + 1 })
        .where(eq(aiUsage.id, existingUsage[0].id))
    } else {
      await db.insert(aiUsage).values({
        ip,
        date: todayDateStr,
        requestCount: 1,
      })
    }

    if (Math.random() < 0.01) {
      await db.execute(
        sql`DELETE FROM ${aiUsage} WHERE ${aiUsage.date} < NOW() - INTERVAL '3 months'`
      )
    }

    const result = streamText({
      model: openrouter.chat('openai/gpt-3.5-turbo'),
      messages: [systemPromptMessage, ...messages],
    })

    return result.toTextStreamResponse()
  } catch (err: unknown) {
    console.error('AI Proxy Error:', err)
    return new Response(
      JSON.stringify({ error: 'Failed to generate response.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

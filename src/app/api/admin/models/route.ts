import axios from 'axios'
import { NextResponse } from 'next/server'

interface Model {
  id: string
  name: string
}

let cachedModels: Model[] | null = null
let lastFetchTime = 0
const CACHE_TTL = 1000 * 60 * 60

export async function GET() {
  try {
    if (cachedModels && Date.now() - lastFetchTime < CACHE_TTL) {
      return NextResponse.json(cachedModels)
    }

    const RECOMMENDED_IDS = [
      'google/gemini-2.0-flash-001',
      'mistralai/mistral-small-3.1-24b-instruct',
      'meta-llama/llama-4-scout',
      'openai/gpt-4o-mini',
      'anthropic/claude-3.5-haiku',
      'deepseek/deepseek-chat',
    ]

    const response = await axios.get('https://openrouter.ai/api/v1/models', {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer':
          process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Breath Instr Admin',
      },
      timeout: 10000,
    })

    const allModels = response.data.data as Model[]

    const recommended = allModels
      .filter((m) => RECOMMENDED_IDS.includes(m.id))
      .map((m) => ({ id: m.id, name: `⭐ ${m.name}` }))

    const filteredModels = [...recommended]

    cachedModels = filteredModels
    lastFetchTime = Date.now()

    return NextResponse.json(filteredModels)
  } catch (error) {
    if (cachedModels) {
      console.warn('Using stale cache due to OpenRouter error:', error)
      return NextResponse.json(cachedModels)
    }

    console.error('Failed to fetch models from OpenRouter:', error)
    return NextResponse.json(
      { error: 'Не удалось загрузить список моделей' },
      { status: 500 }
    )
  }
}

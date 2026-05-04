import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
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
    })

    const allModels = response.data.data as { id: string; name: string }[]

    const recommended = allModels
      .filter((m) => RECOMMENDED_IDS.includes(m.id))
      .map((m) => ({ id: m.id, name: `⭐ ${m.name}` }))

    // const popularKeywords = ['gpt', 'claude', 'gemini', 'llama', 'mistral', 'deepseek']
    // const others = allModels
    //   .filter(m => {
    //     const id = m.id.toLowerCase()
    //     return !RECOMMENDED_IDS.includes(m.id) && popularKeywords.some(kw => id.includes(kw))
    //   })
    //   .map(m => ({ id: m.id, name: m.name }))
    //   .slice(0, 50)

    // const filteredModels = [...recommended, ...others]
    const filteredModels = [...recommended]

    return NextResponse.json(filteredModels)
  } catch (error) {
    console.error('Failed to fetch models from OpenRouter:', error)
    return NextResponse.json(
      { error: 'Не удалось загрузить список моделей' },
      { status: 500 }
    )
  }
}

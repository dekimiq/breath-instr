import { config } from '@dotenvx/dotenvx'
import bcrypt from 'bcrypt'
import fs from 'fs'
import crypto from 'node:crypto'
import path from 'path'

import { db } from './index'
import { users, settings } from './schema'

config()

async function seed() {
  console.log('🌱 Seeding database...')

  const adminHash = crypto.randomBytes(3).toString('hex')
  const login = `admin_${adminHash}`
  const password = crypto.randomBytes(8).toString('hex')
  const passwordHash = await bcrypt.hash(password, 10)

  try {
    await db.insert(users).values({
      login,
      passwordHash,
    })
    console.log('✅ Admin user created:')
    console.log(`   Login: ${login}`)
    console.log(`   Password: ${password}`)
    console.log('   -----------------------------------')
  } catch {
    console.log('⚠️ Admin user might already exist, skipping...')
  }

  let defaultPrompt = ''
  try {
    const promptPath = path.join(process.cwd(), 'docs/bot_instruction.md')
    defaultPrompt = fs.readFileSync(promptPath, 'utf-8')
  } catch {
    console.warn('⚠️ docs/bot_instruction.md not found, using empty prompt')
  }

  const defaultSettings = [
    {
      key: 'AI_PROMPT',
      value: defaultPrompt,
      description: 'Системный промпт для ИИ',
    },
    {
      key: 'AI_BASE_URL',
      value: 'https://openrouter.ai/api/v1',
      description: 'Base URL для API запросов (OpenRouter или прокси)',
    },
    {
      key: 'AI_API_KEY',
      value: '',
      description: 'API ключ для доступа к моделям',
    },
    {
      key: 'AI_MODEL_NAME',
      value: 'openai/gpt-3.5-turbo',
      description: 'Название используемой модели',
    },
    {
      key: 'AI_IP_LIMIT',
      value: String(process.env.AI_IP_LIMIT || '3'),
      description: 'Лимит запросов на один IP',
    },
    {
      key: 'AI_USAGE_RESET_DAYS',
      value: String(process.env.AI_USAGE_RESET_DAYS || '7'),
      description: 'Период сброса лимитов (в днях)',
    },
  ]

  for (const setting of defaultSettings) {
    try {
      await db
        .insert(settings)
        .values(setting)
        .onConflictDoUpdate({
          target: settings.key,
          set: {
            value: setting.value,
            updatedAt: new Date(),
          },
        })
      console.log(`✅ Setting ${setting.key} initialized`)
    } catch (error) {
      console.error(`❌ Failed to seed setting ${setting.key}:`, error)
    }
  }

  console.log('✨ Seeding completed!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})

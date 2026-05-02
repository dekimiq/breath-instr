import { config } from '@dotenvx/dotenvx'
import { defineConfig } from 'drizzle-kit'

config()

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DATABASE_URL?.replace(
        '${POSTGRES_USER}',
        process.env.POSTGRES_USER || ''
      )
        .replace('${POSTGRES_PASSWORD}', process.env.POSTGRES_PASSWORD || '')
        .replace('${POSTGRES_DB}', process.env.POSTGRES_DB || '') || '',
  },
  verbose: true,
  strict: true,
})

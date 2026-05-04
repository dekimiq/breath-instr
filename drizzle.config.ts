import { config } from '@dotenvx/dotenvx'
import { defineConfig } from 'drizzle-kit'

config()

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'localhost',
    port: 5435,
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'postgres_password_123',
    database: process.env.POSTGRES_DB || 'breath_instr',
    ssl: false,
  },
  verbose: true,
  strict: true,
})

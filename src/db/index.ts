import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import * as schema from './schema'

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: 5432,
  user: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'postgres_password_123',
  database: process.env.POSTGRES_DB || 'breath_instr',
})

export const db = drizzle({ client: pool, schema })

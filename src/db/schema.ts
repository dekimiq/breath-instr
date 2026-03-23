import {
  pgTable,
  text,
  date,
  integer,
  uuid,
  timestamp,
} from 'drizzle-orm/pg-core'

// Rate limiting для AI запросов (по IP)
export const aiUsage = pgTable('ai_usage', {
  id: uuid('id').defaultRandom().primaryKey(),
  ip: text('ip').notNull(),
  date: date('date').notNull(),
  requestCount: integer('request_count').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

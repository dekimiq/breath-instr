import {
  pgTable,
  text,
  date,
  integer,
  uuid,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

// Таблица пользователей для админки
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  login: varchar('login', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Таблица настроек (AI и прочее)
export const settings = pgTable('settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Rate limiting для AI запросов (по IP)
export const aiUsage = pgTable('ai_usage', {
  id: uuid('id').defaultRandom().primaryKey(),
  ip: text('ip').notNull(),
  date: date('date').notNull(),
  requestCount: integer('request_count').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

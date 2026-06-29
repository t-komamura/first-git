import { pgTable, uuid, text, integer, json, timestamp, index, check } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export interface Ingredient {
  name: string
  amount: string
}

export interface Step {
  order: number
  text: string
}

export const dishes = pgTable('dishes', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  category: text('category'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => [
  index('dishes_category_idx').on(t.category),
])

export const variations = pgTable('variations', {
  id: uuid('id').defaultRandom().primaryKey(),
  dishId: uuid('dish_id')
    .references(() => dishes.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  rating: integer('rating'),
  ingredients: json('ingredients').$type<Ingredient[]>().notNull().default([]),
  steps: json('steps').$type<Step[]>().notNull().default([]),
  memo: text('memo'),
  lastCookedAt: timestamp('last_cooked_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
}, (t) => [
  index('variations_dish_id_idx').on(t.dishId),
  check('rating_range', sql`${t.rating} BETWEEN 1 AND 5`),
])

export type Dish = typeof dishes.$inferSelect
export type Variation = typeof variations.$inferSelect
export type NewDish = typeof dishes.$inferInsert
export type NewVariation = typeof variations.$inferInsert

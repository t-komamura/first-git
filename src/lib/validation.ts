import { z } from 'zod'

export const ingredientSchema = z.object({
  name: z.string().max(100),
  amount: z.string().max(100),
})

export const stepSchema = z.object({
  order: z.number().int(),
  text: z.string().max(2000),
})

export const dishCreateSchema = z.object({
  title: z.string().min(1).max(200),
  category: z.string().max(50).optional().nullable(),
})

export const dishUpdateSchema = dishCreateSchema.partial().refine(
  obj => Object.keys(obj).length > 0,
  { message: '少なくとも1つのフィールドが必要です' }
)

export const variationCreateSchema = z.object({
  name: z.string().min(1).max(200),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  ingredients: z.array(ingredientSchema).default([]),
  steps: z.array(stepSchema).default([]),
  memo: z.string().max(5000).optional().nullable(),
  lastCookedAt: z.string().datetime().optional().nullable(),
})

export const variationUpdateSchema = variationCreateSchema.partial().refine(
  obj => Object.keys(obj).length > 0,
  { message: '少なくとも1つのフィールドが必要です' }
)

// AIパース入力のテキスト上限（プロンプトインジェクション/コスト対策）
export const PARSE_TEXT_MAX = 8000

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dishes, variations } from '@/lib/schema'
import { dishCreateSchema } from '@/lib/validation'
import { desc, ilike, or, eq, sql, and } from 'drizzle-orm'

// GET /api/dishes?q=...&category=...
// 親料理一覧。各料理のバリエーション数とベスト評価を含める。
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const category = searchParams.get('category')?.trim()

  const rows = await db
    .select({
      id: dishes.id,
      title: dishes.title,
      category: dishes.category,
      createdAt: dishes.createdAt,
      variationCount: sql<number>`count(${variations.id})::int`,
      bestRating: sql<number | null>`max(${variations.rating})::int`,
    })
    .from(dishes)
    .leftJoin(variations, eq(variations.dishId, dishes.id))
    .where(
      and(
        category ? eq(dishes.category, category) : undefined,
        q
          ? or(
              ilike(dishes.title, `%${q}%`),
              sql`exists (select 1 from ${variations} v where v.dish_id = ${dishes.id} and exists (select 1 from json_array_elements(v.ingredients) e where e->>'name' ilike ${'%' + q + '%'}))`
            )
          : undefined
      )
    )
    .groupBy(dishes.id)
    .orderBy(sql`max(${variations.rating}) DESC NULLS LAST`, desc(dishes.createdAt))

  return NextResponse.json(rows)
}

// POST /api/dishes
export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const parsed = dishCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const [dish] = await db.insert(dishes).values(parsed.data).returning()
  return NextResponse.json(dish, { status: 201 })
}

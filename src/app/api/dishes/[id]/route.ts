import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dishes, variations } from '@/lib/schema'
import { dishUpdateSchema } from '@/lib/validation'
import { eq, desc, sql } from 'drizzle-orm'

// GET /api/dishes/[id] — 親料理 + バリエーション一覧（★順、同率は最終調理日が新しい順）
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [dish] = await db.select().from(dishes).where(eq(dishes.id, id))
  if (!dish) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const vars = await db
    .select()
    .from(variations)
    .where(eq(variations.dishId, id))
    .orderBy(sql`${variations.rating} desc nulls last`, desc(variations.lastCookedAt))

  return NextResponse.json({ ...dish, variations: vars })
}

// PATCH /api/dishes/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const parsed = dishUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const [dish] = await db.update(dishes).set(parsed.data).where(eq(dishes.id, id)).returning()
  if (!dish) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(dish)
}

// DELETE /api/dishes/[id] — バリエーションはcascadeで連鎖削除
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const deleted = await db.delete(dishes).where(eq(dishes.id, id)).returning()
  if (deleted.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { variations, dishes } from '@/lib/schema'
import { variationCreateSchema } from '@/lib/validation'
import { eq } from 'drizzle-orm'

// POST /api/dishes/[id]/variations
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [dish] = await db.select().from(dishes).where(eq(dishes.id, id))
  if (!dish) return NextResponse.json({ error: 'Dish not found' }, { status: 404 })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const parsed = variationCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { lastCookedAt, ...rest } = parsed.data
  const [variation] = await db
    .insert(variations)
    .values({
      ...rest,
      dishId: id,
      lastCookedAt: lastCookedAt ? new Date(lastCookedAt) : null,
    })
    .returning()
  return NextResponse.json(variation, { status: 201 })
}

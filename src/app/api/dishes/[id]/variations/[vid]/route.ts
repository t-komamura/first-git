import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { variations } from '@/lib/schema'
import { variationUpdateSchema } from '@/lib/validation'
import { eq, and } from 'drizzle-orm'

// GET /api/dishes/[id]/variations/[vid]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string; vid: string }> }) {
  const { id, vid } = await params
  const [variation] = await db
    .select()
    .from(variations)
    .where(and(eq(variations.id, vid), eq(variations.dishId, id)))
  if (!variation) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(variation)
}

// PATCH /api/dishes/[id]/variations/[vid] — 部分更新（rating だけ等もOK）
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; vid: string }> }) {
  const { id, vid } = await params
  const body = await req.json()
  const parsed = variationUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { lastCookedAt, ...rest } = parsed.data
  const values: Record<string, unknown> = { ...rest }
  if (lastCookedAt !== undefined) {
    values.lastCookedAt = lastCookedAt ? new Date(lastCookedAt) : null
  }

  const [variation] = await db
    .update(variations)
    .set(values)
    .where(and(eq(variations.id, vid), eq(variations.dishId, id)))
    .returning()
  if (!variation) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(variation)
}

// DELETE /api/dishes/[id]/variations/[vid]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; vid: string }> }) {
  const { id, vid } = await params
  const deleted = await db
    .delete(variations)
    .where(and(eq(variations.id, vid), eq(variations.dishId, id)))
    .returning()
  if (deleted.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}

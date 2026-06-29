import { NextRequest, NextResponse } from 'next/server'
import { getAllRecipes, createRecipe } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.toLowerCase() || ''
  const category = searchParams.get('category') || ''

  let recipes = await getAllRecipes()

  if (q) {
    recipes = recipes.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.ingredients.some(i => i.name.toLowerCase().includes(q))
    )
  }
  if (category) {
    recipes = recipes.filter(r => r.category === category)
  }

  recipes.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  return NextResponse.json(recipes)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const recipe = await createRecipe(body)
  return NextResponse.json(recipe, { status: 201 })
}

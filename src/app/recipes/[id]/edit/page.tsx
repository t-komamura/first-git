'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import RecipeForm from '@/components/RecipeForm'
import { Recipe } from '@/lib/db'

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>()
  const [recipe, setRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    fetch(`/api/recipes/${id}`).then(r => r.json()).then(setRecipe)
  }, [id])

  if (!recipe) return <div className="min-h-screen bg-orange-50 flex items-center justify-center text-gray-400">読み込み中...</div>

  return (
    <main className="min-h-screen bg-orange-50">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/recipes/${id}`} className="text-orange-500 hover:text-orange-700 text-2xl">←</Link>
          <h1 className="text-xl font-bold text-gray-800">レシピを編集</h1>
        </div>
        <RecipeForm initial={recipe} />
      </div>
    </main>
  )
}

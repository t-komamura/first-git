'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import StarRating from '@/components/StarRating'
import { Recipe } from '@/lib/db'

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    fetch(`/api/recipes/${id}`).then(r => r.json()).then(setRecipe)
  }, [id])

  async function handleDelete() {
    if (!confirm('このレシピを削除しますか？')) return
    await fetch(`/api/recipes/${id}`, { method: 'DELETE' })
    router.push('/')
    router.refresh()
  }

  if (!recipe) return <div className="min-h-screen bg-orange-50 flex items-center justify-center text-gray-400">読み込み中...</div>

  return (
    <main className="min-h-screen bg-orange-50">
      <div className="max-w-2xl mx-auto pb-24">
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-56 object-cover" />
        ) : (
          <div className="w-full h-56 bg-orange-100 flex items-center justify-center text-7xl">🍽️</div>
        )}

        <div className="px-4 pt-5 space-y-5">
          <div className="flex items-start justify-between gap-2">
            <Link href="/" className="text-orange-500 hover:text-orange-700 text-2xl mt-0.5">←</Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">{recipe.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                {recipe.category && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{recipe.category}</span>}
                <StarRating value={recipe.rating} readonly size="sm" />
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/recipes/${id}/edit`} className="text-sm text-gray-500 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100">編集</Link>
              <button onClick={handleDelete} className="text-sm text-red-400 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50">削除</button>
            </div>
          </div>

          {recipe.description && (
            <p className="text-gray-600 text-sm bg-white rounded-xl p-4">{recipe.description}</p>
          )}

          {/* 食材 */}
          <div className="bg-white rounded-2xl p-4">
            <h2 className="font-bold text-gray-800 mb-3">食材・分量</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex justify-between text-sm border-b border-gray-100 pb-1.5">
                  <span className="text-gray-700">{ing.name}</span>
                  <span className="text-gray-500 font-medium">{ing.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 手順 */}
          <div className="bg-white rounded-2xl p-4">
            <h2 className="font-bold text-gray-800 mb-3">作り方</h2>
            <ol className="space-y-4">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
                  <p className="text-sm text-gray-700 leading-relaxed pt-1">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>

          {recipe.tags && (
            <div className="flex flex-wrap gap-2">
              {recipe.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                <span key={t} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">#{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import RecipeCard from '@/components/RecipeCard'
import { Recipe } from '@/lib/db'

const CATEGORIES = ['和食', '洋食', '中華', 'おつまみ', 'スイーツ', 'その他']

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')

  const load = useCallback(async () => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category) params.set('category', category)
    const res = await fetch(`/api/recipes?${params}`)
    setRecipes(await res.json())
  }, [q, category])

  useEffect(() => { load() }, [load])

  return (
    <main className="min-h-screen bg-orange-50">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-orange-600">🍳 うまかったよランキング</h1>
            <p className="text-sm text-gray-500">作って美味しかったレシピを残そう</p>
          </div>
          <Link
            href="/recipes/new"
            className="bg-orange-500 text-white px-4 py-2.5 rounded-xl font-semibold shadow hover:bg-orange-600 transition-colors text-sm"
          >
            + 追加
          </Link>
        </div>

        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="料理名・食材で検索..."
          className="w-full border bg-white rounded-xl px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
        />

        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          <button
            onClick={() => setCategory('')}
            className={`shrink-0 text-sm px-3 py-1.5 rounded-full border transition-colors ${category === '' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-300'}`}
          >
            すべて
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c === category ? '' : c)}
              className={`shrink-0 text-sm px-3 py-1.5 rounded-full border transition-colors ${category === c ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-300'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🍽️</div>
            <p>レシピがまだありません</p>
            <Link href="/recipes/new" className="mt-4 inline-block text-orange-500 font-semibold">最初のレシピを追加する →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recipes.map((recipe, i) => (
              <RecipeCard key={recipe.id} recipe={recipe} rank={!q && !category ? i + 1 : undefined} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

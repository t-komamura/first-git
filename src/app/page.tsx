'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import DishCard, { DishListItem } from '@/components/DishCard'
import Fab from '@/components/Fab'
import { Category, loadCategories } from '@/lib/categories'

export default function Home() {
  const [dishes, setDishes] = useState<DishListItem[]>([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { setCats(loadCategories()) }, [])

  const load = useCallback(async () => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category) params.set('category', category)
    const res = await fetch(`/api/dishes?${params}`)
    setDishes(await res.json())
    setLoading(false)
  }, [q, category])

  useEffect(() => { load() }, [load])

  const filtering = !!q || !!category

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      {/* 固定ヘッダー: タイトル + チップ。検索バーはスクロールアウト */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold" style={{ color: '#C2410C' }}>🍳 俺のレシピランキング</h1>
        </div>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="料理名・食材で検索..."
          className="w-full border bg-white rounded-xl px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div className="sticky top-0 z-10 backdrop-blur" style={{ backgroundColor: 'rgba(255,248,240,0.9)' }}>
        <div className="max-w-2xl mx-auto px-4 py-2">
          <div className="flex gap-2 overflow-x-auto">
            <Chip active={category === ''} onClick={() => setCategory('')}>すべて</Chip>
            {cats.map(c => (
              <Chip key={c.name} active={category === c.name} onClick={() => setCategory(c.name === category ? '' : c.name)}>
                {c.emoji} {c.name}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4" style={{ paddingBottom: 96 }}>
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map(i => <div key={i} className="h-36 bg-white rounded-2xl animate-pulse" />)}
          </div>
        ) : dishes.length === 0 ? (
          filtering ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p>条件に合う料理が見つかりません</p>
              <button onClick={() => { setQ(''); setCategory('') }} className="mt-4 font-semibold" style={{ color: '#C2410C' }}>絞り込みをクリア</button>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <div className="text-6xl mb-4">🍽️</div>
              <p>まだ料理がありません</p>
              <Link href="/dishes/new" className="mt-4 inline-block font-semibold" style={{ color: '#C2410C' }}>最初の料理を追加する →</Link>
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {dishes.map((d, i) => (
              <DishCard key={d.id} dish={d} rank={!filtering ? i + 1 : undefined} />
            ))}
          </div>
        )}
      </div>

      <Fab />
    </main>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 text-sm px-3 rounded-full border transition-colors whitespace-nowrap"
      style={{
        minHeight: 44,
        backgroundColor: active ? '#E85D04' : '#fff',
        color: active ? '#fff' : '#57534E',
        borderColor: active ? '#E85D04' : '#D6D3D1',
      }}
    >
      {children}
    </button>
  )
}

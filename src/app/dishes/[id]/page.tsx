'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import StarRating from '@/components/StarRating'
import { Dish, Variation } from '@/lib/schema'
import { emojiFor } from '@/lib/categories'

type DishDetail = Dish & { variations: Variation[] }

export default function DishDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [dish, setDish] = useState<DishDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/dishes/${id}`)
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() })
      .then(d => setDish(d))
      .catch(() => setDish(null))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    if (!confirm('この料理とすべてのバリエーションを削除しますか？')) return
    await fetch(`/api/dishes/${id}`, { method: 'DELETE' })
    router.push('/')
    router.refresh()
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400" style={{ backgroundColor: '#FFF8F0' }}>読み込み中...</div>
  if (!dish) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ backgroundColor: '#FFF8F0' }}>
      <p className="text-gray-500">見つかりませんでした</p>
      <Link href="/" style={{ color: '#C2410C' }} className="font-semibold">← ホームに戻る</Link>
    </div>
  )

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="max-w-2xl mx-auto px-4 pt-6" style={{ paddingBottom: 96 }}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-start gap-3">
            <Link href="/" className="text-sm font-semibold mt-1.5" style={{ color: '#C2410C' }}>← ホーム</Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{emojiFor(dish.category)} {dish.title}</h1>
              {dish.category && (
                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FFF1E6', color: '#C2410C' }}>
                  {dish.category}
                </span>
              )}
            </div>
          </div>
          <button onClick={handleDelete} className="text-sm text-red-400 border border-red-200 px-3 py-2.5 rounded-lg hover:bg-red-50 shrink-0">削除</button>
        </div>

        <div className="mt-6 space-y-3">
          {dish.variations.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-white rounded-2xl">
              <p>まだバリエーションがありません</p>
              <Link href={`/dishes/${id}/variations/new`} className="mt-3 inline-block font-semibold" style={{ color: '#C2410C' }}>
                バリエーションを追加する →
              </Link>
            </div>
          ) : (
            dish.variations.map((v, i) => (
              <Link
                key={v.id}
                href={`/dishes/${id}/variations/${v.id}`}
                className="flex items-center gap-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4"
              >
                <span className="text-xl font-bold w-8 shrink-0" style={{ color: '#C2410C' }}>#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 break-words">{v.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating value={v.rating ?? 0} readonly />
                    {v.lastCookedAt && (
                      <span className="text-xs text-gray-400">{new Date(v.lastCookedAt).toLocaleDateString('ja-JP')}</span>
                    )}
                  </div>
                </div>
                <span className="text-gray-300 text-xl">›</span>
              </Link>
            ))
          )}
        </div>

        {dish.variations.length > 0 && (
          <Link
            href={`/dishes/${id}/variations/new`}
            className="mt-4 block text-center border-2 border-dashed rounded-2xl py-4 font-semibold"
            style={{ borderColor: '#FBD9BD', color: '#C2410C' }}
          >
            ＋ バリエーションを追加
          </Link>
        )}
      </div>
    </main>
  )
}

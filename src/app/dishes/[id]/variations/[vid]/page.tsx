'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import StarRating from '@/components/StarRating'
import { Dish, Variation } from '@/lib/schema'

export default function VariationDetailPage() {
  const { id, vid } = useParams<{ id: string; vid: string }>()
  const router = useRouter()
  const [variation, setVariation] = useState<Variation | null>(null)
  const [dish, setDish] = useState<(Dish & { variations: Variation[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMemo, setShowMemo] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`/api/dishes/${id}/variations/${vid}`).then(r => { if (!r.ok) throw new Error(); return r.json() }),
      fetch(`/api/dishes/${id}`).then(r => { if (!r.ok) throw new Error(); return r.json() }),
    ])
      .then(([v, d]) => { setVariation(v); setDish(d) })
      .catch(() => { setVariation(null); setDish(null) })
      .finally(() => setLoading(false))
  }, [id, vid])

  async function handleDelete() {
    if (!confirm('このバリエーションを削除しますか？')) return
    await fetch(`/api/dishes/${id}/variations/${vid}`, { method: 'DELETE' })
    router.push(`/dishes/${id}`)
    router.refresh()
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400" style={{ backgroundColor: '#FFF8F0' }}>読み込み中...</div>
  if (!variation) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ backgroundColor: '#FFF8F0' }}>
      <p className="text-gray-500">見つかりませんでした</p>
      <Link href={`/dishes/${id}`} style={{ color: '#C2410C' }} className="font-semibold">← 料理詳細に戻る</Link>
    </div>
  )

  const rank = dish?.variations?.findIndex(v => v.id === vid)
  const rankLabel = rank !== undefined && rank >= 0 ? ` #${rank + 1}位` : ''

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="max-w-2xl mx-auto px-4 pt-6" style={{ paddingBottom: 96 }}>
        {/* パンくず */}
        <div className="flex items-center gap-2 text-sm mb-3">
          <Link href={`/dishes/${id}`} style={{ color: '#C2410C' }}>← {dish?.title}</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-500">{variation.name}{rankLabel}</span>
        </div>

        <div className="flex items-start justify-between gap-2">
          <h1 className="text-2xl font-bold text-gray-800 break-words">{variation.name}</h1>
          <div className="flex gap-2 shrink-0">
            <Link href={`/dishes/${id}/variations/${vid}/edit`} className="text-sm text-gray-500 border border-gray-300 px-3 py-2.5 rounded-lg hover:bg-gray-100">編集</Link>
            <button onClick={handleDelete} className="text-sm text-red-400 border border-red-200 px-3 py-2.5 rounded-lg hover:bg-red-50">削除</button>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <StarRating value={variation.rating ?? 0} readonly size="sm" />
          {variation.lastCookedAt && (
            <span className="text-sm text-gray-500">最終: {new Date(variation.lastCookedAt).toLocaleDateString('ja-JP')}</span>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4 mt-5">
          <h2 className="font-bold text-gray-800 mb-3">食材・分量</h2>
          {variation.ingredients.length === 0 ? (
            <p className="text-sm text-gray-500">未登録</p>
          ) : (
            <ul className="space-y-2">
              {variation.ingredients.map((ing, i) => (
                <li key={i} className="flex justify-between text-sm border-b border-gray-100 pb-1.5">
                  <span className="text-gray-700">{ing.name}</span>
                  <span className="font-medium" style={{ color: '#78716C' }}>{ing.amount}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4 mt-4">
          <h2 className="font-bold text-gray-800 mb-3">作り方</h2>
          {variation.steps.length === 0 ? (
            <p className="text-sm text-gray-500">未登録</p>
          ) : (
            <ol className="space-y-4">
              {variation.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full text-white text-sm font-bold flex items-center justify-center" style={{ backgroundColor: '#E85D04' }}>{i + 1}</span>
                  <p className="text-sm text-gray-700 leading-relaxed pt-1">{step.text}</p>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* メモ: 折りたたみ（開閉トグル） */}
        {variation.memo && (
          <div className="mt-4">
            {showMemo ? (
              <div className="bg-white rounded-2xl p-4 transition-all duration-300 ease-out">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-bold text-gray-800">メモ・コツ</h2>
                  <button onClick={() => setShowMemo(false)} className="text-sm font-semibold" style={{ color: '#C2410C' }}>∧ 閉じる</button>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{variation.memo}</p>
              </div>
            ) : (
              <button onClick={() => setShowMemo(true)} className="text-sm font-semibold" style={{ color: '#C2410C' }}>
                ∨ メモを見る（{variation.memo.length}文字）
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

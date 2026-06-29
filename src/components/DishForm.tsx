'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AiPasteBox from './AiPasteBox'
import CategorySelect from './CategorySelect'
import VariationFields, { VariationState, emptyVariation } from './VariationFields'
import { Ingredient, Step } from '@/lib/schema'

// 親料理 + 最初のバリエーションをまとめて作成
export default function DishForm({ hideAi = false }: { hideAi?: boolean }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [variation, setVariation] = useState<VariationState>(emptyVariation())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleParsed(data: Record<string, unknown>) {
    if (typeof data.title === 'string') setTitle(data.title)
    if (typeof data.category === 'string') setCategory(data.category)
    setVariation(v => ({
      ...v,
      name: typeof data.name === 'string' && data.name ? data.name : v.name,
      ingredients: Array.isArray(data.ingredients) && data.ingredients.length ? (data.ingredients as Ingredient[]) : v.ingredients,
      steps: Array.isArray(data.steps) && data.steps.length ? (data.steps as Step[]) : v.steps,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const dishRes = await fetch('/api/dishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category: category || null }),
      })
      if (!dishRes.ok) throw new Error()
      const dish = await dishRes.json()

      await fetch(`/api/dishes/${dish.id}/variations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: variation.name,
          rating: variation.rating || null,
          ingredients: variation.ingredients.filter(i => i.name),
          steps: variation.steps.filter(s => s.text),
          memo: variation.memo || null,
          lastCookedAt: variation.lastCookedAt ? new Date(variation.lastCookedAt).toISOString() : null,
        }),
      })
      router.push(`/dishes/${dish.id}`)
      router.refresh()
    } catch {
      setError('保存に失敗しました。もう一度お試しください。')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {!hideAi && <AiPasteBox mode="dish" onParsed={handleParsed} />}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">料理名 *</label>
        <input
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="例: 鶏の照り焼き"
          className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <CategorySelect value={category} onChange={setCategory} />

      <div className="border-t pt-6">
        <p className="text-sm text-gray-500 mb-4">最初のバリエーションを登録します</p>
        <VariationFields state={variation} setState={setVariation} />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full text-white py-3.5 rounded-2xl font-bold text-lg disabled:opacity-50 transition-colors"
        style={{ backgroundColor: '#E85D04' }}
      >
        {saving ? '保存中...' : '保存する'}
      </button>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </form>
  )
}

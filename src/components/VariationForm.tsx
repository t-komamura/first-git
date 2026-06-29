'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AiPasteBox from './AiPasteBox'
import VariationFields, { VariationState, emptyVariation } from './VariationFields'
import { Variation, Ingredient, Step } from '@/lib/schema'

interface VariationFormProps {
  dishId: string
  initial?: Variation
}

function toState(v?: Variation): VariationState {
  if (!v) return emptyVariation()
  return {
    name: v.name,
    rating: v.rating ?? 0,
    ingredients: v.ingredients.length ? v.ingredients : [{ name: '', amount: '' }],
    steps: v.steps.length ? v.steps : [{ order: 1, text: '' }],
    memo: v.memo ?? '',
    lastCookedAt: v.lastCookedAt ? new Date(v.lastCookedAt).toISOString().slice(0, 10) : '',
  }
}

export default function VariationForm({ dishId, initial }: VariationFormProps) {
  const router = useRouter()
  const [state, setState] = useState<VariationState>(toState(initial))
  const [saving, setSaving] = useState(false)

  function handleParsed(data: Record<string, unknown>) {
    setState(s => ({
      ...s,
      name: typeof data.name === 'string' && data.name ? data.name : s.name,
      ingredients: Array.isArray(data.ingredients) && data.ingredients.length ? (data.ingredients as Ingredient[]) : s.ingredients,
      steps: Array.isArray(data.steps) && data.steps.length ? (data.steps as Step[]) : s.steps,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      name: state.name,
      rating: state.rating || null,
      ingredients: state.ingredients.filter(i => i.name),
      steps: state.steps.filter(s => s.text),
      memo: state.memo || null,
      lastCookedAt: state.lastCookedAt ? new Date(state.lastCookedAt).toISOString() : null,
    }
    const url = initial
      ? `/api/dishes/${dishId}/variations/${initial.id}`
      : `/api/dishes/${dishId}/variations`
    const method = initial ? 'PATCH' : 'POST'
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      router.push(`/dishes/${dishId}`)
      router.refresh()
    } catch {
      alert('保存に失敗しました')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {!initial && <AiPasteBox mode="variation" onParsed={handleParsed} />}
      <VariationFields state={state} setState={setState} />
      <button
        type="submit"
        disabled={saving}
        className="w-full text-white py-3.5 rounded-2xl font-bold text-lg disabled:opacity-50 transition-colors"
        style={{ backgroundColor: '#E85D04' }}
      >
        {saving ? '保存中...' : initial ? '更新する' : '保存する'}
      </button>
    </form>
  )
}

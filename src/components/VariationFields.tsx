'use client'

import { useState } from 'react'
import StarRating from './StarRating'
import { IngredientEditor, StepEditor } from './IngredientStepEditor'
import { Ingredient, Step } from '@/lib/schema'

export interface VariationState {
  name: string
  rating: number
  ingredients: Ingredient[]
  steps: Step[]
  memo: string
  lastCookedAt: string // yyyy-mm-dd or ''
}

export function emptyVariation(): VariationState {
  return { name: '', rating: 0, ingredients: [{ name: '', amount: '' }], steps: [{ order: 1, text: '' }], memo: '', lastCookedAt: '' }
}

export default function VariationFields({ state, setState, nameLabel = 'バリエーション名' }: {
  state: VariationState
  setState: (s: VariationState) => void
  nameLabel?: string
}) {
  const [showMemo, setShowMemo] = useState(!!state.memo)
  const set = <K extends keyof VariationState>(k: K, v: VariationState[K]) => setState({ ...state, [k]: v })

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{nameLabel} *</label>
        <input
          required
          value={state.name}
          onChange={e => set('name', e.target.value)}
          placeholder="例: 醤油＋みりん"
          className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">評価</label>
        <StarRating value={state.rating} onChange={v => set('rating', v)} size="lg" />
      </div>

      <IngredientEditor value={state.ingredients} onChange={v => set('ingredients', v)} />
      <StepEditor value={state.steps} onChange={v => set('steps', v)} />

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">最終調理日</label>
        <input
          type="date"
          value={state.lastCookedAt}
          onChange={e => set('lastCookedAt', e.target.value)}
          className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
        />
      </div>

      {/* メモ: デフォルト折りたたみ */}
      {showMemo ? (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">メモ・コツ</label>
          <textarea
            value={state.memo}
            onChange={e => set('memo', e.target.value)}
            placeholder="次回への改善点やコツなど..."
            rows={3}
            className="w-full border rounded-xl px-4 py-3 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      ) : (
        <button type="button" onClick={() => setShowMemo(true)} className="text-sm font-semibold" style={{ color: '#C2410C' }}>
          ＋ メモを追加
        </button>
      )}
    </div>
  )
}

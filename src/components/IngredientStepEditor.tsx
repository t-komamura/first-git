'use client'

import { Ingredient, Step } from '@/lib/schema'

export function IngredientEditor({ value, onChange }: { value: Ingredient[]; onChange: (v: Ingredient[]) => void }) {
  function update(i: number, field: keyof Ingredient, val: string) {
    onChange(value.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)))
  }
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">食材・分量</label>
      <div className="space-y-2">
        {value.map((ing, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={ing.name}
              onChange={e => update(i, 'name', e.target.value)}
              placeholder="食材名"
              className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              value={ing.amount}
              onChange={e => update(i, 'amount', e.target.value)}
              placeholder="分量"
              className="w-28 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {value.length > 1 && (
              <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-red-400 text-xl shrink-0">×</button>
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...value, { name: '', amount: '' }])} className="mt-2 text-sm font-semibold" style={{ color: '#C2410C' }}>+ 食材を追加</button>
    </div>
  )
}

export function StepEditor({ value, onChange }: { value: Step[]; onChange: (v: Step[]) => void }) {
  function update(i: number, val: string) {
    onChange(value.map((s, idx) => (idx === i ? { ...s, text: val } : s)))
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, order: idx + 1 })))
  }
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">手順</label>
      <div className="space-y-2">
        {value.map((step, i) => (
          <div key={i} className="flex gap-2 items-start">
            <span className="mt-2.5 text-sm font-bold w-6 shrink-0" style={{ color: '#C2410C' }}>{i + 1}.</span>
            <textarea
              value={step.text}
              onChange={e => update(i, e.target.value)}
              placeholder={`手順 ${i + 1}`}
              rows={2}
              className="flex-1 border rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {value.length > 1 && (
              <button type="button" onClick={() => remove(i)} className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-red-400 text-xl shrink-0">×</button>
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...value, { order: value.length + 1, text: '' }])} className="mt-2 text-sm font-semibold" style={{ color: '#C2410C' }}>+ 手順を追加</button>
    </div>
  )
}

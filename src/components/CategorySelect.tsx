'use client'

import { useState, useEffect } from 'react'
import { Category, loadCategories, addCategory } from '@/lib/categories'

export default function CategorySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [cats, setCats] = useState<Category[]>([])
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('🍽️')

  useEffect(() => { setCats(loadCategories()) }, [])

  function handleAdd() {
    if (!newName.trim()) return
    const cat = { name: newName.trim(), emoji: newEmoji.trim() || '🍽️' }
    addCategory(cat)
    setCats(loadCategories())
    onChange(cat.name)
    setNewName('')
    setNewEmoji('🍽️')
    setAdding(false)
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">カテゴリー</label>
      <div className="flex flex-wrap gap-2">
        {cats.map(c => (
          <button
            key={c.name}
            type="button"
            onClick={() => onChange(c.name === value ? '' : c.name)}
            className="text-sm px-3 rounded-full border transition-colors"
            style={{
              minHeight: 44,
              backgroundColor: value === c.name ? '#E85D04' : '#fff',
              color: value === c.name ? '#fff' : '#57534E',
              borderColor: value === c.name ? '#E85D04' : '#D6D3D1',
            }}
          >
            {c.emoji} {c.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setAdding(v => !v)}
          className="text-sm px-3 rounded-full border border-dashed text-gray-500"
          style={{ minHeight: 44 }}
        >
          ＋ 追加
        </button>
      </div>

      {adding && (
        <div className="mt-3 flex gap-2 items-center bg-white border rounded-xl p-3">
          <input
            value={newEmoji}
            onChange={e => setNewEmoji(e.target.value)}
            className="w-14 border rounded-lg px-2 py-2 text-center text-lg"
            maxLength={2}
          />
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="カテゴリー名"
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button type="button" onClick={handleAdd} className="text-white text-sm px-4 py-2 rounded-lg" style={{ backgroundColor: '#E85D04' }}>追加</button>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import StarRating from './StarRating'
import { Recipe, Ingredient, Step } from '@/lib/db'

const CATEGORIES = ['和食', '洋食', '中華', 'おつまみ', 'スイーツ', 'その他']

interface RecipeFormProps {
  initial?: Recipe
}

export default function RecipeForm({ initial }: RecipeFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [rating, setRating] = useState(initial?.rating ?? 0)
  const [ingredients, setIngredients] = useState<Ingredient[]>(initial?.ingredients ?? [{ name: '', amount: '' }])
  const [steps, setSteps] = useState<Step[]>(initial?.steps ?? [{ order: 1, text: '' }])
  const [tags, setTags] = useState(initial?.tags ?? '')
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '')
  const [pasteText, setPasteText] = useState('')
  const [parsing, setParsing] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleParse() {
    if (!pasteText.trim()) return
    setParsing(true)
    try {
      const res = await fetch('/api/parse-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pasteText }),
      })
      const data = await res.json()
      if (data.title) setTitle(data.title)
      if (data.description) setDescription(data.description)
      if (data.category) setCategory(data.category)
      if (data.ingredients?.length) setIngredients(data.ingredients)
      if (data.steps?.length) setSteps(data.steps)
      if (data.tags) setTags(data.tags)
      setPasteText('')
    } catch {
      alert('パースに失敗しました')
    } finally {
      setParsing(false)
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.url) setImageUrl(data.url)
  }

  function addIngredient() { setIngredients(prev => [...prev, { name: '', amount: '' }]) }
  function removeIngredient(i: number) { setIngredients(prev => prev.filter((_, idx) => idx !== i)) }
  function updateIngredient(i: number, field: keyof Ingredient, val: string) {
    setIngredients(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: val } : item))
  }

  function addStep() { setSteps(prev => [...prev, { order: prev.length + 1, text: '' }]) }
  function removeStep(i: number) {
    setSteps(prev => prev.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, order: idx + 1 })))
  }
  function updateStep(i: number, val: string) {
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, text: val } : s))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = { title, description, category, rating, ingredients, steps, tags, imageUrl }
    const url = initial ? `/api/recipes/${initial.id}` : '/api/recipes'
    const method = initial ? 'PUT' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* AIパース */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 space-y-3">
        <p className="font-semibold text-orange-700">✨ AIで自動入力</p>
        <p className="text-sm text-orange-600">ChatGPT / Claude のレスポンスをここに貼り付けてください</p>
        <textarea
          value={pasteText}
          onChange={e => setPasteText(e.target.value)}
          placeholder="レシピのテキストをここにペースト..."
          className="w-full h-32 rounded-xl border border-orange-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white resize-none"
        />
        <button
          type="button"
          onClick={handleParse}
          disabled={parsing || !pasteText.trim()}
          className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-semibold disabled:opacity-50 hover:bg-orange-600 transition-colors"
        >
          {parsing ? '解析中...' : '自動で読み込む ✨'}
        </button>
      </div>

      {/* タイトル */}
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

      {/* カテゴリ */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">カテゴリ</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">選択してください</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* ★評価 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">評価</label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      {/* 食材 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">食材・分量</label>
        <div className="space-y-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={ing.name}
                onChange={e => updateIngredient(i, 'name', e.target.value)}
                placeholder="食材名"
                className="flex-1 border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              />
              <input
                value={ing.amount}
                onChange={e => updateIngredient(i, 'amount', e.target.value)}
                placeholder="分量"
                className="w-28 border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              />
              {ingredients.length > 1 && (
                <button type="button" onClick={() => removeIngredient(i)} className="text-gray-400 hover:text-red-400 text-xl leading-none">×</button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addIngredient} className="mt-2 text-sm text-orange-500 hover:text-orange-700 font-semibold">+ 食材を追加</button>
      </div>

      {/* 手順 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">手順</label>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="mt-2.5 text-sm font-bold text-orange-500 w-6 shrink-0">{i + 1}.</span>
              <textarea
                value={step.text}
                onChange={e => updateStep(i, e.target.value)}
                placeholder={`手順 ${i + 1}`}
                rows={2}
                className="flex-1 border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm resize-none"
              />
              {steps.length > 1 && (
                <button type="button" onClick={() => removeStep(i)} className="mt-2 text-gray-400 hover:text-red-400 text-xl leading-none">×</button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addStep} className="mt-2 text-sm text-orange-500 hover:text-orange-700 font-semibold">+ 手順を追加</button>
      </div>

      {/* メモ */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">メモ・コツ</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="気づいたことや次回への改善メモなど..."
          rows={3}
          className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none text-sm"
        />
      </div>

      {/* タグ */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">タグ（カンマ区切り）</label>
        <input
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="例: 簡単, 時短, お弁当"
          className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
        />
      </div>

      {/* 写真 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">写真</label>
        {imageUrl && <img src={imageUrl} alt="preview" className="w-full h-48 object-cover rounded-xl mb-2" />}
        <button type="button" onClick={() => fileRef.current?.click()} className="text-sm text-orange-500 hover:text-orange-700 font-semibold border border-orange-300 rounded-xl px-4 py-2">
          {imageUrl ? '写真を変更' : '写真を追加'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-orange-500 text-white py-3.5 rounded-2xl font-bold text-lg disabled:opacity-50 hover:bg-orange-600 transition-colors"
      >
        {saving ? '保存中...' : (initial ? '更新する' : '保存する')}
      </button>
    </form>
  )
}

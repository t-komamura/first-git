'use client'

import { useState } from 'react'

interface AiPasteBoxProps {
  mode: 'dish' | 'variation'
  onParsed: (data: Record<string, unknown>) => void
}

export default function AiPasteBox({ mode, onParsed }: AiPasteBoxProps) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  async function handleParse() {
    if (!text.trim()) return
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/parse-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      onParsed(data)
      setText('')
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl p-4 space-y-3" style={{ backgroundColor: '#FFF1E6', border: '1px solid #FBD9BD' }}>
      <p className="font-semibold" style={{ color: '#C2410C' }}>✨ AIで自動入力</p>
      <p className="text-sm" style={{ color: '#C2410C' }}>ChatGPT / Claude のレシピをここに貼り付け</p>

      {loading ? (
        <div className="space-y-2 animate-pulse" aria-live="polite">
          <div className="h-4 bg-orange-200 rounded w-2/3" />
          <div className="h-4 bg-orange-200 rounded w-1/2" />
          <div className="h-4 bg-orange-200 rounded w-3/4" />
          <p className="text-sm text-orange-500 pt-1">レシピを解析中…</p>
        </div>
      ) : (
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="レシピのテキストをここにペースト..."
          rows={text ? 8 : 3}
          className="w-full rounded-xl border p-3 text-sm bg-white resize-none focus:outline-none focus:ring-2 transition-all"
          style={{ borderColor: '#FBD9BD' }}
        />
      )}

      {error && (
        <p className="text-sm text-red-500">
          解析に失敗しました。もう一度試すか、下のフォームに手動で入力してください。
        </p>
      )}

      <button
        type="button"
        onClick={handleParse}
        disabled={loading || !text.trim()}
        className="w-full text-white py-2.5 rounded-xl font-semibold disabled:opacity-50 transition-colors"
        style={{ backgroundColor: '#E85D04' }}
      >
        {loading ? '解析中...' : error ? 'もう一度読み込む 🔄' : '自動で読み込む ✨'}
      </button>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Fab() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  function go(path: string) {
    setOpen(false)
    router.push(path)
  }

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col items-end gap-2 mb-1">
          <button
            onClick={() => go('/dishes/new')}
            className="bg-white shadow-md rounded-full pl-4 pr-5 py-3 text-sm font-semibold flex items-center gap-2"
            style={{ color: '#C2410C', minHeight: 44 }}
          >
            ✨ AIから貼り付け
          </button>
          <button
            onClick={() => go('/dishes/new?manual=1')}
            className="bg-white shadow-md rounded-full pl-4 pr-5 py-3 text-sm font-semibold flex items-center gap-2 text-gray-700"
            style={{ minHeight: 44 }}
          >
            ✏️ 手動で入力
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="料理を追加"
        className="w-14 h-14 rounded-full text-white text-3xl shadow-lg flex items-center justify-center transition-transform"
        style={{ backgroundColor: '#E85D04', transform: open ? 'rotate(45deg)' : 'none' }}
      >
        ＋
      </button>
      {open && <div className="fixed inset-0 -z-10 bg-black/20" onClick={() => setOpen(false)} />}
    </div>
  )
}

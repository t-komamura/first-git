'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import VariationForm from '@/components/VariationForm'
import { Variation } from '@/lib/schema'

export default function EditVariationPage() {
  const { id, vid } = useParams<{ id: string; vid: string }>()
  const [variation, setVariation] = useState<Variation | null>(null)

  useEffect(() => {
    fetch(`/api/dishes/${id}/variations/${vid}`).then(r => r.json()).then(setVariation)
  }, [id, vid])

  if (!variation) return <div className="min-h-screen flex items-center justify-center text-gray-400" style={{ backgroundColor: '#FFF8F0' }}>読み込み中...</div>

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/dishes/${id}/variations/${vid}`} className="text-2xl" style={{ color: '#C2410C' }}>←</Link>
          <h1 className="text-xl font-bold text-gray-800">バリエーションを編集</h1>
        </div>
        <VariationForm dishId={id} initial={variation} />
      </div>
    </main>
  )
}

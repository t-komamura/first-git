'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import VariationForm from '@/components/VariationForm'
import { Dish } from '@/lib/schema'

export default function NewVariationPage() {
  const { id } = useParams<{ id: string }>()
  const [dish, setDish] = useState<Dish | null>(null)

  useEffect(() => {
    fetch(`/api/dishes/${id}`).then(r => r.json()).then(setDish)
  }, [id])

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/dishes/${id}`} className="text-2xl" style={{ color: '#C2410C' }}>←</Link>
          <div>
            <p className="text-xs text-gray-400">{dish?.title}</p>
            <h1 className="text-xl font-bold text-gray-800">バリエーションを追加</h1>
          </div>
        </div>
        <VariationForm dishId={id} />
      </div>
    </main>
  )
}

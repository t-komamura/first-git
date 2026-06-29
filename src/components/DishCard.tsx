import Link from 'next/link'
import StarRating from './StarRating'
import { emojiFor } from '@/lib/categories'

export interface DishListItem {
  id: string
  title: string
  category: string | null
  variationCount: number
  bestRating: number | null
}

export default function DishCard({ dish, rank }: { dish: DishListItem; rank?: number }) {
  return (
    <Link href={`/dishes/${dish.id}`} className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex items-start gap-2">
        {rank !== undefined && <span className="text-xl font-bold leading-tight shrink-0" style={{ color: '#C2410C' }}>#{rank}</span>}
        <span className="text-3xl shrink-0">{emojiFor(dish.category)}</span>
      </div>
      <h3 className="font-bold text-gray-800 mt-2 leading-snug break-words">{dish.title}</h3>
      {dish.category && (
        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FFF1E6', color: '#C2410C' }}>
          {dish.category}
        </span>
      )}
      <div className="mt-2 flex items-center justify-between">
        <StarRating value={dish.bestRating ?? 0} readonly />
        <span className="text-xs" style={{ color: dish.variationCount === 0 ? '#C2410C' : '#78716C' }}>
          {dish.variationCount === 0 ? '未登録' : `${dish.variationCount}種`}
        </span>
      </div>
    </Link>
  )
}

import Link from 'next/link'
import { Recipe } from '@/lib/db'
import StarRating from './StarRating'

interface RecipeCardProps {
  recipe: Recipe
  rank?: number
}

export default function RecipeCard({ recipe, rank }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`} className="block bg-white rounded-2xl shadow hover:shadow-md transition-shadow overflow-hidden">
      {recipe.imageUrl ? (
        <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-orange-50 flex items-center justify-center text-5xl">🍽️</div>
      )}
      <div className="p-4">
        <div className="flex items-start gap-2">
          {rank && <span className="text-2xl font-bold text-orange-400 leading-tight">#{rank}</span>}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 text-lg leading-tight truncate">{recipe.title}</h3>
            {recipe.category && (
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{recipe.category}</span>
            )}
          </div>
        </div>
        <div className="mt-2">
          <StarRating value={recipe.rating} readonly />
        </div>
        {recipe.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{recipe.description}</p>
        )}
      </div>
    </Link>
  )
}

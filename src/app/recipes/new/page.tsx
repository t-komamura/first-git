import Link from 'next/link'
import RecipeForm from '@/components/RecipeForm'

export default function NewRecipePage() {
  return (
    <main className="min-h-screen bg-orange-50">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-orange-500 hover:text-orange-700 text-2xl">←</Link>
          <h1 className="text-xl font-bold text-gray-800">レシピを追加</h1>
        </div>
        <RecipeForm />
      </div>
    </main>
  )
}

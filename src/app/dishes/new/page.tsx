import Link from 'next/link'
import DishForm from '@/components/DishForm'

export default async function NewDishPage({ searchParams }: { searchParams: Promise<{ manual?: string }> }) {
  const { manual } = await searchParams
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-2xl" style={{ color: '#C2410C' }}>←</Link>
          <h1 className="text-xl font-bold text-gray-800">料理を追加</h1>
        </div>
        <DishForm hideAi={manual === '1'} />
      </div>
    </main>
  )
}

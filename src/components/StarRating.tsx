'use client'

interface StarRatingProps {
  value?: number
  onChange?: (v: number) => void
  readonly?: boolean
  size?: 'sm' | 'lg'
}

export default function StarRating({ value = 0, onChange, readonly = false, size = 'sm' }: StarRatingProps) {
  const starSize = size === 'lg' ? 'text-3xl' : 'text-xl'
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(n)}
          className={`${starSize} ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'} ${n <= value ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

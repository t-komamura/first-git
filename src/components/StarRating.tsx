'use client'

interface StarRatingProps {
  value?: number | null
  onChange?: (v: number) => void
  readonly?: boolean
  size?: 'sm' | 'lg'
}

export default function StarRating({ value = 0, onChange, readonly = false, size = 'sm' }: StarRatingProps) {
  const v = value ?? 0
  const starSize = size === 'lg' ? 'text-4xl' : 'text-xl'
  const pad = size === 'lg' ? 'p-1' : ''
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          aria-label={`${n}つ星`}
          onClick={() => onChange?.(n)}
          className={`${starSize} ${pad} leading-none ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}`}
          style={{ color: n <= v ? '#FFB800' : '#D6D3D1' }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

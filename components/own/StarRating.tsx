'use client'

import { cn } from '@/lib/utils'

type StarRatingProps = {
  value: number
  size?: 'sm' | 'md' | 'lg'
  onChange?: (next: number) => void
  className?: string
}

const SIZE_CLASSES: Record<NonNullable<StarRatingProps['size']>, string> = {
  sm: 'text-sm',
  md: 'text-xl',
  lg: 'text-2xl',
}

export function StarRating({ value, size = 'md', onChange, className }: StarRatingProps) {
  const interactive = typeof onChange === 'function'
  const sizeClass = SIZE_CLASSES[size]

  return (
    <div
      className={cn('inline-flex items-center gap-1', className)}
      role={interactive ? 'radiogroup' : undefined}
      aria-label={`별점 ${value}점`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value
        const baseClass = cn(
          sizeClass,
          'leading-none transition-colors',
          filled ? 'text-amber-400' : 'text-gray-300',
        )
        if (!interactive) {
          return (
            <span key={star} aria-hidden className={baseClass}>
              ★
            </span>
          )
        }
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star}점`}
            onClick={() => onChange?.(star)}
            className={cn(baseClass, 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand rounded')}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}
